package com.alumniconnect.mentorship.entity;

import java.time.LocalDate;
import jakarta.persistence.*;

@Entity
@Table(name = "MENTORSHIP_REQUEST")
public class MentorshipRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "REQUEST_ID")
    private Long requestId;

    @Column(name = "STUDENT_ID")
    private Integer studentId;

    @Column(name = "ALUMNI_ID")
    private Integer alumniId;

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

    // Transient fields to hold details fetched dynamically from auth-service
    @Transient
    private Object student;

    @Transient
    private Object alumni;

    public MentorshipRequest() {
    }

    public MentorshipRequest(Long requestId, Integer studentId, Integer alumniId,
                             LocalDate requestDate, String status,
                             LocalDate meetingDate, String meetingLink,
                             String remarks) {
        this.requestId = requestId;
        this.studentId = studentId;
        this.alumniId = alumniId;
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

    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }

    public Integer getAlumniId() {
        return alumniId;
    }

    public void setAlumniId(Integer alumniId) {
        this.alumniId = alumniId;
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

    public Object getStudent() {
        return student;
    }

    public void setStudent(Object student) {
        this.student = student;
    }

    public Object getAlumni() {
        return alumni;
    }

    public void setAlumni(Object alumni) {
        this.alumni = alumni;
    }
}
