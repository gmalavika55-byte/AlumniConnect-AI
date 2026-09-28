package com.alumniconnect.event.serviceimpl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alumniconnect.event.entity.Event;
import com.alumniconnect.event.exception.ResourceNotFoundException;
import com.alumniconnect.event.repository.EventRepository;
import com.alumniconnect.event.repository.EventRegistrationRepository;
import com.alumniconnect.event.service.EventService;

@Service
public class EventServiceImpl implements EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EventRegistrationRepository registrationRepository;

    @Autowired
    private org.springframework.web.client.RestTemplate restTemplate;

    @org.springframework.beans.factory.annotation.Value("${auth-service.url:http://localhost:8101}")
    private String authServiceUrl;

    @Override
    public Event addEvent(Event event) {
        if (event.getCreatedByType() == null || event.getCreatedByType().trim().isEmpty()) {
            event.setCreatedByType("ADMIN");
        } else {
            event.setCreatedByType(event.getCreatedByType().trim().toUpperCase());
        }
        Event saved = eventRepository.save(event);
        try {
            java.util.Map<String, Object> notifPayload = new java.util.HashMap<>();
            notifPayload.put("userId", saved.getEventId().longValue());
            notifPayload.put("userType", "ADMIN");
            notifPayload.put("title", "New Event Created");
            notifPayload.put("message", "A new event (" + (saved.getTitle() != null ? saved.getTitle() : "Event #" + saved.getEventId()) + ") has been created.");
            notifPayload.put("notificationDate", java.time.LocalDateTime.now().toString());
            notifPayload.put("status", "UNREAD");

            restTemplate.postForObject(authServiceUrl + "/notification/add", notifPayload, Object.class);
        } catch (Exception e) {
            System.err.println("Failed to send ADMIN event creation notification: " + e.getMessage());
        }
        return saved;
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public Event updateEvent(Event event, String requesterName) {
        if (event == null || event.getEventId() == null) {
            throw new IllegalArgumentException("Event ID must be specified for update.");
        }
        Event existing = eventRepository.findById(event.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + event.getEventId()));

        boolean isAdmin = requesterName == null || requesterName.trim().isEmpty() ||
                          requesterName.trim().equalsIgnoreCase("ADMIN") ||
                          requesterName.trim().equalsIgnoreCase("KCE Admin") ||
                          requesterName.trim().toLowerCase().contains("admin");

        if (!isAdmin && (existing.getOrganizer() == null || !existing.getOrganizer().trim().equalsIgnoreCase(requesterName.trim()))) {
            throw new IllegalArgumentException("Access denied. Only the event organizer or Admin can update this event.");
        }

        if (event.getCreatedByType() == null || event.getCreatedByType().trim().isEmpty()) {
            event.setCreatedByType(existing.getCreatedByType() != null ? existing.getCreatedByType() : "ADMIN");
        } else {
            event.setCreatedByType(event.getCreatedByType().trim().toUpperCase());
        }

        // Ensure eventId remains unchanged
        Event saved = eventRepository.save(event);
        try {
            java.util.Map<String, Object> notifPayload = new java.util.HashMap<>();
            notifPayload.put("userId", saved.getEventId().longValue());
            notifPayload.put("userType", "ADMIN");
            notifPayload.put("title", "Event Updated");
            notifPayload.put("message", "Event \"" + (saved.getTitle() != null ? saved.getTitle() : "Event #" + saved.getEventId()) + "\" has been updated.");
            notifPayload.put("notificationDate", java.time.LocalDateTime.now().toString());
            notifPayload.put("status", "UNREAD");

            restTemplate.postForObject(authServiceUrl + "/notification/add", notifPayload, Object.class);
        } catch (Exception e) {}

        return saved;
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void deleteEvent(Integer eventId, String requesterName) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + eventId));

        boolean isAdmin = requesterName == null || requesterName.trim().isEmpty() ||
                          requesterName.trim().equalsIgnoreCase("ADMIN") ||
                          requesterName.trim().equalsIgnoreCase("KCE Admin") ||
                          requesterName.trim().toLowerCase().contains("admin");

        if (!isAdmin && (event.getOrganizer() == null || !event.getOrganizer().trim().equalsIgnoreCase(requesterName.trim()))) {
            throw new IllegalArgumentException("Access denied. Only the event organizer or Admin can delete this event.");
        }

        // Clean up associated registrations first to prevent FK constraint errors
        registrationRepository.deleteByEventEventId(eventId);
        eventRepository.delete(event);

        try {
            java.util.Map<String, Object> notifPayload = new java.util.HashMap<>();
            notifPayload.put("userId", eventId.longValue());
            notifPayload.put("userType", "ADMIN");
            notifPayload.put("title", "Event Cancelled");
            notifPayload.put("message", "Event \"" + (event.getTitle() != null ? event.getTitle() : "Event #" + eventId) + "\" has been cancelled.");
            notifPayload.put("notificationDate", java.time.LocalDateTime.now().toString());
            notifPayload.put("status", "UNREAD");

            restTemplate.postForObject(authServiceUrl + "/notification/add", notifPayload, Object.class);
        } catch (Exception e) {}
    }

    @Override
    public Event getEventById(Integer eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        event.setRegisteredCount(registrationRepository.countByEventEventId(eventId));
        return event;
    }

    @Override
    public List<Event> getAllEvents() {
        List<Event> list = eventRepository.findAll();
        for (Event event : list) {
            event.setRegisteredCount(registrationRepository.countByEventEventId(event.getEventId()));
        }
        return list;
    }
}
