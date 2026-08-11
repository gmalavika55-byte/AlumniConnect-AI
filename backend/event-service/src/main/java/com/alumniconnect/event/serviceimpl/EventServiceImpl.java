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
    public Event updateEvent(Event event) {
        return eventRepository.save(event);
    }

    @Override
    public void deleteEvent(Integer eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
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
