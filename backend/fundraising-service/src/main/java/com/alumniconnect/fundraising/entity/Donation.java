package com.alumniconnect.fundraising.entity;

import java.time.LocalDate;
import jakarta.persistence.*;

@Entity
@Table(name = "DONATION")
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DONATION_ID")
    private Long donationId;

    @ManyToOne
    @JoinColumn(name = "FUND_ID", nullable = false)
    private Fundraising fundraising;

    @Column(name = "ALUMNI_ID", nullable = false)
    private Integer alumniId;

    @Column(name = "AMOUNT")
    private Double amount;

    @Column(name = "DONATION_DATE")
    private LocalDate donationDate;

    @Column(name = "PAYMENT_STATUS")
    private String paymentStatus;

    // Transient field to hold details fetched dynamically from auth-service
    @Transient
    private Object alumni;

    public Donation() {
    }

    public Donation(Long donationId, Fundraising fundraising, Integer alumniId,
                    Double amount, LocalDate donationDate, String paymentStatus) {
        this.donationId = donationId;
        this.fundraising = fundraising;
        this.alumniId = alumniId;
        this.amount = amount;
        this.donationDate = donationDate;
        this.paymentStatus = paymentStatus;
    }

    public Long getDonationId() {
        return donationId;
    }

    public void setDonationId(Long donationId) {
        this.donationId = donationId;
    }

    public Fundraising getFundraising() {
        return fundraising;
    }

    public void setFundraising(Fundraising fundraising) {
        this.fundraising = fundraising;
    }

    public Integer getAlumniId() {
        return alumniId;
    }

    public void setAlumniId(Integer alumniId) {
        this.alumniId = alumniId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public LocalDate getDonationDate() {
        return donationDate;
    }

    public void setDonationDate(LocalDate donationDate) {
        this.donationDate = donationDate;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public Object getAlumni() {
        return alumni;
    }

    public void setAlumni(Object alumni) {
        this.alumni = alumni;
    }
}
