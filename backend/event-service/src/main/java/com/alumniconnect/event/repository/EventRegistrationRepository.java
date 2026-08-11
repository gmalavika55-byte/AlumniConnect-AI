package com.alumniconnect.event.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.alumniconnect.event.entity.EventRegistration;
import java.util.List;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Integer> {
    List<EventRegistration> findByEventEventId(Integer eventId);
    List<EventRegistration> findByStudentId(Integer studentId);
    List<EventRegistration> findByAlumniId(Integer alumniId);
    List<EventRegistration> findByStudentIdAndEventEventId(Integer studentId, Integer eventId);
    long countByEventEventId(Integer eventId);
}
