package com.alumniconnect.entity;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "EVENTS")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "EVENT_ID")
    private Integer eventId;

    @Column(name = "TITLE")
    private String title;

    @Column(name = "CATEGORY")
    private String category;

    @Column(name = "DESCRIPTION")
    private String description;

    @Temporal(TemporalType.DATE)
    @Column(name = "EVENT_DATE")
    private Date eventDate;

    @Column(name = "START_TIME")
    private String startTime;

    @Column(name = "END_TIME")
    private String endTime;

    @Column(name = "VENUE")
    private String venue;

    @Column(name = "EVENT_MODE")
    private String eventMode;

    @Column(name = "ORGANIZER")
    private String organizer;

    @Temporal(TemporalType.DATE)
    @Column(name = "REGISTRATION_DEADLINE")
    private Date registrationDeadline;

    @Column(name = "MAX_PARTICIPANTS")
    private Integer maxParticipants;

    @Column(name = "STATUS")
    private String status;

    public Event() {
    }

    public Event(Integer eventId, String title, String category, String description, Date eventDate,
                 String startTime, String endTime, String venue, String eventMode,
                 String organizer, Date registrationDeadline, Integer maxParticipants,
                 String status) {
        this.eventId = eventId;
        this.title = title;
        this.category = category;
        this.description = description;
        this.eventDate = eventDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.venue = venue;
        this.eventMode = eventMode;
        this.organizer = organizer;
        this.registrationDeadline = registrationDeadline;
        this.maxParticipants = maxParticipants;
        this.status = status;
    }

    public Integer getEventId() {
        return eventId;
    }

    public void setEventId(Integer eventId) {
        this.eventId = eventId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getEventDate() {
        return eventDate;
    }

    public void setEventDate(Date eventDate) {
        this.eventDate = eventDate;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public String getEventMode() {
        return eventMode;
    }

    public void setEventMode(String eventMode) {
        this.eventMode = eventMode;
    }

    public String getOrganizer() {
        return organizer;
    }

    public void setOrganizer(String organizer) {
        this.organizer = organizer;
    }

    public Date getRegistrationDeadline() {
        return registrationDeadline;
    }

    public void setRegistrationDeadline(Date registrationDeadline) {
        this.registrationDeadline = registrationDeadline;
    }

    public Integer getMaxParticipants() {
        return maxParticipants;
    }

    public void setMaxParticipants(Integer maxParticipants) {
        this.maxParticipants = maxParticipants;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}