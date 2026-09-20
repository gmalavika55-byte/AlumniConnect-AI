package com.alumniconnect.mentorship.serviceimpl;

import java.time.Instant;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.alumniconnect.mentorship.entity.MentorshipMessage;
import com.alumniconnect.mentorship.entity.MentorshipRequest;
import com.alumniconnect.mentorship.exception.ResourceNotFoundException;
import com.alumniconnect.mentorship.repository.MentorshipMessageRepository;
import com.alumniconnect.mentorship.repository.MentorshipRequestRepository;
import com.alumniconnect.mentorship.service.MentorshipService;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Service
public class MentorshipServiceImpl implements MentorshipService {

    @Autowired
    private MentorshipRequestRepository mentorshipRepository;

    @Autowired
    private MentorshipMessageRepository messageRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${auth-service.url}")
    private String authServiceUrl;

    @Value("${jaas.app-id:vpaas-magic-cookie-alumniconnect}")
    private String jaasAppId;

    @Value("${jaas.key-id:k_alumniconnect}")
    private String jaasKeyId;

    @Value("${jaas.private-key:}")
    private String jaasPrivateKeyPem;

    private KeyPair fallbackKeyPair;

    // Active statuses that block a new request from the same student to the same alumni
    private static final List<String> ACTIVE_STATUSES = List.of("PENDING", "ACCEPTED");

    private synchronized KeyPair getFallbackKeyPair() {
        if (fallbackKeyPair == null) {
            try {
                KeyPairGenerator kpg = KeyPairGenerator.getInstance("RSA");
                kpg.initialize(2048);
                fallbackKeyPair = kpg.generateKeyPair();
            } catch (Exception e) {
                throw new RuntimeException("Failed to generate fallback RSA KeyPair", e);
            }
        }
        return fallbackKeyPair;
    }

    private PrivateKey getPrivateKey() {
        if (jaasPrivateKeyPem != null && !jaasPrivateKeyPem.trim().isEmpty()) {
            try {
                String sanitized = jaasPrivateKeyPem
                        .replace("-----BEGIN PRIVATE KEY-----", "")
                        .replace("-----END PRIVATE KEY-----", "")
                        .replace("-----BEGIN RSA PRIVATE KEY-----", "")
                        .replace("-----END RSA PRIVATE KEY-----", "")
                        .replaceAll("\\s+", "");
                byte[] decoded = Base64.getDecoder().decode(sanitized);
                PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(decoded);
                KeyFactory kf = KeyFactory.getInstance("RSA");
                return kf.generatePrivate(spec);
            } catch (Exception e) {
                System.err.println("Failed to parse JAAS_PRIVATE_KEY, falling back to generated RSA key: " + e.getMessage());
            }
        }
        return getFallbackKeyPair().getPrivate();
    }

    private String generateJaasJwt(String roomName, Integer userId, String userName, String userEmail) {
        PrivateKey privateKey = getPrivateKey();
        Instant now = Instant.now();

        Map<String, Object> header = new HashMap<>();
        header.put("alg", "RS256");
        header.put("kid", jaasKeyId != null ? jaasKeyId : "k_alumniconnect");
        header.put("typ", "JWT");

        Map<String, Object> userContext = new HashMap<>();
        userContext.put("id", userId != null ? String.valueOf(userId) : "0");
        userContext.put("name", userName != null ? userName : "Participant");
        userContext.put("email", userEmail != null ? userEmail : "user@alumniconnect.com");
        userContext.put("avatar", "");
        userContext.put("moderator", true); // Granting room initialization authority to participants

        Map<String, Object> featuresContext = new HashMap<>();
        featuresContext.put("recording", false);
        featuresContext.put("livestreaming", false);
        featuresContext.put("screen-sharing", true);

        Map<String, Object> context = new HashMap<>();
        context.put("user", userContext);
        context.put("features", featuresContext);

        return Jwts.builder()
                .setHeader(header)
                .setIssuer("chat")
                .setSubject(jaasAppId != null ? jaasAppId : "vpaas-magic-cookie-alumniconnect")
                .setAudience("jitsi")
                .claim("room", roomName)
                .claim("context", context)
                .setIssuedAt(Date.from(now))
                .setNotBefore(Date.from(now.minusSeconds(10)))
                .setExpiration(Date.from(now.plusSeconds(7200)))
                .signWith(privateKey, SignatureAlgorithm.RS256)
                .compact();
    }

