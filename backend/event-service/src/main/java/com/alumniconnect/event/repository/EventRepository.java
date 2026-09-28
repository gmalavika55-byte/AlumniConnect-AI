package com.alumniconnect.event.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import com.alumniconnect.event.entity.Event;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {

    @Modifying
    @Transactional
    @Query("UPDATE Event e SET e.createdByType = :createdByType WHERE e.eventId = :eventId AND (e.createdByType IS NULL OR e.createdByType = '')")
    int updateCreatedByTypeIfNull(@Param("eventId") Integer eventId, @Param("createdByType") String createdByType);
}
