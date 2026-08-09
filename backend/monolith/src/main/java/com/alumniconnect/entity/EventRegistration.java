package com.alumniconnect.entity;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "EVENT_REGISTRATION")
public class EventRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "REGISTRATION_ID")
    private Integer registrationId;

    @ManyToOne
    @JoinColumn(name = "EVENT_ID")
    private Event event;

    @ManyToOne
    @JoinColumn(name = "STUDENT_ID")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "ALUMNI_ID")
    private Alumni alumni;

    @Temporal(TemporalType.DATE)
    @Column(name = "REGISTRATION_DATE")
    private Date registrationDate;

    @Column(name = "ATTENDANCE_STATUS")
    private String attendanceStatus;

    public EventRegistration() {
    }

    public EventRegistration(Integer registrationId, Event event, Student student,
                             Alumni alumni, Date registrationDate,
                             String attendanceStatus) {
        this.registrationId = registrationId;
        this.event = event;
        this.student = student;
        this.alumni = alumni;
        this.registrationDate = registrationDate;
        this.attendanceStatus = attendanceStatus;
    }

    public Integer getRegistrationId() {
        return registrationId;
    }

    public void setRegistrationId(Integer registrationId) {
        this.registrationId = registrationId;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
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

    public Date getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(Date registrationDate) {
        this.registrationDate = registrationDate;
    }

    public String getAttendanceStatus() {
        return attendanceStatus;
    }

    public void setAttendanceStatus(String attendanceStatus) {
        this.attendanceStatus = attendanceStatus;
    }
}