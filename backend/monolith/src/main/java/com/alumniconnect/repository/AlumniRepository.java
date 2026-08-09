package com.alumniconnect.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.alumniconnect.entity.Alumni;

@Repository
public interface AlumniRepository extends JpaRepository<Alumni, Integer> {

    Alumni findByEmail(String email);

    Alumni findByAlumniId(Integer alumniId);

}