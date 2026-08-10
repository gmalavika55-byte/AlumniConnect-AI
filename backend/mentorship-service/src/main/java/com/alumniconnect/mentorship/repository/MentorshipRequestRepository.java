package com.alumniconnect.mentorship.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.alumniconnect.mentorship.entity.MentorshipRequest;
import java.util.List;

@Repository
public interface MentorshipRequestRepository extends JpaRepository<MentorshipRequest, Long> {
    List<MentorshipRequest> findByStudentId(Integer studentId);
    List<MentorshipRequest> findByAlumniId(Integer alumniId);
    List<MentorshipRequest> findByStatus(String status);
}
