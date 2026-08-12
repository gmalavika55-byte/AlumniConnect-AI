package com.alumniconnect.fundraising.serviceimpl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.alumniconnect.fundraising.entity.Donation;
import com.alumniconnect.fundraising.entity.Fundraising;
import com.alumniconnect.fundraising.exception.ResourceNotFoundException;
import com.alumniconnect.fundraising.repository.DonationRepository;
import com.alumniconnect.fundraising.repository.FundraisingRepository;
import com.alumniconnect.fundraising.service.DonationService;

@Service
public class DonationServiceImpl implements DonationService {

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private FundraisingRepository fundraisingRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${auth-service.url}")
    private String authServiceUrl;

    @Override
    @Transactional
    public Donation processDonation(Donation donation) {
        // 1. Validate donation input
        if (donation == null) {
            throw new IllegalArgumentException("Donation payload must not be null.");
        }
        if (donation.getAmount() == null || donation.getAmount() <= 0) {
            throw new IllegalArgumentException("Donation amount must be greater than 0.");
        }
        if (donation.getAlumniId() == null) {
            throw new IllegalArgumentException("Alumni ID must be specified.");
        }

        // 2. Validate campaign existence
        if (donation.getFundraising() == null || donation.getFundraising().getFundId() == null) {
            throw new IllegalArgumentException("Campaign ID must be specified.");
        }
        Long fundId = donation.getFundraising().getFundId();
        Fundraising fundraising = fundraisingRepository.findById(fundId)
                .orElseThrow(() -> new ResourceNotFoundException("Fundraising campaign not found with ID: " + fundId));

        // 3. Validate campaign status
        String status = fundraising.getStatus();
        if (status != null && ("CLOSED".equalsIgnoreCase(status) || "COMPLETED".equalsIgnoreCase(status))) {
            throw new IllegalArgumentException("This campaign is closed and no longer accepting donations.");
        }

        // 4. Validate deadline
        if (fundraising.getEndDate() != null && LocalDate.now().isAfter(fundraising.getEndDate())) {
            throw new IllegalArgumentException("The deadline for this campaign has passed.");
        }

        // 5. Validate target reached & remaining target
        BigDecimal target = fundraising.getTargetAmount() != null ? fundraising.getTargetAmount() : BigDecimal.ZERO;
        BigDecimal currentCollected = fundraising.getCollectedAmount() != null ? fundraising.getCollectedAmount() : BigDecimal.ZERO;

        if (target.compareTo(BigDecimal.ZERO) > 0 && currentCollected.compareTo(target) >= 0) {
            throw new IllegalArgumentException("Target amount for this campaign has already been reached.");
        }

        BigDecimal donationAmt = BigDecimal.valueOf(donation.getAmount());
        if (target.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal remaining = target.subtract(currentCollected);
            if (donationAmt.compareTo(remaining) > 0) {
                throw new IllegalArgumentException("Donation amount exceeds remaining target of ₹" + remaining + ".");
            }
        }

        // 6. Update campaign collected amount & auto-complete if target reached
        BigDecimal newCollected = currentCollected.add(donationAmt);
        fundraising.setCollectedAmount(newCollected);
        if (target.compareTo(BigDecimal.ZERO) > 0 && newCollected.compareTo(target) >= 0) {
            fundraising.setStatus("COMPLETED");
        }
        fundraisingRepository.save(fundraising);

        // 7. Persist donation
        if (donation.getDonationDate() == null) {
            donation.setDonationDate(LocalDate.now());
        }
        if (donation.getPaymentStatus() == null || donation.getPaymentStatus().trim().isEmpty()) {
            donation.setPaymentStatus("SUCCESS");
        }
        donation.setFundraising(fundraising);

        Donation saved = donationRepository.save(donation);
        hydrateUserProfiles(saved);
        return saved;
    }

    @Override
    public List<Donation> getDonationsByCampaign(Long fundId) {
        List<Donation> list = donationRepository.findByFundraisingFundId(fundId);
        list.forEach(this::hydrateUserProfiles);
        return list;
    }

    @Override
    public List<Donation> getDonationsByAlumni(Integer alumniId) {
        List<Donation> list = donationRepository.findByAlumniId(alumniId);
        list.forEach(this::hydrateUserProfiles);
        return list;
    }

    @Override
    public List<Donation> getAllDonations() {
        List<Donation> list = donationRepository.findAll();
        list.forEach(this::hydrateUserProfiles);
        return list;
    }

    private void hydrateUserProfiles(Donation donation) {
        if (donation.getAlumniId() != null) {
            try {
                Object alumni = restTemplate.getForObject(
                        authServiceUrl + "/alumni/get/" + donation.getAlumniId(), Object.class);
                donation.setAlumni(alumni);
            } catch (Exception e) {
                donation.setAlumni(null);
            }
        }
    }
}
