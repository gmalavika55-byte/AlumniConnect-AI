package com.alumniconnect.fundraising.service;

import java.util.List;
import com.alumniconnect.fundraising.entity.Fundraising;

public interface FundraisingService {
    Fundraising addFundraising(Fundraising fundraising);
    Fundraising updateFundraising(Fundraising fundraising);
    void deleteFundraising(Long fundId);
    Fundraising getFundraisingById(Long fundId);
    List<Fundraising> getAllFundraisings();
}
