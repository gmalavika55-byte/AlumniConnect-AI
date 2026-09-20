package com.alumniconnect.analytics.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.alumniconnect.analytics.entity.CareerOutcome;

@Repository
public interface CareerOutcomeRepository extends JpaRepository<CareerOutcome, Integer> {
    List<CareerOutcome> findByDepartment(String department);
    List<CareerOutcome> findByPlacementStatus(String placementStatus);
    List<CareerOutcome> findByPlacementYear(Integer placementYear);
    List<CareerOutcome> findByGraduationYear(Integer graduationYear);
}
