package com.alumniconnect.fundraising.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.alumniconnect.fundraising.entity.Donation;
import com.alumniconnect.fundraising.service.DonationService;

@RestController
@RequestMapping("/fundraising")
public class DonationController {

    @Autowired
    private DonationService donationService;

    @PostMapping("/donate")
    public Donation processDonation(@RequestBody Donation donation) {
        return donationService.processDonation(donation);
    }

    @GetMapping("/donations/campaign/{fundId}")
    public List<Donation> getDonationsByCampaign(@PathVariable Long fundId) {
        return donationService.getDonationsByCampaign(fundId);
    }

    @GetMapping("/donations/alumni/{alumniId}")
    public List<Donation> getDonationsByAlumni(@PathVariable Integer alumniId) {
        return donationService.getDonationsByAlumni(alumniId);
    }

    @GetMapping("/donations/all")
    public List<Donation> getAllDonations() {
        return donationService.getAllDonations();
    }
}
