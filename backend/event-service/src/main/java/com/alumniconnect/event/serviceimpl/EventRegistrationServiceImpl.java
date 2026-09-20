package com.alumniconnect.event.serviceimpl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.alumniconnect.event.entity.Event;
import com.alumniconnect.event.entity.EventRegistration;
import com.alumniconnect.event.repository.EventRegistrationRepository;
import com.alumniconnect.event.repository.EventRepository;
import com.alumniconnect.event.service.EventRegistrationService;

@Service
public class EventRegistrationServiceImpl implements EventRegistrationService {

    @Autowired
    private EventRegistrationRepository registrationRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${auth-service.url}")
    private String authServiceUrl;

    @Override
    @Transactional
    public EventRegistration registerForEvent(EventRegistration registration) {
        Integer eventId = registration.getEventId();
        if (eventId == null && registration.getEvent() != null) {
            eventId = registration.getEvent().getEventId();
        }
        if (eventId == null) {
            throw new IllegalArgumentException("Event ID must be specified.");
        }

        // 1. Validate Event exists
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found."));

        // 2. Validate studentId or alumniId is present
        if (registration.getStudentId() == null && registration.getAlumniId() == null) {
            throw new IllegalArgumentException("Student ID or Alumni ID must be specified.");
        }

        // 3. Prevent duplicate registration
        if (registration.getStudentId() != null) {
            List<EventRegistration> existing = registrationRepository.findByStudentIdAndEventEventId(registration.getStudentId(), eventId);
            if (!existing.isEmpty()) {
                throw new IllegalArgumentException("You are already registered for this event.");
            }
        } else if (registration.getAlumniId() != null) {
            List<EventRegistration> existing = registrationRepository.findByAlumniIdAndEventEventId(registration.getAlumniId(), eventId);
            if (!existing.isEmpty()) {
                throw new IllegalArgumentException("You are already registered for this event.");
            }
        }

        // 3.5 Prevent self-registration (Organizer cannot register for their own event)
        String organizer = event.getOrganizer();
        if (organizer != null && !organizer.trim().isEmpty()) {
            String registrantName = null;
            if (registration.getAlumniId() != null) {
                try {
                    java.util.Map<?, ?> alumniObj = restTemplate.getForObject(authServiceUrl + "/alumni/get/" + registration.getAlumniId(), java.util.Map.class);
                    if (alumniObj != null && alumniObj.get("name") != null) {
                        registrantName = alumniObj.get("name").toString().trim();
                    }
                } catch (Exception e) {}
            } else if (registration.getStudentId() != null) {
                try {
                    java.util.Map<?, ?> studentObj = restTemplate.getForObject(authServiceUrl + "/student/get/" + registration.getStudentId(), java.util.Map.class);
                    if (studentObj != null && studentObj.get("name") != null) {
                        registrantName = studentObj.get("name").toString().trim();
                    }
                } catch (Exception e) {}
            }

            if (registrantName != null && registrantName.equalsIgnoreCase(organizer.trim())) {
                throw new IllegalArgumentException("Event organizers cannot register for their own event.");
            }
        }

        // 3.6 Validate Audience restriction
        String audience = event.getAudience();
        if (audience != null && !audience.trim().isEmpty()) {
            String audUpper = audience.trim().toUpperCase();
            if (audUpper.startsWith("STUDENT") && registration.getAlumniId() != null) {
                throw new IllegalArgumentException("This event is open to Students only.");
            }
            if (audUpper.startsWith("ALUMNI") && registration.getStudentId() != null) {
                throw new IllegalArgumentException("This event is open to Alumni only.");
            }
        }

        // 4. Prevent registration if event is already full
        long currentRegistrations = registrationRepository.countByEventEventId(eventId);
        if (event.getMaxParticipants() != null && currentRegistrations >= event.getMaxParticipants()) {
            throw new IllegalArgumentException("Sorry, this event is full.");
        }

        // 5. Prevent registration if event has already ended
        if (event.getEventDate() != null) {
            java.util.Calendar eventCal = java.util.Calendar.getInstance();
            eventCal.setTime(event.getEventDate());

            boolean timeParsed = false;
            if (event.getEndTime() != null && !event.getEndTime().trim().isEmpty()) {
                timeParsed = parseAndSetTime(eventCal, event.getEndTime());
            }

            if (!timeParsed) {
                // Default to end of day (23:59:59)
                eventCal.set(java.util.Calendar.HOUR_OF_DAY, 23);
                eventCal.set(java.util.Calendar.MINUTE, 59);
                eventCal.set(java.util.Calendar.SECOND, 59);
            }

            if (new java.util.Date().after(eventCal.getTime())) {
                throw new IllegalArgumentException("Event has already ended. Registration is closed.");
            }
        }

        // Save
        registration.setEvent(event);
        EventRegistration saved = registrationRepository.save(registration);
        hydrateUserProfiles(saved);

        // Send notification to event organizer if enabled in preference
        try {
            sendOrganizerNotificationIfEnabled(event, saved);
        } catch (Exception e) {
            System.err.println("Non-fatal error sending organizer notification: " + e.getMessage());
        }

        // Send ADMIN notification for event registration
        try {
            java.util.Map<String, Object> adminNotifPayload = new java.util.HashMap<>();
            adminNotifPayload.put("userId", saved.getRegistrationId() != null ? saved.getRegistrationId().longValue() : eventId.longValue());
            adminNotifPayload.put("userType", "ADMIN");
            adminNotifPayload.put("title", "New Event Registration");
            adminNotifPayload.put("message", "A user has registered for event \"" + (event.getTitle() != null ? event.getTitle() : "Event #" + eventId) + "\".");
            adminNotifPayload.put("notificationDate", java.time.LocalDateTime.now().toString());
            adminNotifPayload.put("status", "UNREAD");

            restTemplate.postForObject(authServiceUrl + "/notification/add", adminNotifPayload, Object.class);
        } catch (Exception e) {}

        return saved;
    }

