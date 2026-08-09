package com.alumniconnect.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "CAREER_RECOMMENDATION")
public class CareerRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CAREER_ID")
    private Integer careerId;

    @ManyToOne
    @JoinColumn(name = "STUDENT_ID")
    private Student student;

    @Column(name = "RECOMMENDED_ROLE")
    private String recommendedRole;

    @Column(name = "COMPANY")
    private String company;

    @Column(name = "REQUIRED_SKILLS")
    private String requiredSkills;

    @Column(name = "MATCH_PERCENTAGE")
    private Double matchPercentage;
    public CareerRecommendation() {
    }

	public CareerRecommendation(Integer careerId, Student student, String recommendedRole, String company,
			String requiredSkills, Double matchPercentage) {
		super();
		this.careerId = careerId;
		this.student = student;
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

	public Student getStudent() {
		return student;
	}

	public void setStudent(Student student) {
		this.student = student;
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

    
}