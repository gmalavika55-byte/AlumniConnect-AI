package com.alumniconnect.fundraising.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.alumniconnect.fundraising.dto.CreateOrderRequest;
import com.alumniconnect.fundraising.dto.CreateOrderResponse;
import com.alumniconnect.fundraising.dto.VerifyPaymentRequest;
import com.alumniconnect.fundraising.entity.Donation;
import com.alumniconnect.fundraising.service.PaymentService;

@RestController
@RequestMapping("/fundraising/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-order")
    public CreateOrderResponse createOrder(@RequestBody CreateOrderRequest request) {
        return paymentService.createOrder(request);
    }

    @PostMapping("/verify")
    public Donation verifyPayment(@RequestBody VerifyPaymentRequest request) {
        return paymentService.verifyPayment(request);
    }
}
