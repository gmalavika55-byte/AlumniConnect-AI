package com.alumniconnect.event.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.alumniconnect.event.entity.EventRegistration;
import com.alumniconnect.event.service.EventRegistrationService;

@RestController
@RequestMapping("/event")
public class EventRegistrationController {

    @Autowired
    private EventRegistrationService registrationService;

    @PostMapping("/register")
    public EventRegistration registerForEvent(@RequestBody EventRegistration registration) {
        return registrationService.registerForEvent(registration);
    }

    @GetMapping("/registrations/event/{eventId}")
    public List<EventRegistration> getRegistrationsForEvent(@PathVariable Integer eventId) {
        return registrationService.getRegistrationsForEvent(eventId);
    }

    @GetMapping("/registrations/user/{userType}/{userId}")
    public List<EventRegistration> getRegistrationsForUser(@PathVariable String userType, @PathVariable Integer userId) {
        return registrationService.getRegistrationsForUser(userType, userId);
    }

    @DeleteMapping("/registrations/cancel/{eventId}/student/{studentId}")
    public String cancelStudentRegistration(@PathVariable Integer eventId, @PathVariable Integer studentId) {
        registrationService.cancelStudentRegistration(eventId, studentId);
        return "Event registration cancelled successfully.";
    }
}
