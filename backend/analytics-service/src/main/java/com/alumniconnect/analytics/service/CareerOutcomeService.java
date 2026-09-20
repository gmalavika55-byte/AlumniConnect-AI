package com.alumniconnect.analytics.service;

import java.util.List;
import com.alumniconnect.analytics.entity.CareerOutcome;

public interface CareerOutcomeService {
    CareerOutcome createCareerOutcome(CareerOutcome outcome);
    List<CareerOutcome> getAllCareerOutcomes();
    CareerOutcome getCareerOutcomeById(Integer id);
    CareerOutcome updateCareerOutcome(Integer id, CareerOutcome outcome);
    CareerOutcome updateCareerOutcome(CareerOutcome outcome);
    void deleteCareerOutcome(Integer id);
    List<CareerOutcome> findByDepartment(String department);
    List<CareerOutcome> findByPlacementStatus(String placementStatus);
    void seedInitialDemoData();
}
