package com.alumniconnect.analytics.controller;

import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.alumniconnect.analytics.service.AnalyticsService;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/career")
    public Map<String, Object> getCareerAnalytics() {
        return analyticsService.getCareerAnalytics();
    }

    @GetMapping("/placement")
    public Map<String, Object> getPlacementAnalytics() {
        return analyticsService.getPlacementAnalytics();
    }
}