    @Override
    public MentorshipRequest addMentorship(MentorshipRequest mentorship) {
        // Normalise status to uppercase before saving
        if (mentorship.getStatus() != null) {
            mentorship.setStatus(mentorship.getStatus().toUpperCase());
        } else {
            mentorship.setStatus("PENDING");
        }

        // Duplicate prevention: reject if an active (PENDING/ACCEPTED) request already exists
        if (mentorship.getStudentId() != null && mentorship.getAlumniId() != null) {
            Optional<MentorshipRequest> existing = mentorshipRepository
                    .findByStudentIdAndAlumniIdAndStatusIn(
                            mentorship.getStudentId(),
                            mentorship.getAlumniId(),
                            ACTIVE_STATUSES);
            if (existing.isPresent()) {
                throw new IllegalArgumentException(
                        "You already have an active mentorship request with this alumni.");
            }
        }

        MentorshipRequest saved = mentorshipRepository.save(mentorship);
        hydrateUserProfiles(saved);

        // Create notification for target alumni in auth-service
        if (saved.getAlumniId() != null) {
            try {
                String studentName = "A student";
                if (saved.getStudent() instanceof java.util.Map) {
                    java.util.Map<?, ?> studentMap = (java.util.Map<?, ?>) saved.getStudent();
                    if (studentMap.get("name") != null && !studentMap.get("name").toString().trim().isEmpty()) {
                        studentName = studentMap.get("name").toString().trim();
                    }
                }

                java.util.Map<String, Object> notifPayload = new java.util.HashMap<>();
                notifPayload.put("userId", saved.getAlumniId().longValue());
                notifPayload.put("userType", "ALUMNI");
                notifPayload.put("title", "New Mentorship Request");
                notifPayload.put("message", studentName + " has requested a mentorship session with you.");
                notifPayload.put("notificationDate", java.time.LocalDateTime.now().toString());
                notifPayload.put("status", "UNREAD");

                restTemplate.postForObject(authServiceUrl + "/notification/add", notifPayload, Object.class);
            } catch (Exception e) {
                System.err.println("Failed to create notification for alumni " + saved.getAlumniId() + ": " + e.getMessage());
            }
        }

        // Create ADMIN notification
        try {
            java.util.Map<String, Object> adminNotifPayload = new java.util.HashMap<>();
            adminNotifPayload.put("userId", saved.getRequestId());
            adminNotifPayload.put("userType", "ADMIN");
            adminNotifPayload.put("title", "New Mentorship Request");
            adminNotifPayload.put("message", "A student has submitted a new mentorship request.");
            adminNotifPayload.put("notificationDate", java.time.LocalDateTime.now().toString());
            adminNotifPayload.put("status", "UNREAD");

            restTemplate.postForObject(authServiceUrl + "/notification/add", adminNotifPayload, Object.class);
        } catch (Exception e) {
            System.err.println("Failed to create ADMIN notification for mentorship request: " + e.getMessage());
        }

        return saved;
    }

    @Override
    public MentorshipRequest updateMentorship(MentorshipRequest mentorship) {
        // Normalise status to uppercase
        if (mentorship.getStatus() != null) {
            mentorship.setStatus(mentorship.getStatus().toUpperCase());
        }
        MentorshipRequest saved = mentorshipRepository.save(mentorship);
        hydrateUserProfiles(saved);
        return saved;
    }

