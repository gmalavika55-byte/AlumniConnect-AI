package com.alumniconnect.mentorship.dto;

import java.util.List;

public class AIMatchingResponse {
    private List<RecommendationItemDTO> recommendations;

    public AIMatchingResponse() {}

    public AIMatchingResponse(List<RecommendationItemDTO> recommendations) {
        this.recommendations = recommendations;
    }

    public List<RecommendationItemDTO> getRecommendations() { return recommendations; }
    public void setRecommendations(List<RecommendationItemDTO> recommendations) { this.recommendations = recommendations; }

    public static class RecommendationItemDTO {
        private Integer alumniId;
        private String name;
        private Double matchScore;
        private String designation;
        private String company;
        private String department;
        private Double experience;
        private List<String> reasons;

        public RecommendationItemDTO() {}

        public Integer getAlumniId() { return alumniId; }
        public void setAlumniId(Integer alumniId) { this.alumniId = alumniId; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public Double getMatchScore() { return matchScore; }
        public void setMatchScore(Double matchScore) { this.matchScore = matchScore; }

        public String getDesignation() { return designation; }
        public void setDesignation(String designation) { this.designation = designation; }

        public String getCompany() { return company; }
        public void setCompany(String company) { this.company = company; }

        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }

        public Double getExperience() { return experience; }
        public void setExperience(Double experience) { this.experience = experience; }

        public List<String> getReasons() { return reasons; }
        public void setReasons(List<String> reasons) { this.reasons = reasons; }
    }
}
