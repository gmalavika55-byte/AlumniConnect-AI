package com.alumniconnect.mentorship.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "MENTORSHIP_MESSAGE")
public class MentorshipMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MESSAGE_ID")
    private Long id;

    @Column(name = "MENTORSHIP_ID", nullable = false)
    private Long mentorshipId;

    @Column(name = "SENDER_ID", nullable = false)
    private Integer senderId;

    @Column(name = "SENDER_TYPE", nullable = false)
    private String senderType; // "STUDENT" or "ALUMNI"

    @Column(name = "RECEIVER_ID", nullable = false)
    private Integer receiverId;

    @Column(name = "RECEIVER_TYPE", nullable = false)
    private String receiverType; // "STUDENT" or "ALUMNI"

    @Column(name = "MESSAGE_TEXT", nullable = false, length = 2000)
    private String messageText;

    @Column(name = "SENT_AT", nullable = false)
    private LocalDateTime timestamp;

    public MentorshipMessage() {
    }

    public MentorshipMessage(Long mentorshipId, Integer senderId, String senderType,
                             Integer receiverId, String receiverType,
                             String messageText, LocalDateTime timestamp) {
        this.mentorshipId = mentorshipId;
        this.senderId = senderId;
        this.senderType = senderType;
        this.receiverId = receiverId;
        this.receiverType = receiverType;
        this.messageText = messageText;
        this.timestamp = timestamp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMentorshipId() {
        return mentorshipId;
    }

    public void setMentorshipId(Long mentorshipId) {
        this.mentorshipId = mentorshipId;
    }

    public Integer getSenderId() {
        return senderId;
    }

    public void setSenderId(Integer senderId) {
        this.senderId = senderId;
    }

    public String getSenderType() {
        return senderType;
    }

    public void setSenderType(String senderType) {
        this.senderType = senderType;
    }

    public Integer getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Integer receiverId) {
        this.receiverId = receiverId;
    }

    public String getReceiverType() {
        return receiverType;
    }

    public void setReceiverType(String receiverType) {
        this.receiverType = receiverType;
    }

    public String getMessageText() {
        return messageText;
    }

    public void setMessageText(String messageText) {
        this.messageText = messageText;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
