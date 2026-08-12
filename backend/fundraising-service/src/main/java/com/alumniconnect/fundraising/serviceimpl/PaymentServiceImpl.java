package com.alumniconnect.fundraising.serviceimpl;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alumniconnect.fundraising.dto.CreateOrderRequest;
import com.alumniconnect.fundraising.dto.CreateOrderResponse;
import com.alumniconnect.fundraising.dto.VerifyPaymentRequest;
import com.alumniconnect.fundraising.entity.Donation;
import com.alumniconnect.fundraising.entity.Fundraising;
import com.alumniconnect.fundraising.exception.ResourceNotFoundException;
import com.alumniconnect.fundraising.repository.FundraisingRepository;
import com.alumniconnect.fundraising.service.DonationService;
import com.alumniconnect.fundraising.service.PaymentService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private FundraisingRepository fundraisingRepository;

    @Autowired
    private DonationService donationService;

    @Value("${razorpay.key.id:rzp_test_5173AlumniKCE}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret:secret123testKeyRazorpay456}")
    private String razorpayKeySecret;

    // Cache to prevent duplicate payment callbacks
    private final Set<String> processedPayments = ConcurrentHashMap.newKeySet();
    private final ConcurrentHashMap<String, Donation> processedDonationMap = new ConcurrentHashMap<>();

    @Override
    public CreateOrderResponse createOrder(CreateOrderRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Order request payload must not be null.");
        }
        if (request.getAmount() == null || request.getAmount() <= 0) {
            throw new IllegalArgumentException("Donation amount must be greater than 0.");
        }
        if (request.getFundId() == null) {
            throw new IllegalArgumentException("Campaign ID must be specified.");
        }

        Long fundId = request.getFundId();
        Fundraising fundraising = fundraisingRepository.findById(fundId)
                .orElseThrow(() -> new ResourceNotFoundException("Fundraising campaign not found with ID: " + fundId));

        String status = fundraising.getStatus();
        if (status != null && ("CLOSED".equalsIgnoreCase(status) || "COMPLETED".equalsIgnoreCase(status))) {
            throw new IllegalArgumentException("This campaign is closed and no longer accepting donations.");
        }

        if (fundraising.getEndDate() != null && LocalDate.now().isAfter(fundraising.getEndDate())) {
            throw new IllegalArgumentException("The deadline for this campaign has passed.");
        }

        BigDecimal target = fundraising.getTargetAmount() != null ? fundraising.getTargetAmount() : BigDecimal.ZERO;
        BigDecimal currentCollected = fundraising.getCollectedAmount() != null ? fundraising.getCollectedAmount() : BigDecimal.ZERO;

        if (target.compareTo(BigDecimal.ZERO) > 0 && currentCollected.compareTo(target) >= 0) {
            throw new IllegalArgumentException("Target amount for this campaign has already been reached.");
        }

        BigDecimal donationAmt = BigDecimal.valueOf(request.getAmount());
        if (target.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal remaining = target.subtract(currentCollected);
            if (donationAmt.compareTo(remaining) > 0) {
                throw new IllegalArgumentException("Donation amount exceeds remaining target of ₹" + remaining + ".");
            }
        }

        long amountInPaise = Math.round(request.getAmount() * 100);
        String razorpayOrderId = null;

        try {
            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "rcpt_" + fundId + "_" + System.currentTimeMillis());

            Order order = razorpay.orders.create(orderRequest);
            razorpayOrderId = order.get("id");
            System.out.println("Razorpay Sandbox Order Created: " + razorpayOrderId);
        } catch (Exception e) {
            System.out.println("Razorpay API Notice: " + e.getMessage() + ". Initializing local Test Mode Order ID.");
            razorpayOrderId = "order_test_" + System.currentTimeMillis() + "_" + fundId;
        }

        return new CreateOrderResponse(
            razorpayOrderId,
            request.getAmount(),
            amountInPaise,
            "INR",
            razorpayKeyId,
            fundId
        );
    }

    @Override
    @Transactional
    public Donation verifyPayment(VerifyPaymentRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Payment verification payload must not be null.");
        }
        if (request.getRazorpayPaymentId() == null || request.getRazorpayPaymentId().trim().isEmpty()) {
            throw new IllegalArgumentException("Razorpay Payment ID is required.");
        }
        if (request.getRazorpayOrderId() == null || request.getRazorpayOrderId().trim().isEmpty()) {
            throw new IllegalArgumentException("Razorpay Order ID is required.");
        }
        if (request.getRazorpaySignature() == null || request.getRazorpaySignature().trim().isEmpty()) {
            throw new IllegalArgumentException("Razorpay Signature is required.");
        }

        String paymentId = request.getRazorpayPaymentId().trim();

        // Duplicate payment protection
        if (processedPayments.contains(paymentId)) {
            Donation existing = processedDonationMap.get(paymentId);
            if (existing != null) {
                return existing;
            }
        }

        // Verify Razorpay HMAC-SHA256 Signature
        boolean isSignatureValid = verifyHmacSha256(
            request.getRazorpayOrderId().trim(),
            paymentId,
            request.getRazorpaySignature().trim(),
            razorpayKeySecret
        );

        if (!isSignatureValid) {
            throw new IllegalArgumentException("Payment verification failed. Invalid Razorpay signature.");
        }

        // Prepare donation entity and delegate to existing DonationServiceImpl
        Donation donation = new Donation();
        donation.setAmount(request.getAmount());
        donation.setAlumniId(request.getAlumniId());
        donation.setDonationDate(LocalDate.now());
        donation.setPaymentStatus("SUCCESS");

        Fundraising f = new Fundraising();
        f.setFundId(request.getFundId());
        donation.setFundraising(f);

        Donation saved = donationService.processDonation(donation);

        processedPayments.add(paymentId);
        processedDonationMap.put(paymentId, saved);

        return saved;
    }

    private boolean verifyHmacSha256(String orderId, String paymentId, String signature, String secret) {
        try {
            String data = orderId + "|" + paymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString().equalsIgnoreCase(signature);
        } catch (Exception e) {
            return false;
        }
    }
}
