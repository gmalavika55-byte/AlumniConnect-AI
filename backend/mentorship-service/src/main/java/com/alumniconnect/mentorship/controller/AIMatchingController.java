package com.alumniconnect.mentorship.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.alumniconnect.mentorship.dto.AIMatchingResponse;
import com.alumniconnect.mentorship.service.AIMatchingService;

@RestController
@RequestMapping("/mentorship/ai")
public class AIMatchingController {

    @Autowired
    private AIMatchingService aiMatchingService;

    @GetMapping("/recommendations/{studentId}")
    public AIMatchingResponse getRecommendationsForStudent(@PathVariable Integer studentId) {
        return aiMatchingService.getRecommendationsForStudent(studentId);
    }
}
