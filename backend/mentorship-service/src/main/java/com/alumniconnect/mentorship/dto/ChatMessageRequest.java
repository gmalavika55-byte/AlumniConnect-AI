package com.alumniconnect.mentorship.dto;

public class ChatMessageRequest {

    private Long mentorshipId;
    private Integer senderId;
    private String senderType; // "STUDENT" or "ALUMNI"
    private String messageText;

    public ChatMessageRequest() {
    }

    public ChatMessageRequest(Long mentorshipId, Integer senderId, String senderType, String messageText) {
        this.mentorshipId = mentorshipId;
        this.senderId = senderId;
        this.senderType = senderType;
        this.messageText = messageText;
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

    public String getMessageText() {
        return messageText;
    }

    public void setMessageText(String messageText) {
        this.messageText = messageText;
    }
}
