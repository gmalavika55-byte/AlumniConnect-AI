package com.alumniconnect.auth.serviceimpl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import com.alumniconnect.auth.service.EmailService;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.from:${spring.mail.username:}}")
private String fromEmail;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    @Override
    public void sendOtpEmail(String toEmail, String otp) {
        logger.info("[SMTP EMAIL SERVICE] Initiating password reset OTP email dispatch to recipient...");

        if (mailSender == null || mailPassword == null || mailPassword.trim().isEmpty()) {
            logger.warn("[SMTP EMAIL SERVICE] SMTP Password (BREVO_SMTP_PASSWORD / MAIL_PASSWORD) is missing.");
            throw new IllegalStateException("Brevo SMTP credentials are missing. Please configure BREVO_SMTP_USERNAME and BREVO_SMTP_PASSWORD environment variables.");
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            if (fromEmail != null && !fromEmail.trim().isEmpty()) {
                message.setFrom(fromEmail.trim());
            }
            message.setTo(toEmail);
            message.setSubject("AlumniConnect - Password Reset OTP");
            
            String body = "Hello,\n\n" +
                    "We received a request to reset your AlumniConnect password.\n\n" +
                    "Your 6-digit OTP is:\n\n" +
                    otp + "\n\n" +
                    "This OTP will expire in 5 minutes.\n\n" +
                    "If you did not request a password reset, please ignore this email.\n\n" +
                    "Regards,\n" +
                    "AlumniConnect Team";

            message.setText(body);

            mailSender.send(message);
            logger.info("[SMTP EMAIL SERVICE] Password reset OTP email successfully delivered via Brevo SMTP.");
        } catch (Exception e) {
            logger.error("[SMTP EMAIL SERVICE] Password reset email failed to deliver via SMTP. Error: {}", e.getMessage());
            throw new RuntimeException("Unable to send OTP email via SMTP. Error: " + e.getMessage(), e);
        }
    }
}
