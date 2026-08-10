package com.alumniconnect.fundraising.serviceimpl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alumniconnect.fundraising.entity.Fundraising;
import com.alumniconnect.fundraising.exception.ResourceNotFoundException;
import com.alumniconnect.fundraising.repository.FundraisingRepository;
import com.alumniconnect.fundraising.service.FundraisingService;

@Service
public class FundraisingServiceImpl implements FundraisingService {

    @Autowired
    private FundraisingRepository fundraisingRepository;

    @Override
    public Fundraising addFundraising(Fundraising fundraising) {
        return fundraisingRepository.save(fundraising);
    }

    @Override
    public Fundraising updateFundraising(Fundraising fundraising) {
        return fundraisingRepository.save(fundraising);
    }

    @Override
    public void deleteFundraising(Long fundId) {
        Fundraising fundraising = fundraisingRepository.findById(fundId)
                .orElseThrow(() -> new ResourceNotFoundException("Fundraising not found"));
        fundraisingRepository.delete(fundraising);
    }

    @Override
    public Fundraising getFundraisingById(Long fundId) {
        return fundraisingRepository.findById(fundId)
                .orElseThrow(() -> new ResourceNotFoundException("Fundraising not found"));
    }

    @Override
    public List<Fundraising> getAllFundraisings() {
        return fundraisingRepository.findAll();
    }
}
