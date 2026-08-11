package com.alumniconnect.auth.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "CERTIFICATE")
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CERTIFICATE_ID")
    private Long certificateId;

    @Column(name = "STUDENT_ID")
    private Integer studentId;

    @Column(name = "CERTIFICATE_NAME")
    private String certificateName;

    @Column(name = "ORGANIZATION")
    private String organization;

    @Column(name = "ISSUE_DATE")
    private String issueDate;

    @Column(name = "CERTIFICATE_URL")
    private String certificateUrl;

    public Certificate() {
    }

    public Certificate(Long certificateId, Integer studentId, String certificateName, String organization, String issueDate, String certificateUrl) {
        this.certificateId = certificateId;
        this.studentId = studentId;
        this.certificateName = certificateName;
        this.organization = organization;
        this.issueDate = issueDate;
        this.certificateUrl = certificateUrl;
    }

    public Long getCertificateId() {
        return certificateId;
    }

    public void setCertificateId(Long certificateId) {
        this.certificateId = certificateId;
    }

    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }

    public String getCertificateName() {
        return certificateName;
    }

    public void setCertificateName(String certificateName) {
        this.certificateName = certificateName;
    }

    public String getOrganization() {
        return organization;
    }

    public void setOrganization(String organization) {
        this.organization = organization;
    }

    public String getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(String issueDate) {
        this.issueDate = issueDate;
    }

    public String getCertificateUrl() {
        return certificateUrl;
    }

    public void setCertificateUrl(String certificateUrl) {
        this.certificateUrl = certificateUrl;
    }
}
