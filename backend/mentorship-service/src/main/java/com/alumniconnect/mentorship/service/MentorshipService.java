package com.alumniconnect.mentorship.service;

import java.util.List;
import com.alumniconnect.mentorship.entity.MentorshipRequest;

public interface MentorshipService {
    MentorshipRequest addMentorship(MentorshipRequest mentorship);
    MentorshipRequest updateMentorship(MentorshipRequest mentorship);
    void deleteMentorship(Integer requestId);
    MentorshipRequest getMentorshipById(Integer requestId);
    List<MentorshipRequest> getAllMentorships();
}