    @Override
    @Transactional
    public void cancelStudentRegistration(Integer eventId, Integer studentId) {
        if (eventId == null || studentId == null) {
            throw new IllegalArgumentException("Event ID and Student ID must be specified.");
        }
        List<EventRegistration> regs = registrationRepository.findByStudentIdAndEventEventId(studentId, eventId);
        if (regs.isEmpty()) {
            throw new IllegalArgumentException("Registration not found.");
        }
        registrationRepository.deleteAll(regs);
    }

    @Override
    @Transactional
    public void cancelAlumniRegistration(Integer eventId, Integer alumniId) {
        if (eventId == null || alumniId == null) {
            throw new IllegalArgumentException("Event ID and Alumni ID must be specified.");
        }
        List<EventRegistration> regs = registrationRepository.findByAlumniIdAndEventEventId(alumniId, eventId);
        if (regs.isEmpty()) {
            throw new IllegalArgumentException("Registration not found.");
        }
        registrationRepository.deleteAll(regs);
    }

    @Override
    public List<EventRegistration> getRegistrationsForEvent(Integer eventId) {
        List<EventRegistration> list = registrationRepository.findByEventEventId(eventId);
        list.forEach(this::hydrateUserProfiles);
        return list;
    }

    @Override
    public List<EventRegistration> getRegistrationsForOrganizer(Integer eventId, String organizerName) {
        if (eventId == null) {
            throw new IllegalArgumentException("Event ID must be specified.");
        }
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found with ID: " + eventId));

        if (organizerName == null || organizerName.trim().isEmpty() ||
            event.getOrganizer() == null || !event.getOrganizer().trim().equalsIgnoreCase(organizerName.trim())) {
            throw new IllegalArgumentException("Access denied. Only the event organizer can view registrations for this event.");
        }

        List<EventRegistration> list = registrationRepository.findByEventEventId(eventId);
        list.forEach(this::hydrateUserProfiles);
        return list;
    }

    @Override
    public List<EventRegistration> getRegistrationsForUser(String userType, Integer userId) {
        List<EventRegistration> list;
        if ("alumni".equalsIgnoreCase(userType)) {
            list = registrationRepository.findByAlumniId(userId);
        } else {
            list = registrationRepository.findByStudentId(userId);
        }
        list.forEach(this::hydrateUserProfiles);
        return list;
    }

    private void hydrateUserProfiles(EventRegistration registration) {
        if (registration.getStudentId() != null) {
            try {
                Object student = restTemplate.getForObject(
                        authServiceUrl + "/student/get/" + registration.getStudentId(), Object.class);
                registration.setStudent(student);
            } catch (Exception e) {
                registration.setStudent(null);
            }
        }
        if (registration.getAlumniId() != null) {
            try {
                Object alumni = restTemplate.getForObject(
                        authServiceUrl + "/alumni/get/" + registration.getAlumniId(), Object.class);
                registration.setAlumni(alumni);
            } catch (Exception e) {
                registration.setAlumni(null);
            }
        }
    }

