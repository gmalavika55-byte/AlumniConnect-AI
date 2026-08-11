package com.alumniconnect.event.entity;

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

    @Column(name = "STUDENT_ID")
    private Integer studentId;

    @Column(name = "ALUMNI_ID")
    private Integer alumniId;

    @Temporal(TemporalType.DATE)
    @Column(name = "REGISTRATION_DATE")
    private Date registrationDate;

    @Column(name = "ATTENDANCE_STATUS")
    private String attendanceStatus;

    // Transient fields to hold details fetched dynamically from auth-service
    @Transient
    private Object student;

    @Transient
    private Object alumni;

    public EventRegistration() {
    }

    public EventRegistration(Integer registrationId, Event event, Integer studentId,
                             Integer alumniId, Date registrationDate,
                             String attendanceStatus) {
        this.registrationId = registrationId;
        this.event = event;
        this.studentId = studentId;
        this.alumniId = alumniId;
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

    public Integer getEventId() {
        return event != null ? event.getEventId() : null;
    }

    public void setEventId(Integer eventId) {
        if (eventId != null) {
            if (this.event == null) {
                this.event = new Event();
            }
            this.event.setEventId(eventId);
        } else {
            this.event = null;
        }
    }
}
