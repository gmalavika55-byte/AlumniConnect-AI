package com.alumniconnect.analytics.service;

import java.util.Map;

public interface AnalyticsService {
    Map<String, Object> getCareerAnalytics();
    Map<String, Object> getPlacementAnalytics();
}
