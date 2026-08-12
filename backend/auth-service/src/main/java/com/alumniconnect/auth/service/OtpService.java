package com.alumniconnect.auth.service;

import com.alumniconnect.auth.entity.PasswordResetOtp;

public interface OtpService {
    String generateAndStoreOtp(String email, String userType, Integer userId);
    String verifyOtp(String email, String otp);
    PasswordResetOtp validateResetToken(String resetToken);
    void invalidateOtp(PasswordResetOtp record);
}
