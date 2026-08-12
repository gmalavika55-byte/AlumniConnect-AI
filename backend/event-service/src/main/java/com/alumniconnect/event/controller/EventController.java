package com.alumniconnect.event.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.alumniconnect.event.entity.Event;
import com.alumniconnect.event.service.EventService;

@RestController
@RequestMapping("/event")
public class EventController {

    @Autowired
    private EventService eventService;

    @PostMapping("/add")
    public Event addEvent(@RequestBody Event event) {
        return eventService.addEvent(event);
    }

    @PutMapping("/update")
    public Event updateEvent(@RequestBody Event event, @RequestParam(required = false) String requesterName) {
        return eventService.updateEvent(event, requesterName);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteEvent(@PathVariable Integer id, @RequestParam(required = false) String requesterName) {
        eventService.deleteEvent(id, requesterName);
        return "Event deleted successfully";
    }

    @GetMapping("/get/{id}")
    public Event getEventById(@PathVariable Integer id) {
        return eventService.getEventById(id);
    }

    @GetMapping("/getall")
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }
}
