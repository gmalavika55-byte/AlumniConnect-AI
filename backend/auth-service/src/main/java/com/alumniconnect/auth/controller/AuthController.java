package com.alumniconnect.auth.controller;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.alumniconnect.auth.entity.Admin;
import com.alumniconnect.auth.entity.Alumni;
import com.alumniconnect.auth.entity.LoginRequest;
import com.alumniconnect.auth.entity.Student;
import com.alumniconnect.auth.service.AdminService;
import com.alumniconnect.auth.service.AlumniService;
import com.alumniconnect.auth.service.StudentService;

import com.alumniconnect.auth.entity.ForgotPasswordRequest;
import com.alumniconnect.auth.entity.VerifyOtpRequest;
import com.alumniconnect.auth.entity.ResetPasswordRequest;
import com.alumniconnect.auth.repository.StudentRepository;
import com.alumniconnect.auth.repository.AlumniRepository;
import com.alumniconnect.auth.repository.AdminRepository;
import com.alumniconnect.auth.service.EmailService;
import com.alumniconnect.auth.service.OtpService;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private AlumniService alumniService;

    @Autowired
    private AdminService adminService;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AlumniRepository alumniRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private OtpService otpService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${jwt.secret}")
    private String jwtSecret;

    @PostMapping("/student/register")
    public Student registerStudent(@RequestBody Student student) {
        return studentService.addStudent(student);
    }

    @PostMapping("/alumni/register")
    public Alumni registerAlumni(@RequestBody Alumni alumni) {
        return alumniService.addAlumni(alumni);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        if (loginRequest == null || 
            loginRequest.getEmail() == null || loginRequest.getEmail().trim().isEmpty() ||
            loginRequest.getPassword() == null || loginRequest.getPassword().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email and password are required.");
        }
        try {
            Student student = studentService.getStudentByEmail(loginRequest.getEmail());
            if (student != null) {
                student = studentService.login(loginRequest.getEmail(), loginRequest.getPassword());
                String token = generateToken(student.getStudentId(), "STUDENT", student.getEmail());
                return ResponseEntity.ok(createAuthResponse(token, "STUDENT", student));
            }

            Alumni alumni = alumniService.getAlumniByEmail(loginRequest.getEmail());
            if (alumni != null) {
                alumni = alumniService.login(loginRequest.getEmail(), loginRequest.getPassword());
                String token = generateToken(alumni.getAlumniId(), "ALUMNI", alumni.getEmail());
                return ResponseEntity.ok(createAuthResponse(token, "ALUMNI", alumni));
            }

            Admin admin = adminService.getAdminByEmail(loginRequest.getEmail());
            if (admin != null) {
                admin = adminService.login(loginRequest.getEmail(), loginRequest.getPassword());
                String token = generateToken(admin.getAdminId(), "ADMIN", admin.getEmail());
                return ResponseEntity.ok(createAuthResponse(token, "ADMIN", admin));
            }

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("INVALID EMAIL OR PASSWORD");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        if (request == null || request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            Map<String, Object> errMap = new HashMap<>();
            errMap.put("success", false);
            errMap.put("message", "Please enter a valid registered email address.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errMap);
        }

        String email = request.getEmail().trim().toLowerCase();

        // Search user across Student, Alumni, and Admin
        String userType = null;
        Integer userId = null;

        Student student = studentService.getStudentByEmail(email);
        if (student != null) {
            userType = "STUDENT";
            userId = student.getStudentId();
        } else {
            Alumni alumni = alumniService.getAlumniByEmail(email);
            if (alumni != null) {
                userType = "ALUMNI";
                userId = alumni.getAlumniId();
            } else {
                Admin admin = adminService.getAdminByEmail(email);
                if (admin != null) {
                    userType = "ADMIN";
                    userId = admin.getAdminId();
                }
            }
        }

        // Security-safe non-enumerating response if email is not registered
        if (userType == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "If the email is registered, an OTP has been sent. Please check your inbox.");
            return ResponseEntity.ok(response);
        }

        try {
            // Generate secure random OTP and store hashed OTP in DB
            String rawOtp = otpService.generateAndStoreOtp(email, userType, userId);

            // Send OTP via SMTP (Brevo / JavaMailSender)
            emailService.sendOtpEmail(email, rawOtp);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "If the email is registered, an OTP has been sent. Please check your inbox.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Unable to send OTP. Please try again later.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest request) {
        if (request == null || request.getEmail() == null || request.getOtp() == null ||
            request.getEmail().trim().isEmpty() || request.getOtp().trim().isEmpty()) {
            Map<String, Object> errMap = new HashMap<>();
            errMap.put("success", false);
            errMap.put("message", "Email and OTP code are required.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errMap);
        }

        try {
            String resetToken = otpService.verifyOtp(request.getEmail().trim().toLowerCase(), request.getOtp().trim());
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("resetToken", resetToken);
            response.put("message", "OTP verified successfully.");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> errMap = new HashMap<>();
            errMap.put("success", false);
            errMap.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errMap);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        if (request == null || request.getNewPassword() == null || request.getNewPassword().trim().isEmpty()) {
            Map<String, Object> errMap = new HashMap<>();
            errMap.put("success", false);
            errMap.put("message", "New password is required.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errMap);
        }

        if (request.getNewPassword().length() < 6) {
            Map<String, Object> errMap = new HashMap<>();
            errMap.put("success", false);
            errMap.put("message", "Password must be at least 6 characters.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errMap);
        }

        try {
            com.alumniconnect.auth.entity.PasswordResetOtp otpRecord = null;

            // Secure token-based flow
            if (request.getResetToken() != null && !request.getResetToken().trim().isEmpty()) {
                otpRecord = otpService.validateResetToken(request.getResetToken().trim());
            } else if (request.getEmail() != null && request.getOtp() != null) {
                // Fallback verification using email & OTP
                String token = otpService.verifyOtp(request.getEmail().trim().toLowerCase(), request.getOtp().trim());
                otpRecord = otpService.validateResetToken(token);
            } else {
                Map<String, Object> errMap = new HashMap<>();
                errMap.put("success", false);
                errMap.put("message", "Reset token is required.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errMap);
            }

            String encodedPassword = passwordEncoder.encode(request.getNewPassword());
            String email = otpRecord.getEmail();

            Student student = studentService.getStudentByEmail(email);
            if (student != null) {
                student.setPassword(encodedPassword);
                studentRepository.save(student);
            } else {
                Alumni alumni = alumniService.getAlumniByEmail(email);
                if (alumni != null) {
                    alumni.setPassword(encodedPassword);
                    alumniRepository.save(alumni);
                } else {
                    Admin admin = adminService.getAdminByEmail(email);
                    if (admin != null) {
                        admin.setPassword(encodedPassword);
                        adminRepository.save(admin);
                    } else {
                        Map<String, Object> errMap = new HashMap<>();
                        errMap.put("success", false);
                        errMap.put("message", "User account not found.");
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errMap);
                    }
                }
            }

            // Invalidate token & mark OTP used in DB
            otpService.invalidateOtp(otpRecord);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Password reset successfully. You can now login with your new password.");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> errMap = new HashMap<>();
            errMap.put("success", false);
            errMap.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errMap);
        }
    }

    private String generateToken(Integer userId, String role, String email) {
        Key key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        // 24 hours validity
        long expirationTime = 86400000;
        return Jwts.builder()
                .setSubject(email)
                .claim("userId", userId)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    private Map<String, Object> createAuthResponse(String token, String role, Object user) {
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("role", role);
        response.put("user", user);
        return response;
    }
}
