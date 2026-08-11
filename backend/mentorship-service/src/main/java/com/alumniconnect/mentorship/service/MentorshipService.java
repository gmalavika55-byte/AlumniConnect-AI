package com.alumniconnect.mentorship.service;

import java.util.List;
import com.alumniconnect.mentorship.entity.MentorshipRequest;

public interface MentorshipService {
    MentorshipRequest addMentorship(MentorshipRequest mentorship);
    MentorshipRequest updateMentorship(MentorshipRequest mentorship);
    void deleteMentorship(Long requestId);
    MentorshipRequest getMentorshipById(Long requestId);
    List<MentorshipRequest> getAllMentorships();
    MentorshipRequest cancelMentorshipRequest(Long requestId, Integer studentId);
    MentorshipRequest acceptMentorshipRequest(Long requestId, Integer alumniId);
    MentorshipRequest rejectMentorshipRequest(Long requestId, Integer alumniId);
}

