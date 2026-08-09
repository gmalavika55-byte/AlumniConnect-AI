package com.alumniconnect.fundraising.service;

import java.util.List;
import com.alumniconnect.fundraising.entity.Donation;

public interface DonationService {
    Donation processDonation(Donation donation);
    List<Donation> getDonationsByCampaign(Integer fundId);
    List<Donation> getDonationsByAlumni(Integer alumniId);
    List<Donation> getAllDonations();
}