    @Override
    public void deleteMentorship(Long requestId) {
        MentorshipRequest mentorship = mentorshipRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentorship Request not found"));
        mentorshipRepository.delete(mentorship);
    }

    @Override
    public MentorshipRequest getMentorshipById(Long requestId) {
        MentorshipRequest mentorship = mentorshipRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentorship Request not found"));
        hydrateUserProfiles(mentorship);
        return mentorship;
    }

    @Override
    public List<MentorshipRequest> getAllMentorships() {
        List<MentorshipRequest> list = mentorshipRepository.findAll();
        list.forEach(this::hydrateUserProfiles);
        return list;
    }

    @Override
    public MentorshipRequest cancelMentorshipRequest(Long requestId, Integer studentId) {
        MentorshipRequest request = mentorshipRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentorship Request not found"));

        if (studentId == null || !studentId.equals(request.getStudentId())) {
            throw new IllegalArgumentException("You are not authorized to cancel this request.");
        }

        if (!"PENDING".equalsIgnoreCase(request.getStatus())) {
            throw new IllegalArgumentException("Only PENDING requests can be cancelled.");
        }

        request.setStatus("CANCELLED");
        MentorshipRequest saved = mentorshipRepository.save(request);
        hydrateUserProfiles(saved);
        return saved;
    }

    @Override
    public MentorshipRequest acceptMentorshipRequest(Long requestId, Integer alumniId) {
        MentorshipRequest request = mentorshipRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentorship Request not found"));

        if (alumniId == null || !alumniId.equals(request.getAlumniId())) {
            throw new IllegalArgumentException("You are not authorized to accept this request.");
        }

        if (!"PENDING".equalsIgnoreCase(request.getStatus())) {
            throw new IllegalArgumentException("Only PENDING requests can be accepted.");
        }

        request.setStatus("ACCEPTED");

        // Generate Jitsi room name (e.g. alumniconnect-mentorship-14-6ddd3e56...) if missing
        if (request.getMeetingLink() == null || request.getMeetingLink().trim().isEmpty()) {
            String roomName = "alumniconnect-mentorship-" + requestId + "-" + java.util.UUID.randomUUID().toString();
            request.setMeetingLink(roomName);
        } else if (request.getMeetingLink().contains("/")) {
            // Normalize old full URL strings into clean roomName
            String raw = request.getMeetingLink();
            String clean = raw.substring(raw.lastIndexOf('/') + 1);
            request.setMeetingLink(clean);
        }

        MentorshipRequest saved = mentorshipRepository.save(request);
        hydrateUserProfiles(saved);

        try {
            java.util.Map<String, Object> adminNotifPayload = new java.util.HashMap<>();
            adminNotifPayload.put("userId", saved.getRequestId());
            adminNotifPayload.put("userType", "ADMIN");
            adminNotifPayload.put("title", "Mentorship Request Accepted");
            adminNotifPayload.put("message", "Mentorship request #" + saved.getRequestId() + " has been accepted.");
            adminNotifPayload.put("notificationDate", java.time.LocalDateTime.now().toString());
            adminNotifPayload.put("status", "UNREAD");

            restTemplate.postForObject(authServiceUrl + "/notification/add", adminNotifPayload, Object.class);
        } catch (Exception e) {}

        if (saved.getStudentId() != null) {
            try {
                String alumniName = "Alumni";
                if (saved.getAlumni() instanceof java.util.Map) {
                    java.util.Map<?, ?> alumniMap = (java.util.Map<?, ?>) saved.getAlumni();
                    if (alumniMap.get("name") != null && !alumniMap.get("name").toString().trim().isEmpty()) {
                        alumniName = alumniMap.get("name").toString().trim();
                    }
                }

                java.util.Map<String, Object> stuNotifPayload = new java.util.HashMap<>();
                stuNotifPayload.put("userId", saved.getStudentId().longValue());
                stuNotifPayload.put("userType", "STUDENT");
                stuNotifPayload.put("title", "Mentorship Request Accepted");
                stuNotifPayload.put("message", alumniName + " accepted your mentorship request.");
                stuNotifPayload.put("notificationDate", java.time.LocalDateTime.now().toString());
                stuNotifPayload.put("status", "UNREAD");

                restTemplate.postForObject(authServiceUrl + "/notification/add", stuNotifPayload, Object.class);
            } catch (Exception e) {}
        }

        return saved;
    }

