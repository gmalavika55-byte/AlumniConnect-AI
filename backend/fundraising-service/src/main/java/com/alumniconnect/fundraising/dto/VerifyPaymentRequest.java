package com.alumniconnect.fundraising.dto;

public class VerifyPaymentRequest {
    private String razorpayPaymentId;
    private String razorpayOrderId;
    private String razorpaySignature;
    private Long fundId;
    private Double amount;
    private Integer alumniId;

    public VerifyPaymentRequest() {}

    public VerifyPaymentRequest(String razorpayPaymentId, String razorpayOrderId, String razorpaySignature, Long fundId, Double amount, Integer alumniId) {
        this.razorpayPaymentId = razorpayPaymentId;
        this.razorpayOrderId = razorpayOrderId;
        this.razorpaySignature = razorpaySignature;
        this.fundId = fundId;
        this.amount = amount;
        this.alumniId = alumniId;
    }

    public String getRazorpayPaymentId() { return razorpayPaymentId; }
    public void setRazorpayPaymentId(String razorpayPaymentId) { this.razorpayPaymentId = razorpayPaymentId; }

    public String getRazorpayOrderId() { return razorpayOrderId; }
    public void setRazorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; }

    public String getRazorpaySignature() { return razorpaySignature; }
    public void setRazorpaySignature(String razorpaySignature) { this.razorpaySignature = razorpaySignature; }

    public Long getFundId() { return fundId; }
    public void setFundId(Long fundId) { this.fundId = fundId; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public Integer getAlumniId() { return alumniId; }
    public void setAlumniId(Integer alumniId) { this.alumniId = alumniId; }
}
