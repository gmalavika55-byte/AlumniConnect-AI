package com.alumniconnect.fundraising.dto;

public class CreateOrderRequest {
    private Long fundId;
    private Double amount;
    private Integer alumniId;

    public CreateOrderRequest() {}

    public CreateOrderRequest(Long fundId, Double amount, Integer alumniId) {
        this.fundId = fundId;
        this.amount = amount;
        this.alumniId = alumniId;
    }

    public Long getFundId() { return fundId; }
    public void setFundId(Long fundId) { this.fundId = fundId; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public Integer getAlumniId() { return alumniId; }
    public void setAlumniId(Integer alumniId) { this.alumniId = alumniId; }
}