    @Override
    public MentorshipRequest rejectMentorshipRequest(Long requestId, Integer alumniId) {
        MentorshipRequest request = mentorshipRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentorship Request not found"));

        if (alumniId == null || !alumniId.equals(request.getAlumniId())) {
            throw new IllegalArgumentException("You are not authorized to reject this request.");
        }

        if (!"PENDING".equalsIgnoreCase(request.getStatus())) {
            throw new IllegalArgumentException("Only PENDING requests can be rejected.");
        }

        request.setStatus("REJECTED");
        MentorshipRequest saved = mentorshipRepository.save(request);
        hydrateUserProfiles(saved);

        try {
            java.util.Map<String, Object> adminNotifPayload = new java.util.HashMap<>();
            adminNotifPayload.put("userId", saved.getRequestId());
            adminNotifPayload.put("userType", "ADMIN");
            adminNotifPayload.put("title", "Mentorship Request Rejected");
            adminNotifPayload.put("message", "Mentorship request #" + saved.getRequestId() + " has been rejected.");
            adminNotifPayload.put("notificationDate", java.time.LocalDateTime.now().toString());
            adminNotifPayload.put("status", "UNREAD");

            restTemplate.postForObject(authServiceUrl + "/notification/add", adminNotifPayload, Object.class);
        } catch (Exception e) {}

        if (saved.getStudentId() != null) {
            try {
                String alumniName = "Alumni";
                if (saved.getAlumni() instanceof java.util.Map) {
                    java.util.Map<?, ?> alumniMap = (java.util.Map<?, ?>) saved.getAlumni();
                    if (alumniMap.get("name") != null && !alumniMap.get("name").toString().trim().isEmpty()) {
                        alumniName = alumniMap.get("name").toString().trim();
                    }
                }

                java.util.Map<String, Object> stuNotifPayload = new java.util.HashMap<>();
                stuNotifPayload.put("userId", saved.getStudentId().longValue());
                stuNotifPayload.put("userType", "STUDENT");
                stuNotifPayload.put("title", "Mentorship Request Rejected");
                stuNotifPayload.put("message", alumniName + " rejected your mentorship request.");
                stuNotifPayload.put("notificationDate", java.time.LocalDateTime.now().toString());
                stuNotifPayload.put("status", "UNREAD");

                restTemplate.postForObject(authServiceUrl + "/notification/add", stuNotifPayload, Object.class);
            } catch (Exception e) {}
        }

        return saved;
    }

    @Override
    public MentorshipRequest completeMentorshipRequest(Long requestId, Integer alumniId) {
        MentorshipRequest request = mentorshipRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentorship Request not found"));

        if (alumniId == null || !alumniId.equals(request.getAlumniId())) {
            throw new IllegalArgumentException("You are not authorized to complete this request.");
        }

        if (!"ACCEPTED".equalsIgnoreCase(request.getStatus())) {
            throw new IllegalArgumentException("Only ACCEPTED requests can be marked as completed.");
        }

        request.setStatus("COMPLETED");
        MentorshipRequest saved = mentorshipRepository.save(request);
        hydrateUserProfiles(saved);
        return saved;
    }

    @Override
    public String getMeetingLinkForJoin(Long requestId, Integer userId, String userType) {
        Map<String, String> details = getJoinSessionDetails(requestId, userId, userType);
        return details.get("meetingLink");
    }

