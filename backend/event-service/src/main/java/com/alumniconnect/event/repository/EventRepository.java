package com.alumniconnect.event.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.alumniconnect.event.entity.Event;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {
}
