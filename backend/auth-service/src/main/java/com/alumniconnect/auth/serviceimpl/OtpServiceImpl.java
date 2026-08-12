package com.alumniconnect.auth.serviceimpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.alumniconnect.auth.entity.PasswordResetOtp;
import com.alumniconnect.auth.repository.PasswordResetOtpRepository;
import com.alumniconnect.auth.service.OtpService;

import java.security.SecureRandom;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class OtpServiceImpl implements OtpService {

    private static final long OTP_EXPIRATION_MS = 5 * 60 * 1000; // 5 minutes
    private static final long RESET_TOKEN_EXPIRATION_MS = 10 * 60 * 1000; // 10 minutes
    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final SecureRandom secureRandom = new SecureRandom();

    @Autowired
    private PasswordResetOtpRepository otpRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public String generateAndStoreOtp(String email, String userType, Integer userId) {
        String normalizedEmail = email != null ? email.trim().toLowerCase() : "";

        // Invalidate previous active OTPs for this email
        List<PasswordResetOtp> previousOtps = otpRepository.findByEmail(normalizedEmail);
        for (PasswordResetOtp old : previousOtps) {
            if (!old.isUsed()) {
                old.setUsed(true);
                otpRepository.save(old);
            }
        }

        // Generate 6-digit secure random OTP
        int randomCode = 100000 + secureRandom.nextInt(900000);
        String rawOtp = String.valueOf(randomCode);

        // Hash the OTP using BCrypt so raw OTP is never stored in DB
        String hashedOtp = passwordEncoder.encode(rawOtp);

        PasswordResetOtp record = new PasswordResetOtp();
        record.setEmail(normalizedEmail);
        record.setUserType(userType);
        record.setUserId(userId);
        record.setOtpHash(hashedOtp);
        record.setExpiresAt(new Date(System.currentTimeMillis() + OTP_EXPIRATION_MS));
        record.setVerified(false);
        record.setUsed(false);
        record.setAttempts(0);
        record.setCreatedAt(new Date());

        otpRepository.save(record);

        // Return raw OTP in memory ONLY for email transmission
        return rawOtp;
    }

    @Override
    public String verifyOtp(String email, String otp) {
        String normalizedEmail = email != null ? email.trim().toLowerCase() : "";
        PasswordResetOtp record = otpRepository.findTopByEmailAndUsedFalseOrderByCreatedAtDesc(normalizedEmail)
                .orElseThrow(() -> new IllegalArgumentException("No OTP requested for this email. Please request a new OTP."));

        if (new Date().after(record.getExpiresAt())) {
            record.setUsed(true);
            otpRepository.save(record);
            throw new IllegalArgumentException("OTP expired. Please request a new OTP.");
        }

        if (record.getAttempts() >= MAX_FAILED_ATTEMPTS) {
            record.setUsed(true);
            otpRepository.save(record);
            throw new IllegalArgumentException("Too many attempts. Please request a new OTP.");
        }

        if (!passwordEncoder.matches(otp, record.getOtpHash())) {
            record.setAttempts(record.getAttempts() + 1);
            if (record.getAttempts() >= MAX_FAILED_ATTEMPTS) {
                record.setUsed(true);
            }
            otpRepository.save(record);
            throw new IllegalArgumentException("Invalid OTP. " + (MAX_FAILED_ATTEMPTS - record.getAttempts()) + " attempts remaining.");
        }

        // Issue short-lived reset token upon successful OTP verification
        String resetToken = UUID.randomUUID().toString();
        record.setVerified(true);
        record.setResetToken(resetToken);
        record.setResetTokenExpiresAt(new Date(System.currentTimeMillis() + RESET_TOKEN_EXPIRATION_MS));
        otpRepository.save(record);

        return resetToken;
    }

    @Override
    public PasswordResetOtp validateResetToken(String resetToken) {
        if (resetToken == null || resetToken.trim().isEmpty()) {
            throw new IllegalArgumentException("Reset token is required.");
        }

        PasswordResetOtp record = otpRepository.findByResetTokenAndUsedFalse(resetToken)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired reset token. Please verify your OTP again."));

        if (!record.isVerified()) {
            throw new IllegalArgumentException("OTP has not been verified for this token.");
        }

        if (record.getResetTokenExpiresAt() == null || new Date().after(record.getResetTokenExpiresAt())) {
            record.setUsed(true);
            otpRepository.save(record);
            throw new IllegalArgumentException("Reset token has expired. Please verify your OTP again.");
        }

        return record;
    }

    @Override
    public void invalidateOtp(PasswordResetOtp record) {
        if (record != null) {
            record.setUsed(true);
            otpRepository.save(record);
        }
    }
}
