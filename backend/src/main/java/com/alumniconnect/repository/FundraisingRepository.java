package com.alumniconnect.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.alumniconnect.entity.Fundraising;

import java.util.List;

@Repository
public interface FundraisingRepository extends JpaRepository<Fundraising, Integer> {

    List<Fundraising> findByStatus(String status);

}