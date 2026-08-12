package com.alumniconnect.fundraising.dto;

public class CreateOrderResponse {
    private String orderId;
    private Double amount;
    private Long amountInPaise;
    private String currency;
    private String keyId;
    private Long fundId;

    public CreateOrderResponse() {}

    public CreateOrderResponse(String orderId, Double amount, Long amountInPaise, String currency, String keyId, Long fundId) {
        this.orderId = orderId;
        this.amount = amount;
        this.amountInPaise = amountInPaise;
        this.currency = currency;
        this.keyId = keyId;
        this.fundId = fundId;
    }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public Long getAmountInPaise() { return amountInPaise; }
    public void setAmountInPaise(Long amountInPaise) { this.amountInPaise = amountInPaise; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getKeyId() { return keyId; }
    public void setKeyId(String keyId) { this.keyId = keyId; }

    public Long getFundId() { return fundId; }
    public void setFundId(Long fundId) { this.fundId = fundId; }
}
