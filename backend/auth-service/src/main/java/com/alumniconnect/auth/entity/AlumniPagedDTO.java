package com.alumniconnect.auth.entity;

public class AlumniPagedDTO {

    private Integer alumniId;
    private String registerNo;
    private String name;
    private String email;
    private String mobile;
    private String department;
    private String batch;
    private String currentCompany;
    private String designation;
    private Integer experience;
    private String location;
    private String skills;
    private String linkedin;
    private String availableForMentorship;
    private String resumeName;
    private String resumeUrl;

    public AlumniPagedDTO() {
    }

    public AlumniPagedDTO(Alumni a) {
        if (a != null) {
            this.alumniId = a.getAlumniId();
            this.registerNo = a.getRegisterNo();
            this.name = a.getName();
            this.email = a.getEmail();
            this.mobile = a.getMobile();
            this.department = a.getDepartment();
            this.batch = a.getBatch();
            this.currentCompany = a.getCurrentCompany();
            this.designation = a.getDesignation();
            this.experience = a.getExperience();
            this.location = a.getLocation();
            this.skills = a.getSkills();
            this.linkedin = a.getLinkedin();
            this.availableForMentorship = a.getAvailableForMentorship();
            this.resumeName = a.getResumeName();
            this.resumeUrl = a.getResumeUrl();
        }
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

    public String getAvailableForMentorship() {
        return availableForMentorship;
    }

    public void setAvailableForMentorship(String availableForMentorship) {
        this.availableForMentorship = availableForMentorship;
    }

    public String getResumeName() {
        return resumeName;
    }

    public void setResumeName(String resumeName) {
        this.resumeName = resumeName;
    }

    public String getResumeUrl() {
        return resumeUrl;
    }

    public void setResumeUrl(String resumeUrl) {
        this.resumeUrl = resumeUrl;
    }
}
