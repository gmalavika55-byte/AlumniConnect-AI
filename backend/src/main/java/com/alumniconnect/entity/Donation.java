package com.alumniconnect.entity;

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

    @ManyToOne
    @JoinColumn(name = "ALUMNI_ID", nullable = false)
    private Alumni alumni;

    @Column(name = "AMOUNT")
    private Double amount;

    @Column(name = "DONATION_DATE")
    private LocalDate donationDate;

    @Column(name = "PAYMENT_STATUS")
    private String paymentStatus;

    public Donation() {
    }

    public Donation(Long donationId, Fundraising fundraising, Alumni alumni,
                    Double amount, LocalDate donationDate, String paymentStatus) {
        this.donationId = donationId;
        this.fundraising = fundraising;
        this.alumni = alumni;
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

    public Alumni getAlumni() {
        return alumni;
    }

    public void setAlumni(Alumni alumni) {
        this.alumni = alumni;
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

    @Override
    public String toString() {
        return "Donation [donationId=" + donationId +
                ", fundraising=" + fundraising +
                ", alumni=" + alumni +
                ", amount=" + amount +
                ", donationDate=" + donationDate +
                ", paymentStatus=" + paymentStatus + "]";
    }
}