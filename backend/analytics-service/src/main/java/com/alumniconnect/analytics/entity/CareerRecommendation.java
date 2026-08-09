package com.alumniconnect.analytics.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "CAREER_RECOMMENDATION")
public class CareerRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CAREER_ID")
    private Integer careerId;

    @Column(name = "STUDENT_ID")
    private Integer studentId;

    @Column(name = "RECOMMENDED_ROLE")
    private String recommendedRole;

    @Column(name = "COMPANY")
    private String company;

    @Column(name = "REQUIRED_SKILLS")
    private String requiredSkills;

    @Column(name = "MATCH_PERCENTAGE")
    private Double matchPercentage;

    // Transient student hydration field
    @Transient
    private Object student;

    public CareerRecommendation() {
    }

    public CareerRecommendation(Integer careerId, Integer studentId, String recommendedRole, String company,
                                String requiredSkills, Double matchPercentage) {
        this.careerId = careerId;
        this.studentId = studentId;
        this.recommendedRole = recommendedRole;
        this.company = company;
        this.requiredSkills = requiredSkills;
        this.matchPercentage = matchPercentage;
    }

    public Integer getCareerId() {
        return careerId;
    }

    public void setCareerId(Integer careerId) {
        this.careerId = careerId;
    }

    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }

    public String getRecommendedRole() {
        return recommendedRole;
    }

    public void setRecommendedRole(String recommendedRole) {
        this.recommendedRole = recommendedRole;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getRequiredSkills() {
        return requiredSkills;
    }

    public void setRequiredSkills(String requiredSkills) {
        this.requiredSkills = requiredSkills;
    }

    public Double getMatchPercentage() {
        return matchPercentage;
    }

    public void setMatchPercentage(Double matchPercentage) {
        this.matchPercentage = matchPercentage;
    }

    public Object getStudent() {
        return student;
    }

    public void setStudent(Object student) {
        this.student = student;
    }
}
