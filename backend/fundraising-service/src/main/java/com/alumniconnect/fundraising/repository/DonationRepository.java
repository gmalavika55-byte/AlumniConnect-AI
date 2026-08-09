package com.alumniconnect.fundraising.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.alumniconnect.fundraising.entity.Donation;
import java.util.List;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByFundraisingFundId(Integer fundId);
    List<Donation> findByAlumniId(Integer alumniId);
    List<Donation> findByPaymentStatus(String paymentStatus);
}