    private boolean parseAndSetTime(java.util.Calendar cal, String timeStr) {
        try {
            String str = timeStr.trim().toUpperCase();
            boolean isPM = str.contains("PM");
            boolean isAM = str.contains("AM");
            String cleanStr = str.replaceAll("(AM|PM)", "").trim();
            String[] parts = cleanStr.split(":");
            if (parts.length >= 2) {
                int hours = Integer.parseInt(parts[0].trim());
                int minutes = Integer.parseInt(parts[1].trim());
                if (isPM && hours < 12) hours += 12;
                if (isAM && hours == 12) hours = 0;
                cal.set(java.util.Calendar.HOUR_OF_DAY, hours);
                cal.set(java.util.Calendar.MINUTE, minutes);
                cal.set(java.util.Calendar.SECOND, 0);
                return true;
            }
        } catch (Exception e) {
            // Ignore format errors
        }
        return false;
    }

    private void sendOrganizerNotificationIfEnabled(Event event, EventRegistration registration) {
        if (event == null || event.getOrganizer() == null || event.getOrganizer().trim().isEmpty()) {
            return;
        }

        String organizerName = event.getOrganizer().trim();

        try {
            // 1. Find organizer Alumni profile from auth-service
            Object[] alumniList = restTemplate.getForObject(authServiceUrl + "/alumni/getall", Object[].class);
            if (alumniList == null || alumniList.length == 0) return;

            java.util.Map<?, ?> organizerAlumni = null;
            for (Object obj : alumniList) {
                if (obj instanceof java.util.Map) {
                    java.util.Map<?, ?> map = (java.util.Map<?, ?>) obj;
                    Object nameObj = map.get("name");
                    if (nameObj != null && nameObj.toString().trim().equalsIgnoreCase(organizerName)) {
                        organizerAlumni = map;
                        break;
                    }
                }
            }

            if (organizerAlumni == null) return;

            Object alumniIdObj = organizerAlumni.get("alumniId");
            if (alumniIdObj == null) return;
            Long organizerAlumniId = ((Number) alumniIdObj).longValue();

            // 2. Check organizer's notificationPref JSON setting
            Object notifPrefObj = organizerAlumni.get("notificationPref");
            if (notifPrefObj != null) {
                try {
                    String notifPrefStr = notifPrefObj.toString();
                    if (notifPrefStr.contains("\"eventRegistrations\":false")) {
                        System.out.println("Organizer " + organizerName + " has disabled event registration notifications. Skipping.");
                        return;
                    }
                } catch (Exception ignored) {}
            }

            // 3. Determine registrant name
            String registrantName = "A user";
            if (registration.getAlumniId() != null) {
                try {
                    java.util.Map<?, ?> regAlumni = restTemplate.getForObject(authServiceUrl + "/alumni/get/" + registration.getAlumniId(), java.util.Map.class);
                    if (regAlumni != null && regAlumni.get("name") != null) {
                        registrantName = regAlumni.get("name").toString().trim();
                    }
                } catch (Exception ignored) {}
            } else if (registration.getStudentId() != null) {
                try {
                    java.util.Map<?, ?> regStudent = restTemplate.getForObject(authServiceUrl + "/student/get/" + registration.getStudentId(), java.util.Map.class);
                    if (regStudent != null && regStudent.get("name") != null) {
                        registrantName = regStudent.get("name").toString().trim();
                    }
                } catch (Exception ignored) {}
            }

            // 4. Send notification to organizer
            java.util.Map<String, Object> notif = new java.util.HashMap<>();
            notif.put("userId", organizerAlumniId);
            notif.put("userType", "ALUMNI");
            notif.put("title", "New Event Registration");
            notif.put("message", registrantName + " registered for your event \"" + (event.getTitle() != null ? event.getTitle() : "Event") + "\".");
            notif.put("notificationDate", java.time.LocalDateTime.now().toString());
            notif.put("status", "UNREAD");

            restTemplate.postForObject(authServiceUrl + "/notification/add", notif, Object.class);
            System.out.println("Event registration notification sent to organizer " + organizerName + " (ID " + organizerAlumniId + ")");
        } catch (Exception e) {
            System.err.println("Failed to send event registration notification to organizer: " + e.getMessage());
        }
    }
}
