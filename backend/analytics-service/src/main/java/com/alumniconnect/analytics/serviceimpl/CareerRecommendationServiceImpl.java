package com.alumniconnect.analytics.serviceimpl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.alumniconnect.analytics.entity.CareerRecommendation;
import com.alumniconnect.analytics.exception.ResourceNotFoundException;
import com.alumniconnect.analytics.repository.CareerRecommendationRepository;
import com.alumniconnect.analytics.service.CareerRecommendationService;

@Service
public class CareerRecommendationServiceImpl implements CareerRecommendationService {

    @Autowired
    private CareerRecommendationRepository careerRecommendationRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${auth-service.url}")
    private String authServiceUrl;

    @Override
    public CareerRecommendation addRecommendation(CareerRecommendation recommendation) {
        CareerRecommendation saved = careerRecommendationRepository.save(recommendation);
        hydrateStudentProfile(saved);
        return saved;
    }

    @Override
    public CareerRecommendation updateRecommendation(CareerRecommendation recommendation) {
        CareerRecommendation saved = careerRecommendationRepository.save(recommendation);
        hydrateStudentProfile(saved);
        return saved;
    }

    @Override
    public void deleteRecommendation(Integer careerId) {
        CareerRecommendation recommendation = careerRecommendationRepository.findById(careerId)
                .orElseThrow(() -> new ResourceNotFoundException("Career Recommendation not found"));
        careerRecommendationRepository.delete(recommendation);
    }

    @Override
    public CareerRecommendation getRecommendationById(Integer careerId) {
        CareerRecommendation recommendation = careerRecommendationRepository.findById(careerId)
                .orElseThrow(() -> new ResourceNotFoundException("Career Recommendation not found"));
        hydrateStudentProfile(recommendation);
        return recommendation;
    }

    @Override
    public List<CareerRecommendation> getAllRecommendations() {
        List<CareerRecommendation> list = careerRecommendationRepository.findAll();
        list.forEach(this::hydrateStudentProfile);
        return list;
    }

    private void hydrateStudentProfile(CareerRecommendation recommendation) {
        if (recommendation.getStudentId() != null) {
            try {
                Object student = restTemplate.getForObject(
                        authServiceUrl + "/student/get/" + recommendation.getStudentId(), Object.class);
                recommendation.setStudent(student);
            } catch (Exception e) {
                recommendation.setStudent(null);
            }
        }
    }
}
