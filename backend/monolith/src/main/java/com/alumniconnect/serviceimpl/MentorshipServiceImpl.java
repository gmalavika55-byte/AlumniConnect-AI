package com.alumniconnect.serviceimpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alumniconnect.entity.MentorshipRequest;
import com.alumniconnect.exception.ResourceNotFoundException;
import com.alumniconnect.repository.MentorshipRequestRepository;
import com.alumniconnect.service.MentorshipService;

@Service
public class MentorshipServiceImpl implements MentorshipService {

    @Autowired
    private MentorshipRequestRepository mentorshipRepository;

    @Override
    public MentorshipRequest addMentorship(MentorshipRequest mentorship) {
        return mentorshipRepository.save(mentorship);
    }

    @Override
    public MentorshipRequest updateMentorship(MentorshipRequest mentorship) {
        return mentorshipRepository.save(mentorship);
    }

    @Override
    public void deleteMentorship(Integer requestId) {

        MentorshipRequest mentorship = mentorshipRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentorship Request not found"));

        mentorshipRepository.delete(mentorship);
    }

    @Override
    public MentorshipRequest getMentorshipById(Integer requestId) {
        return mentorshipRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentorship Request not found"));
    }

    @Override
    public List<MentorshipRequest> getAllMentorships() {
        return mentorshipRepository.findAll();
    }
}