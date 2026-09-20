package com.alumniconnect.fundraising.serviceimpl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.alumniconnect.fundraising.entity.Fundraising;
import com.alumniconnect.fundraising.exception.ResourceNotFoundException;
import com.alumniconnect.fundraising.repository.FundraisingRepository;
import com.alumniconnect.fundraising.service.FundraisingService;

@Service
public class FundraisingServiceImpl implements FundraisingService {

    @Autowired
    private FundraisingRepository fundraisingRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${auth-service.url:http://localhost:8101}")
    private String authServiceUrl;

    @Override
    public Fundraising addFundraising(Fundraising fundraising) {
        Fundraising saved = fundraisingRepository.save(fundraising);
        try {
            java.util.Map<String, Object> adminNotifPayload = new java.util.HashMap<>();
            adminNotifPayload.put("userId", saved.getFundId());
            adminNotifPayload.put("userType", "ADMIN");
            adminNotifPayload.put("title", "New Fundraising Campaign");
            adminNotifPayload.put("message", "A new fundraising campaign (" + (saved.getTitle() != null ? saved.getTitle() : "Campaign #" + saved.getFundId()) + ") has been created.");
            adminNotifPayload.put("notificationDate", java.time.LocalDateTime.now().toString());
            adminNotifPayload.put("status", "UNREAD");

            restTemplate.postForObject(authServiceUrl + "/notification/add", adminNotifPayload, Object.class);
        } catch (Exception e) {}
        return saved;
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
