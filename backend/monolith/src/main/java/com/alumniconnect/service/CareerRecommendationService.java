package com.alumniconnect.service;

import java.util.List;

import com.alumniconnect.entity.CareerRecommendation;

public interface CareerRecommendationService {

    CareerRecommendation addRecommendation(CareerRecommendation recommendation);

    CareerRecommendation updateRecommendation(CareerRecommendation recommendation);

    void deleteRecommendation(Integer careerId);

    CareerRecommendation getRecommendationById(Integer careerId);

    List<CareerRecommendation> getAllRecommendations();

}