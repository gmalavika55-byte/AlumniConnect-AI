package com.alumniconnect.fundraising.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.alumniconnect.fundraising.entity.Fundraising;

@Repository
public interface FundraisingRepository extends JpaRepository<Fundraising, Long> {
}
