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

        // 2. Validate studentId is present
        if (registration.getStudentId() == null) {
            throw new IllegalArgumentException("Student ID must be specified.");
        }

        // 3. Prevent duplicate registration
        List<EventRegistration> existing = registrationRepository.findByStudentIdAndEventEventId(registration.getStudentId(), eventId);
        if (!existing.isEmpty()) {
            throw new IllegalArgumentException("You are already registered for this event.");
        }

        // 4. Prevent registration if event is already full
        long currentRegistrations = registrationRepository.countByEventEventId(eventId);
        if (event.getMaxParticipants() != null && currentRegistrations >= event.getMaxParticipants()) {
            throw new IllegalArgumentException("Sorry, this event is full.");
        }

        // Save
        registration.setEvent(event);
        EventRegistration saved = registrationRepository.save(registration);
        hydrateUserProfiles(saved);
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
    public List<EventRegistration> getRegistrationsForEvent(Integer eventId) {
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
}
