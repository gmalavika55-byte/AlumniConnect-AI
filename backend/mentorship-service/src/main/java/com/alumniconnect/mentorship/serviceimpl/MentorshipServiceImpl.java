package com.alumniconnect.mentorship.serviceimpl;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.alumniconnect.mentorship.entity.MentorshipRequest;
import com.alumniconnect.mentorship.exception.ResourceNotFoundException;
import com.alumniconnect.mentorship.repository.MentorshipRequestRepository;
import com.alumniconnect.mentorship.service.MentorshipService;
import org.springframework.web.client.RestTemplate;

@Service
public class MentorshipServiceImpl implements MentorshipService {

    @Autowired
    private MentorshipRequestRepository mentorshipRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${auth-service.url}")
    private String authServiceUrl;

    // Active statuses that block a new request from the same student to the same alumni
    private static final List<String> ACTIVE_STATUSES = List.of("PENDING", "ACCEPTED");

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
        MentorshipRequest saved = mentorshipRepository.save(request);
        hydrateUserProfiles(saved);
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
        return saved;
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
}
