package com.alumniconnect.fundraising.service;

import java.util.List;
import com.alumniconnect.fundraising.entity.Fundraising;

public interface FundraisingService {
    Fundraising addFundraising(Fundraising fundraising);
    Fundraising updateFundraising(Fundraising fundraising);
    void deleteFundraising(Integer fundId);
    Fundraising getFundraisingById(Integer fundId);
    List<Fundraising> getAllFundraisings();
}
