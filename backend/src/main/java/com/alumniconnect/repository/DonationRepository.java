package com.alumniconnect.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.alumniconnect.entity.Donation;

import java.util.List;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Integer> {

    List<Donation> findByFundraisingFundId(Integer fundId);

    List<Donation> findByAlumniAlumniId(Integer alumniId);

    List<Donation> findByPaymentStatus(String paymentStatus);

}