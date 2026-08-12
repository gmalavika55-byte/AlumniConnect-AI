package com.alumniconnect.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.alumniconnect.auth.entity.PasswordResetOtp;

import java.util.Optional;
import java.util.List;

@Repository
public interface PasswordResetOtpRepository extends JpaRepository<PasswordResetOtp, Long> {
    Optional<PasswordResetOtp> findTopByEmailAndUsedFalseOrderByCreatedAtDesc(String email);
    Optional<PasswordResetOtp> findByResetTokenAndUsedFalse(String resetToken);
    List<PasswordResetOtp> findByEmail(String email);
}
