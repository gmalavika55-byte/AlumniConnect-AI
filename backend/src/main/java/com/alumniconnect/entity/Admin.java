package com.alumniconnect.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ADMIN")
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ADMIN_ID")
    private Integer adminId;

    @Column(name = "EMPLOYEE_ID", nullable = false, unique = true)
    private String employeeId;

    @Column(name = "NAME", nullable = false)
    private String name;

    @Column(name = "EMAIL", nullable = false, unique = true)
    private String email;

    @Column(name = "MOBILE")
    private String mobile;

    @Column(name = "DESIGNATION")
    private String designation;

    @Column(name = "DEPARTMENT")
    private String department;

    @Column(name = "ROLE")
    private String role;

    @Column(name = "PASSWORD")
    private String password;

    @Column(name = "PROFILE_PHOTO")
    private String profilePhoto;

    public Admin() {
    }

    public Admin(Integer adminId, String employeeId, String name, String email,
                 String mobile, String designation, String department,
                 String role, String password, String profilePhoto) {
        this.adminId = adminId;
        this.employeeId = employeeId;
        this.name = name;
        this.email = email;
        this.mobile = mobile;
        this.designation = designation;
        this.department = department;
        this.role = role;
        this.password = password;
        this.profilePhoto = profilePhoto;
    }

    public Integer getAdminId() {
        return adminId;
    }

    public void setAdminId(Integer adminId) {
        this.adminId = adminId;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
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

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
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