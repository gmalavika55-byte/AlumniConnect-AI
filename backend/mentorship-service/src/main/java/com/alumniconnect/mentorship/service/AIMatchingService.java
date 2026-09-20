package com.alumniconnect.mentorship.service;

import com.alumniconnect.mentorship.dto.AIMatchingResponse;

public interface AIMatchingService {
    AIMatchingResponse getRecommendationsForStudent(Integer studentId);
}
