package com.alumniconnect.event.service;

import java.util.List;
import com.alumniconnect.event.entity.Event;

public interface EventService {
    Event addEvent(Event event);
    Event updateEvent(Event event);
    void deleteEvent(Integer eventId);
    Event getEventById(Integer eventId);
    List<Event> getAllEvents();
}
