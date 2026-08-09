package com.alumniconnect.analytics.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.alumniconnect.analytics.entity.CareerRecommendation;

@Repository
public interface CareerRecommendationRepository extends JpaRepository<CareerRecommendation, Integer> {
}
