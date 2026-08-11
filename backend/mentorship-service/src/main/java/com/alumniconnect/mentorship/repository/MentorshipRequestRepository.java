package com.alumniconnect.mentorship.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.alumniconnect.mentorship.entity.MentorshipRequest;
import java.util.List;
import java.util.Optional;

@Repository
public interface MentorshipRequestRepository extends JpaRepository<MentorshipRequest, Long> {
    List<MentorshipRequest> findByStudentId(Integer studentId);
    List<MentorshipRequest> findByAlumniId(Integer alumniId);
    List<MentorshipRequest> findByStatus(String status);

    // Used for duplicate-request prevention: find any active (PENDING/ACCEPTED) request
    // for the same student+alumni pair
    Optional<MentorshipRequest> findByStudentIdAndAlumniIdAndStatusIn(
            Integer studentId, Integer alumniId, List<String> statuses);
}
