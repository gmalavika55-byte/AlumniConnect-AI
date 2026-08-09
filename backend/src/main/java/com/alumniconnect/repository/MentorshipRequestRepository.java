package com.alumniconnect.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.alumniconnect.entity.MentorshipRequest;

import java.util.List;

@Repository
public interface MentorshipRequestRepository extends JpaRepository<MentorshipRequest, Integer> {

    List<MentorshipRequest> findByStudentStudentId(Integer studentId);

    List<MentorshipRequest> findByAlumniAlumniId(Integer alumniId);

    List<MentorshipRequest> findByStatus(String status);

}