    @Override
    public Map<String, String> getJoinSessionDetails(Long requestId, Integer userId, String userType) {
        MentorshipRequest request = mentorshipRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentorship Request not found"));

        if (!"ACCEPTED".equalsIgnoreCase(request.getStatus())) {
            throw new IllegalArgumentException("Video session is available only for active mentorships.");
        }

        if ("STUDENT".equalsIgnoreCase(userType)) {
            if (userId == null || !userId.equals(request.getStudentId())) {
                throw new IllegalArgumentException("You are not authorized to join this mentorship session.");
            }
        } else if ("ALUMNI".equalsIgnoreCase(userType)) {
            if (userId == null || !userId.equals(request.getAlumniId())) {
                throw new IllegalArgumentException("You are not authorized to join this mentorship session.");
            }
        } else {
            throw new IllegalArgumentException("Invalid user type specified.");
        }

        // If meeting link doesn't exist yet for an accepted request, generate and save it
        if (request.getMeetingLink() == null || request.getMeetingLink().trim().isEmpty()) {
            String roomName = "alumniconnect-mentorship-" + requestId + "-" + java.util.UUID.randomUUID().toString();
            request.setMeetingLink(roomName);
            mentorshipRepository.save(request);
        }

        // Extract pure roomName if stored as a full URL previously
        String rawLink = request.getMeetingLink();
        String roomName = rawLink.contains("/") ? rawLink.substring(rawLink.lastIndexOf('/') + 1) : rawLink;
        if (roomName.contains("#")) {
            roomName = roomName.substring(0, roomName.indexOf('#'));
        }

        // Hydrate profiles to extract participant name & email for JWT context
        hydrateUserProfiles(request);
        String userName = "Participant";
        String userEmail = "user@alumniconnect.com";

        if ("STUDENT".equalsIgnoreCase(userType) && request.getStudent() instanceof Map) {
            Map<?, ?> studentMap = (Map<?, ?>) request.getStudent();
            if (studentMap.get("name") != null) userName = studentMap.get("name").toString();
            if (studentMap.get("email") != null) userEmail = studentMap.get("email").toString();
        } else if ("ALUMNI".equalsIgnoreCase(userType) && request.getAlumni() instanceof Map) {
            Map<?, ?> alumniMap = (Map<?, ?>) request.getAlumni();
            if (alumniMap.get("name") != null) userName = alumniMap.get("name").toString();
            if (alumniMap.get("email") != null) userEmail = alumniMap.get("email").toString();
        }

        String jwt = generateJaasJwt(roomName, userId, userName, userEmail);
        String appId = (jaasAppId != null && !jaasAppId.trim().isEmpty()) ? jaasAppId : "vpaas-magic-cookie-alumniconnect";
        String fullRoomName = appId + "/" + roomName;
        String meetingLink = "https://8x8.vc/" + fullRoomName + "#jwt=" + jwt;

        Map<String, String> response = new HashMap<>();
        response.put("appId", appId);
        response.put("roomName", roomName);
        response.put("fullRoomName", fullRoomName);
        response.put("jwt", jwt);
        response.put("meetingLink", meetingLink);
        return response;
    }

    private void hydrateUserProfiles(MentorshipRequest request) {
        if (request.getStudentId() != null) {
            try {
                Object student = restTemplate.getForObject(
                        authServiceUrl + "/student/get/" + request.getStudentId(), Object.class);
                request.setStudent(student);
            } catch (Exception e) {
                request.setStudent(null);
            }
        }
        if (request.getAlumniId() != null) {
            try {
                Object alumni = restTemplate.getForObject(
                        authServiceUrl + "/alumni/get/" + request.getAlumniId(), Object.class);
                request.setAlumni(alumni);
            } catch (Exception e) {
                request.setAlumni(null);
            }
        }
    }

