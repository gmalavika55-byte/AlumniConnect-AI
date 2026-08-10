package com.alumniconnect.mentorship.serviceimpl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.alumniconnect.mentorship.entity.MentorshipRequest;
import com.alumniconnect.mentorship.exception.ResourceNotFoundException;
import com.alumniconnect.mentorship.repository.MentorshipRequestRepository;
import com.alumniconnect.mentorship.service.MentorshipService;

@Service
public class MentorshipServiceImpl implements MentorshipService {

    @Autowired
    private MentorshipRequestRepository mentorshipRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${auth-service.url}")
    private String authServiceUrl;

    @Override
    public MentorshipRequest addMentorship(MentorshipRequest mentorship) {
        MentorshipRequest saved = mentorshipRepository.save(mentorship);
        hydrateUserProfiles(saved);
        return saved;
    }

    @Override
    public MentorshipRequest updateMentorship(MentorshipRequest mentorship) {
        MentorshipRequest saved = mentorshipRepository.save(mentorship);
        hydrateUserProfiles(saved);
        return saved;
    }

    @Override
    public void deleteMentorship(Long requestId) {
        MentorshipRequest mentorship = mentorshipRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentorship Request not found"));
        mentorshipRepository.delete(mentorship);
    }

    @Override
    public MentorshipRequest getMentorshipById(Long requestId) {
        MentorshipRequest mentorship = mentorshipRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentorship Request not found"));
        hydrateUserProfiles(mentorship);
        return mentorship;
    }

    @Override
    public List<MentorshipRequest> getAllMentorships() {
        List<MentorshipRequest> list = mentorshipRepository.findAll();
        list.forEach(this::hydrateUserProfiles);
        return list;
    }

    private void hydrateUserProfiles(MentorshipRequest request) {
        if (request.getStudentId() != null) {
            try {
                Object student = restTemplate.getForObject(
                        authServiceUrl + "/student/get/" + request.getStudentId(), Object.class);
                request.setStudent(student);
            } catch (Exception e) {
                request.setStudent(null);
            }
        }
        if (request.getAlumniId() != null) {
            try {
                Object alumni = restTemplate.getForObject(
                        authServiceUrl + "/alumni/get/" + request.getAlumniId(), Object.class);
                request.setAlumni(alumni);
            } catch (Exception e) {
                request.setAlumni(null);
            }
        }
    }
}
