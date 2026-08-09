package com.alumniconnect.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ALUMNI")
public class Alumni {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ALUMNI_ID")
    private Integer alumniId;

    @Column(name = "REGISTER_NO", nullable = false, unique = true)
    private String registerNo;

    @Column(name = "NAME", nullable = false)
    private String name;

    @Column(name = "EMAIL", nullable = false, unique = true)
    private String email;

    @Column(name = "MOBILE")
    private String mobile;

    @Column(name = "DEPARTMENT")
    private String department;

    @Column(name = "BATCH")
    private String batch;

    @Column(name = "CURRENT_COMPANY")
    private String currentCompany;

    @Column(name = "DESIGNATION")
    private String designation;

    @Column(name = "EXPERIENCE")
    private Integer experience;

    @Column(name = "LOCATION")
    private String location;

    @Column(name = "SKILLS")
    private String skills;

    @Column(name = "LINKEDIN")
    private String linkedin;

    @Column(name = "PASSWORD")
    private String password;

    @Column(name = "AVAILABLE_FOR_MENTORSHIP")
    private String availableForMentorship;
    
    public Alumni() {
    }

    
    public Alumni(Integer alumniId, String registerNo, String name, String email, String mobile, String department,
			String batch, String currentCompany, String designation, Integer experience, String location, String skills,
			String linkedin, String password, String availableForMentorship) {
		super();
		this.alumniId = alumniId;
		this.registerNo = registerNo;
		this.name = name;
		this.email = email;
		this.mobile = mobile;
		this.department = department;
		this.batch = batch;
		this.currentCompany = currentCompany;
		this.designation = designation;
		this.experience = experience;
		this.location = location;
		this.skills = skills;
		this.linkedin = linkedin;
		this.password = password;
		this.availableForMentorship = availableForMentorship;
	}


	public Integer getAlumniId() {
		return alumniId;
	}


	public void setAlumniId(Integer alumniId) {
		this.alumniId = alumniId;
	}


	public String getRegisterNo() {
		return registerNo;
	}


	public void setRegisterNo(String registerNo) {
		this.registerNo = registerNo;
	}


	public String getName() {
		return name;
	}


	public void setName(String name) {
		this.name = name;
	}


	public String getEmail() {
		return email;
	}


	public void setEmail(String email) {
		this.email = email;
	}


	public String getMobile() {
		return mobile;
	}


	public void setMobile(String mobile) {
		this.mobile = mobile;
	}


	public String getDepartment() {
		return department;
	}


	public void setDepartment(String department) {
		this.department = department;
	}


	public String getBatch() {
		return batch;
	}


	public void setBatch(String batch) {
		this.batch = batch;
	}


	public String getCurrentCompany() {
		return currentCompany;
	}


	public void setCurrentCompany(String currentCompany) {
		this.currentCompany = currentCompany;
	}


	public String getDesignation() {
		return designation;
	}


	public void setDesignation(String designation) {
		this.designation = designation;
	}


	public Integer getExperience() {
		return experience;
	}


	public void setExperience(Integer experience) {
		this.experience = experience;
	}


	public String getLocation() {
		return location;
	}


	public void setLocation(String location) {
		this.location = location;
	}


	public String getSkills() {
		return skills;
	}


	public void setSkills(String skills) {
		this.skills = skills;
	}


	public String getLinkedin() {
		return linkedin;
	}


	public void setLinkedin(String linkedin) {
		this.linkedin = linkedin;
	}


	public String getPassword() {
		return password;
	}


	public void setPassword(String password) {
		this.password = password;
	}


	public String getAvailableForMentorship() {
		return availableForMentorship;
	}


	public void setAvailableForMentorship(String availableForMentorship) {
		this.availableForMentorship = availableForMentorship;
	}
	
    
}