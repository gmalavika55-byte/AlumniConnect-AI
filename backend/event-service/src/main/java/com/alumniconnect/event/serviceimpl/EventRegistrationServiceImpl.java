package com.alumniconnect.event.serviceimpl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.alumniconnect.event.entity.EventRegistration;
import com.alumniconnect.event.repository.EventRegistrationRepository;
import com.alumniconnect.event.service.EventRegistrationService;

@Service
public class EventRegistrationServiceImpl implements EventRegistrationService {

    @Autowired
    private EventRegistrationRepository registrationRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${auth-service.url}")
    private String authServiceUrl;

    @Override
    public EventRegistration registerForEvent(EventRegistration registration) {
        EventRegistration saved = registrationRepository.save(registration);
        hydrateUserProfiles(saved);
        return saved;
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
