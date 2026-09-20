package com.alumniconnect.fundraising.serviceimpl;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.Optional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import jakarta.annotation.PostConstruct;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.web.client.RestTemplate;

import com.alumniconnect.fundraising.dto.CreateOrderRequest;
import com.alumniconnect.fundraising.dto.CreateOrderResponse;
import com.alumniconnect.fundraising.dto.VerifyPaymentRequest;
import com.alumniconnect.fundraising.entity.Donation;
import com.alumniconnect.fundraising.entity.Fundraising;
import com.alumniconnect.fundraising.exception.ResourceNotFoundException;
import com.alumniconnect.fundraising.repository.DonationRepository;
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
    private DonationRepository donationRepository;

    @Autowired
    private DonationService donationService;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${auth-service.url:http://localhost:8101}")
    private String authServiceUrl;

    @Value("${razorpay.key.id:}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret:}")
    private String razorpayKeySecret;

    @PostConstruct
    public void initDiagnosticLog() {
        boolean isKeyConfigured = razorpayKeyId != null && !razorpayKeyId.trim().isEmpty();
        boolean isSecretConfigured = razorpayKeySecret != null && !razorpayKeySecret.trim().isEmpty();
        String prefix = (isKeyConfigured && razorpayKeyId.length() >= 8) ? razorpayKeyId.substring(0, 8) + "..." : (isKeyConfigured ? razorpayKeyId : "NOT_SET");

        System.out.println("=== RAZORPAY CONFIGURATION DIAGNOSTIC ===");
        System.out.println("Razorpay Key ID Configured: " + isKeyConfigured);
        System.out.println("Razorpay Key ID Prefix:     " + prefix);
        System.out.println("Razorpay Secret Configured: " + isSecretConfigured);
        System.out.println("=========================================");
    }

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

        if (razorpayKeyId == null || razorpayKeyId.trim().isEmpty() || razorpayKeySecret == null || razorpayKeySecret.trim().isEmpty()) {
            throw new IllegalArgumentException("Razorpay Order Creation Failed: RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables are missing or not configured in backend environment.");
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

        String keyPrefix = razorpayKeyId.length() >= 8 ? razorpayKeyId.substring(0, 8) : razorpayKeyId;
        System.out.println("Creating Razorpay Order via Razorpay API -> Fund ID: " + fundId + ", Amount: ₹" + request.getAmount() + " (" + amountInPaise + " paise), Key ID Prefix: " + keyPrefix);

        try {
            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "rcpt_fund_" + fundId + "_alumni_" + request.getAlumniId() + "_" + System.currentTimeMillis());

            Order order = razorpay.orders.create(orderRequest);
            razorpayOrderId = order.get("id");
            String orderStatus = order.get("status");
            System.out.println("Real Razorpay API Order Created Successfully: " + razorpayOrderId + " [Status: " + orderStatus + "]");
        } catch (Exception e) {
            System.err.println("Razorpay API Order Creation Error: " + e.getMessage());
            throw new IllegalArgumentException("Razorpay Order Creation Failed: " + e.getMessage() + ". Please ensure valid RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables are set.");
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

        // 1. Persistent Duplicate Payment Protection across service restarts
        Optional<Donation> existingDonation = donationRepository.findByTransactionId(paymentId);
        if (existingDonation.isPresent()) {
            System.out.println("Duplicate Payment Callback Detected for Payment ID " + paymentId + ". Returning existing donation.");
            return existingDonation.get();
        }

        // 2. Server-side HMAC-SHA256 Signature Verification
        boolean isSignatureValid = verifyHmacSha256(
            request.getRazorpayOrderId().trim(),
            paymentId,
            request.getRazorpaySignature().trim(),
            razorpayKeySecret
        );

        if (!isSignatureValid) {
            throw new IllegalArgumentException("Payment verification failed. Invalid Razorpay signature.");
        }

        // 3. Prepare donation entity and delegate to existing DonationServiceImpl
        Donation donation = new Donation();
        donation.setAmount(request.getAmount());
        donation.setAlumniId(request.getAlumniId());
        donation.setDonationDate(LocalDate.now());
        donation.setPaymentStatus("SUCCESS");
        donation.setTransactionId(paymentId);

        Fundraising f = new Fundraising();
        f.setFundId(request.getFundId());
        donation.setFundraising(f);

        Donation savedDonation = donationService.processDonation(donation);

        // 4. Create Alumni & Admin Notifications after successful verification & persistence
        try {
            sendDonationNotifications(savedDonation, request.getFundId());
        } catch (Exception e) {
            System.err.println("Failed to send donation notifications: " + e.getMessage());
        }

        return savedDonation;
    }

    private void sendDonationNotifications(Donation donation, Long fundId) {
        if (donation == null || donation.getAmount() == null) return;

        String campaignTitle = "Fundraising Campaign";
        if (fundId != null) {
            try {
                Fundraising f = fundraisingRepository.findById(fundId).orElse(null);
                if (f != null && f.getTitle() != null) {
                    campaignTitle = f.getTitle();
                }
            } catch (Exception ignored) {}
        }

        String formattedAmount = String.format("%,d", Math.round(donation.getAmount()));

        // 1. Alumni Notification
        if (donation.getAlumniId() != null) {
            try {
                java.util.Map<String, Object> alumniNotif = new java.util.HashMap<>();
                alumniNotif.put("userId", donation.getAlumniId().longValue());
                alumniNotif.put("userType", "ALUMNI");
                alumniNotif.put("title", "Donation Successful");
                alumniNotif.put("message", "Your contribution of ₹" + formattedAmount + " to \"" + campaignTitle + "\" was successful.");
                alumniNotif.put("notificationDate", java.time.LocalDateTime.now().toString());
                alumniNotif.put("status", "UNREAD");

                restTemplate.postForObject(authServiceUrl + "/notification/add", alumniNotif, Object.class);
                System.out.println("Donation notification sent to Alumni ID " + donation.getAlumniId());
            } catch (Exception e) {
                System.err.println("Failed to send Alumni donation notification: " + e.getMessage());
            }
        }

        // 2. Admin Notification
        try {
            java.util.List<Long> adminIds = new java.util.ArrayList<>();
            try {
                Object[] admins = restTemplate.getForObject(authServiceUrl + "/admin/getall", Object[].class);
                if (admins != null && admins.length > 0) {
                    for (Object obj : admins) {
                        if (obj instanceof java.util.Map) {
                            java.util.Map<?, ?> adminMap = (java.util.Map<?, ?>) obj;
                            Object adminIdObj = adminMap.get("adminId");
                            if (adminIdObj instanceof Number) {
                                adminIds.add(((Number) adminIdObj).longValue());
                            }
                        }
                    }
                }
            } catch (Exception e) {
                System.err.println("Failed to fetch admin list from auth-service, using default admin ID 5: " + e.getMessage());
            }

            if (adminIds.isEmpty()) {
                adminIds.add(5L); // Default Admin ID from database
            }

            for (Long adminId : adminIds) {
                try {
                    java.util.Map<String, Object> adminNotif = new java.util.HashMap<>();
                    adminNotif.put("userId", adminId);
                    adminNotif.put("userType", "ADMIN");
                    adminNotif.put("title", "New Fundraising Contribution");
                    adminNotif.put("message", "An alumni has contributed ₹" + formattedAmount + " to \"" + campaignTitle + "\".");
                    adminNotif.put("notificationDate", java.time.LocalDateTime.now().toString());
                    adminNotif.put("status", "UNREAD");

                    restTemplate.postForObject(authServiceUrl + "/notification/add", adminNotif, Object.class);
                    System.out.println("Donation notification sent to Admin ID " + adminId);
                } catch (Exception ex) {
                    System.err.println("Failed to send Admin donation notification to ID " + adminId + ": " + ex.getMessage());
                }
            }
        } catch (Exception e) {
            System.err.println("Error creating admin notifications: " + e.getMessage());
        }
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
