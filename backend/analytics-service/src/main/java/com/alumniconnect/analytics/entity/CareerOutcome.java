package com.alumniconnect.analytics.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "CAREER_OUTCOME")
public class CareerOutcome {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OUTCOME_ID")
    private Integer outcomeId;

    @Column(name = "STUDENT_ID", nullable = true)
    private Integer studentId;

    @Column(name = "GRADUATION_YEAR")
    private Integer graduationYear;

    @Column(name = "DEPARTMENT")
    private String department;

    @Column(name = "CGPA")
    private Double cgpa;

    @Column(name = "SKILLS", length = 500)
    private String skills;

    @Column(name = "CAREER_GOAL")
    private String careerGoal;

    @Column(name = "PLACEMENT_STATUS")
    private String placementStatus;

    @Column(name = "COMPANY")
    private String company;

    @Column(name = "JOB_ROLE")
    private String jobRole;

    @Column(name = "PACKAGE_LPA")
    private Double packageLpa;

    @Column(name = "PLACEMENT_YEAR")
    private Integer placementYear;

    public CareerOutcome() {
    }

    public CareerOutcome(Integer outcomeId, Integer studentId, Integer graduationYear, String department, Double cgpa,
                         String skills, String careerGoal, String placementStatus, String company, String jobRole,
                         Double packageLpa, Integer placementYear) {
        this.outcomeId = outcomeId;
        this.studentId = studentId;
        this.graduationYear = graduationYear;
        this.department = department;
        this.cgpa = cgpa;
        this.skills = skills;
        this.careerGoal = careerGoal;
        this.placementStatus = placementStatus;
        this.company = company;
        this.jobRole = jobRole;
        this.packageLpa = packageLpa;
        this.placementYear = placementYear;
    }

    public Integer getOutcomeId() {
        return outcomeId;
    }

    public void setOutcomeId(Integer outcomeId) {
        this.outcomeId = outcomeId;
    }

    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }

    public Integer getGraduationYear() {
        return graduationYear;
    }

    public void setGraduationYear(Integer graduationYear) {
        this.graduationYear = graduationYear;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Double getCgpa() {
        return cgpa;
    }

    public void setCgpa(Double cgpa) {
        this.cgpa = cgpa;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getCareerGoal() {
        return careerGoal;
    }

    public void setCareerGoal(String careerGoal) {
        this.careerGoal = careerGoal;
    }

    public String getPlacementStatus() {
        return placementStatus;
    }

    public void setPlacementStatus(String placementStatus) {
        this.placementStatus = placementStatus;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getJobRole() {
        return jobRole;
    }

    public void setJobRole(String jobRole) {
        this.jobRole = jobRole;
    }

    public Double getPackageLpa() {
        return packageLpa;
    }

    public void setPackageLpa(Double packageLpa) {
        this.packageLpa = packageLpa;
    }

    public Integer getPlacementYear() {
        return placementYear;
    }

    public void setPlacementYear(Integer placementYear) {
        this.placementYear = placementYear;
    }
}
