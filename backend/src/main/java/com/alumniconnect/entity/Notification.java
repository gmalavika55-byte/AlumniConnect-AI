package com.alumniconnect.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "NOTIFICATION")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "NOTIFICATION_ID")
    private Long notificationId;

    @Column(name = "USER_TYPE")
    private String userType;

    @Column(name = "USER_ID")
    private Long userId;

    @Column(name = "TITLE")
    private String title;

    @Column(name = "MESSAGE")
    private String message;

    @Column(name = "NOTIFICATION_DATE")
    private LocalDateTime notificationDate;

    @Column(name = "STATUS")
    private String status;

    public Notification() {
    }

    public Notification(Long notificationId, String userType, Long userId,
                        String title, String message,
                        LocalDateTime notificationDate, String status) {
        this.notificationId = notificationId;
        this.userType = userType;
        this.userId = userId;
        this.title = title;
        this.message = message;
        this.notificationDate = notificationDate;
        this.status = status;
    }

    public Long getNotificationId() {
        return notificationId;
    }

    public void setNotificationId(Long notificationId) {
        this.notificationId = notificationId;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getNotificationDate() {
        return notificationDate;
    }

    public void setNotificationDate(LocalDateTime notificationDate) {
        this.notificationDate = notificationDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "Notification [notificationId=" + notificationId
                + ", userType=" + userType
                + ", userId=" + userId
                + ", title=" + title
                + ", message=" + message
                + ", notificationDate=" + notificationDate
                + ", status=" + status + "]";
    }
}