package com.alumniconnect.event.service;

import java.util.List;
import com.alumniconnect.event.entity.EventRegistration;

public interface EventRegistrationService {
    EventRegistration registerForEvent(EventRegistration registration);
    List<EventRegistration> getRegistrationsForEvent(Integer eventId);
    List<EventRegistration> getRegistrationsForUser(String userType, Integer userId);
    void cancelStudentRegistration(Integer eventId, Integer studentId);
}
