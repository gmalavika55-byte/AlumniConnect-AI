package com.alumniconnect.fundraising.serviceimpl;

import java.math.BigDecimal;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.alumniconnect.fundraising.entity.Donation;
import com.alumniconnect.fundraising.entity.Fundraising;
import com.alumniconnect.fundraising.repository.DonationRepository;
import com.alumniconnect.fundraising.repository.FundraisingRepository;
import com.alumniconnect.fundraising.service.DonationService;
import com.alumniconnect.fundraising.exception.ResourceNotFoundException;

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
    public Donation processDonation(Donation donation) {
        // Retrieve and update fundraising campaign collected amount
        Fundraising fundraising = fundraisingRepository.findById(donation.getFundraising().getFundId())
                .orElseThrow(() -> new ResourceNotFoundException("Fundraising campaign not found"));
        
        BigDecimal donationAmt = BigDecimal.valueOf(donation.getAmount());
        BigDecimal currentCollected = fundraising.getCollectedAmount() != null ? fundraising.getCollectedAmount() : BigDecimal.ZERO;
        fundraising.setCollectedAmount(currentCollected.add(donationAmt));
        fundraisingRepository.save(fundraising);

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
