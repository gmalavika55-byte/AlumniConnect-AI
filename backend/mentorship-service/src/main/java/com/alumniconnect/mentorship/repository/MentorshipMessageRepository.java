package com.alumniconnect.mentorship.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.alumniconnect.mentorship.entity.MentorshipMessage;

public interface MentorshipMessageRepository extends JpaRepository<MentorshipMessage, Long> {
    List<MentorshipMessage> findByMentorshipIdOrderByTimestampAsc(Long mentorshipId);
}
