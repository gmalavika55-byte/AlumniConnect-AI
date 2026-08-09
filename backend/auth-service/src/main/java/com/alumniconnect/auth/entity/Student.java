package com.alumniconnect.auth.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "STUDENT")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "STUDENT_ID")
    private Integer studentId;

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

    @Column(name = "COURSE")
    private String course;

    @Column(name = "YEAR_OF_STUDY")
    private Integer yearOfStudy;

    @Column(name = "BATCH")
    private String batch;

    @Column(name = "SKILLS")
    private String skills;

    @Column(name = "CAREER_GOAL")
    private String careerGoal;

    @Column(name = "PASSWORD")
    private String password;

    @Column(name = "PROFILE_PHOTO")
    private String profilePhoto;

    public Student() {
    }

    public Student(Integer studentId, String registerNo, String name, String email, String mobile,
                   String department, String course, Integer yearOfStudy, String batch,
                   String skills, String careerGoal, String password, String profilePhoto) {
        this.studentId = studentId;
        this.registerNo = registerNo;
        this.name = name;
        this.email = email;
        this.mobile = mobile;
        this.department = department;
        this.course = course;
        this.yearOfStudy = yearOfStudy;
        this.batch = batch;
        this.skills = skills;
        this.careerGoal = careerGoal;
        this.password = password;
        this.profilePhoto = profilePhoto;
    }

    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
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

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public Integer getYearOfStudy() {
        return yearOfStudy;
    }

    public void setYearOfStudy(Integer yearOfStudy) {
        this.yearOfStudy = yearOfStudy;
    }

    public String getBatch() {
        return batch;
    }

    public void setBatch(String batch) {
        this.batch = batch;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getProfilePhoto() {
        return profilePhoto;
    }

    public void setProfilePhoto(String profilePhoto) {
        this.profilePhoto = profilePhoto;
    }
}
