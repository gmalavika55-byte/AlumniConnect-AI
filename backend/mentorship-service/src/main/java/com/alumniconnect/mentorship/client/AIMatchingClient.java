package com.alumniconnect.mentorship.client;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.alumniconnect.mentorship.dto.AIMatchingRequest;
import com.alumniconnect.mentorship.dto.AIMatchingResponse;

@Component
public class AIMatchingClient {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${ai.service.url:http://localhost:8000}")
    private String aiServiceUrl;

    public AIMatchingResponse getRecommendations(AIMatchingRequest request) {
        try {
            String targetUrl = aiServiceUrl.replaceAll("/+$", "") + "/ai/match";
            AIMatchingResponse response = restTemplate.postForObject(targetUrl, request, AIMatchingResponse.class);
            if (response != null && response.getRecommendations() != null) {
                return response;
            }
        } catch (Exception e) {
            System.err.println("Error invoking Python AI matching service (" + aiServiceUrl + "): " + e.getMessage());
        }

        // Graceful fallback if Python AI service is down
        return new AIMatchingResponse(java.util.Collections.emptyList());
    }
}
