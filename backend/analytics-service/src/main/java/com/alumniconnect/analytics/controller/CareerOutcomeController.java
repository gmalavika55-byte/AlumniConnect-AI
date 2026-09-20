package com.alumniconnect.analytics.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.alumniconnect.analytics.entity.CareerOutcome;
import com.alumniconnect.analytics.service.CareerOutcomeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/career-outcome")
@Tag(name = "Career Outcome", description = "Historical Placement & Career Outcome Data APIs for Analytics & AI")
public class CareerOutcomeController {

    @Autowired
    private CareerOutcomeService service;

    @Operation(summary = "Add a new historical career outcome record")
    @PostMapping("/add")
    public ResponseEntity<CareerOutcome> addCareerOutcome(@RequestBody CareerOutcome outcome) {
        CareerOutcome created = service.createCareerOutcome(outcome);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @Operation(summary = "Get all historical career outcome records")
    @GetMapping("/getall")
    public ResponseEntity<List<CareerOutcome>> getAllCareerOutcomes() {
        List<CareerOutcome> list = service.getAllCareerOutcomes();
        return ResponseEntity.ok(list);
    }

    @Operation(summary = "Get a career outcome record by ID")
    @GetMapping("/get/{id}")
    public ResponseEntity<CareerOutcome> getCareerOutcomeById(@PathVariable Integer id) {
        CareerOutcome outcome = service.getCareerOutcomeById(id);
        return ResponseEntity.ok(outcome);
    }

    @Operation(summary = "Update an existing career outcome record")
    @PutMapping("/update")
    public ResponseEntity<CareerOutcome> updateCareerOutcome(@RequestBody CareerOutcome outcome) {
        CareerOutcome updated = service.updateCareerOutcome(outcome);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Update an existing career outcome record by path ID")
    @PutMapping("/update/{id}")
    public ResponseEntity<CareerOutcome> updateCareerOutcomeById(@PathVariable Integer id, @RequestBody CareerOutcome outcome) {
        CareerOutcome updated = service.updateCareerOutcome(id, outcome);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Delete a career outcome record by ID")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteCareerOutcome(@PathVariable Integer id) {
        service.deleteCareerOutcome(id);
        return ResponseEntity.ok("Career outcome record deleted successfully.");
    }
}