    @Override
    public MentorshipMessage sendMessage(Long mentorshipId, Integer senderId, String senderType, String messageText) {
        if (mentorshipId == null) {
            throw new IllegalArgumentException("Mentorship ID is required.");
        }
        if (senderId == null || senderType == null || senderType.trim().isEmpty()) {
            throw new IllegalArgumentException("Sender ID and Sender Type are required.");
        }
        if (messageText == null || messageText.trim().isEmpty()) {
            throw new IllegalArgumentException("Message text cannot be empty.");
        }
        if (messageText.length() > 2000) {
            throw new IllegalArgumentException("Message text exceeds maximum length of 2000 characters.");
        }

        MentorshipRequest request = mentorshipRepository.findById(mentorshipId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentorship session not found with ID: " + mentorshipId));

        if (!"ACCEPTED".equalsIgnoreCase(request.getStatus())) {
            throw new IllegalArgumentException("Chat is only available for accepted mentorship sessions.");
        }

        String normalizedType = senderType.trim().toUpperCase();
        Integer receiverId;
        String receiverType;

        if ("STUDENT".equals(normalizedType)) {
            if (request.getStudentId() == null || !senderId.equals(request.getStudentId())) {
                throw new SecurityException("Student ID does not match the student for this mentorship session.");
            }
            receiverId = request.getAlumniId();
            receiverType = "ALUMNI";
        } else if ("ALUMNI".equals(normalizedType)) {
            if (request.getAlumniId() == null || !senderId.equals(request.getAlumniId())) {
                throw new SecurityException("Alumni ID does not match the mentor for this mentorship session.");
            }
            receiverId = request.getStudentId();
            receiverType = "STUDENT";
        } else {
            throw new IllegalArgumentException("Invalid sender type specified: " + senderType);
        }

        if (receiverId == null) {
            throw new IllegalArgumentException("Recipient for this mentorship session is invalid.");
        }

        MentorshipMessage message = new MentorshipMessage(
                mentorshipId,
                senderId,
                normalizedType,
                receiverId,
                receiverType,
                messageText.trim(),
                java.time.LocalDateTime.now()
        );

        MentorshipMessage saved = messageRepository.save(message);

        // Optionally send a notification to receiver in auth-service
        try {
            java.util.Map<String, Object> notifPayload = new java.util.HashMap<>();
            notifPayload.put("userId", receiverId.longValue());
            notifPayload.put("userType", receiverType);
            notifPayload.put("title", "New Mentorship Message");
            notifPayload.put("message", "You received a new mentorship message.");
            notifPayload.put("notificationDate", java.time.LocalDateTime.now().toString());
            notifPayload.put("status", "UNREAD");

            restTemplate.postForObject(authServiceUrl + "/notification/add", notifPayload, Object.class);
        } catch (Exception e) {
            // Non-blocking notification error
        }

        return saved;
    }

    @Override
    public List<MentorshipMessage> getChatMessages(Long mentorshipId, Integer userId, String userType) {
        if (mentorshipId == null) {
            throw new IllegalArgumentException("Mentorship ID is required.");
        }
        if (userId == null || userType == null || userType.trim().isEmpty()) {
            throw new IllegalArgumentException("User ID and User Type are required for authorization.");
        }

        MentorshipRequest request = mentorshipRepository.findById(mentorshipId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentorship session not found with ID: " + mentorshipId));

        String normalizedType = userType.trim().toUpperCase();
        if ("STUDENT".equals(normalizedType)) {
            if (request.getStudentId() == null || !userId.equals(request.getStudentId())) {
                throw new SecurityException("You are not authorized to view messages for this mentorship session.");
            }
        } else if ("ALUMNI".equals(normalizedType)) {
            if (request.getAlumniId() == null || !userId.equals(request.getAlumniId())) {
                throw new SecurityException("You are not authorized to view messages for this mentorship session.");
            }
        } else {
            throw new IllegalArgumentException("Invalid user type specified: " + userType);
        }

        List<MentorshipMessage> list = messageRepository.findByMentorshipIdOrderByTimestampAsc(mentorshipId);
        return list != null ? list : java.util.Collections.emptyList();
    }
}
