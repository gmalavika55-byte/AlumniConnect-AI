package com.alumniconnect.event.service;

import java.util.List;
import com.alumniconnect.event.entity.Event;

public interface EventService {
    Event addEvent(Event event);
    Event updateEvent(Event event, String requesterName);
    void deleteEvent(Integer eventId, String requesterName);
    Event getEventById(Integer eventId);
    List<Event> getAllEvents();
}
