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

    @Override
    public Event addEvent(Event event) {
        return eventRepository.save(event);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public Event updateEvent(Event event, String requesterName) {
        if (event == null || event.getEventId() == null) {
            throw new IllegalArgumentException("Event ID must be specified for update.");
        }
        Event existing = eventRepository.findById(event.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + event.getEventId()));

        if (requesterName == null || requesterName.trim().isEmpty() ||
            existing.getOrganizer() == null || !existing.getOrganizer().trim().equalsIgnoreCase(requesterName.trim())) {
            throw new IllegalArgumentException("Access denied. Only the event organizer can update this event.");
        }

        // Ensure organizer and eventId remain unchanged
        event.setOrganizer(existing.getOrganizer());
        return eventRepository.save(event);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void deleteEvent(Integer eventId, String requesterName) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + eventId));

        if (requesterName == null || requesterName.trim().isEmpty() ||
            event.getOrganizer() == null || !event.getOrganizer().trim().equalsIgnoreCase(requesterName.trim())) {
            throw new IllegalArgumentException("Access denied. Only the event organizer can delete this event.");
        }

        // Clean up associated registrations first to prevent FK constraint errors
        registrationRepository.deleteByEventEventId(eventId);
        eventRepository.delete(event);
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
