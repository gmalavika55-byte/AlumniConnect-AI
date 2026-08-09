package com.alumniconnect.entity;

import java.time.LocalDate;

import jakarta.persistence.*;

@Entity
@Table(name = "MENTORSHIP_REQUEST")
public class MentorshipRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "REQUEST_ID")
    private Long requestId;

    @ManyToOne
    @JoinColumn(name = "STUDENT_ID")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "ALUMNI_ID")
    private Alumni alumni;

    @Column(name = "REQUEST_DATE")
    private LocalDate requestDate;

    @Column(name = "STATUS")
    private String status;

    @Column(name = "MEETING_DATE")
    private LocalDate meetingDate;

    @Column(name = "MEETING_LINK")
    private String meetingLink;

    @Column(name = "REMARKS")
    private String remarks;

    public MentorshipRequest() {
    }

    public MentorshipRequest(Long requestId, Student student, Alumni alumni,
                             LocalDate requestDate, String status,
                             LocalDate meetingDate, String meetingLink,
                             String remarks) {
        this.requestId = requestId;
        this.student = student;
        this.alumni = alumni;
        this.requestDate = requestDate;
        this.status = status;
        this.meetingDate = meetingDate;
        this.meetingLink = meetingLink;
        this.remarks = remarks;
    }

    public Long getRequestId() {
        return requestId;
    }

    public void setRequestId(Long requestId) {
        this.requestId = requestId;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Alumni getAlumni() {
        return alumni;
    }

    public void setAlumni(Alumni alumni) {
        this.alumni = alumni;
    }

    public LocalDate getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(LocalDate requestDate) {
        this.requestDate = requestDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getMeetingDate() {
        return meetingDate;
    }

    public void setMeetingDate(LocalDate meetingDate) {
        this.meetingDate = meetingDate;
    }

    public String getMeetingLink() {
        return meetingLink;
    }

    public void setMeetingLink(String meetingLink) {
        this.meetingLink = meetingLink;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    @Override
    public String toString() {
        return "MentorshipRequest [requestId=" + requestId +
                ", student=" + student +
                ", alumni=" + alumni +
                ", requestDate=" + requestDate +
                ", status=" + status +
                ", meetingDate=" + meetingDate +
                ", meetingLink=" + meetingLink +
                ", remarks=" + remarks + "]";
    }
}