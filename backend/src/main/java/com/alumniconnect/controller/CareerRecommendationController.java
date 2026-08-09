package com.alumniconnect.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.alumniconnect.entity.CareerRecommendation;
import com.alumniconnect.service.CareerRecommendationService;

@RestController
@RequestMapping("/career")
@CrossOrigin(origins = "*")
public class CareerRecommendationController {

    @Autowired
    private CareerRecommendationService careerRecommendationService;

    @PostMapping("/add")
    public CareerRecommendation addRecommendation(@RequestBody CareerRecommendation recommendation) {
        return careerRecommendationService.addRecommendation(recommendation);
    }

    @PutMapping("/update")
    public CareerRecommendation updateRecommendation(@RequestBody CareerRecommendation recommendation) {
        return careerRecommendationService.updateRecommendation(recommendation);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteRecommendation(@PathVariable Integer id) {
        careerRecommendationService.deleteRecommendation(id);
        return "Career Recommendation deleted successfully";
    }

    @GetMapping("/get/{id}")
    public CareerRecommendation getRecommendationById(@PathVariable Integer id) {
        return careerRecommendationService.getRecommendationById(id);
    }

    @GetMapping("/getall")
    public List<CareerRecommendation> getAllRecommendations() {
        return careerRecommendationService.getAllRecommendations();
    }
}