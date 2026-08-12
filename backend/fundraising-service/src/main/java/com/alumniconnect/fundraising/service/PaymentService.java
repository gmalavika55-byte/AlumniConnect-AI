package com.alumniconnect.fundraising.service;

import com.alumniconnect.fundraising.dto.CreateOrderRequest;
import com.alumniconnect.fundraising.dto.CreateOrderResponse;
import com.alumniconnect.fundraising.dto.VerifyPaymentRequest;
import com.alumniconnect.fundraising.entity.Donation;

public interface PaymentService {
    CreateOrderResponse createOrder(CreateOrderRequest request);
    Donation verifyPayment(VerifyPaymentRequest request);
}
