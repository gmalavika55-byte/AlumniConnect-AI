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
