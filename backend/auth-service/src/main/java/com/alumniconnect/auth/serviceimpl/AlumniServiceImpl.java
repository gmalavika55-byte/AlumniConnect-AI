package com.alumniconnect.auth.serviceimpl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.alumniconnect.auth.entity.Alumni;
import com.alumniconnect.auth.exception.ResourceNotFoundException;
import com.alumniconnect.auth.repository.AlumniRepository;
import com.alumniconnect.auth.service.AlumniService;

import com.alumniconnect.auth.repository.StudentRepository;
import com.alumniconnect.auth.repository.AdminRepository;

@Service
public class AlumniServiceImpl implements AlumniService {

    @Autowired
    private AlumniRepository alumniRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private com.alumniconnect.auth.repository.NotificationRepository notificationRepository;

    @Override
    public Alumni addAlumni(Alumni alumni) {
        if (studentRepository.findByEmail(alumni.getEmail()) != null ||
            alumniRepository.findByEmail(alumni.getEmail()) != null ||
            adminRepository.findByEmail(alumni.getEmail()) != null) {
            throw new IllegalArgumentException("An account already exists with this email.");
        }

        if (alumniRepository.findByRegisterNo(alumni.getRegisterNo()) != null) {
            throw new IllegalArgumentException("Register number already exists.");
        }

        alumni.setPassword(passwordEncoder.encode(alumni.getPassword()));
        Alumni saved = alumniRepository.save(alumni);

        try {
            com.alumniconnect.auth.entity.Notification notif = new com.alumniconnect.auth.entity.Notification();
            notif.setUserType("ADMIN");
            notif.setUserId(saved.getAlumniId() != null ? saved.getAlumniId().longValue() : 0L);
            notif.setTitle("New Alumni Registration");
            String alumniName = (saved.getName() != null && !saved.getName().trim().isEmpty()) ? saved.getName().trim() : ("Alumni #" + saved.getAlumniId());
            notif.setMessage("A new alumni, " + alumniName + ", has registered on AlumniConnect.");
            notif.setNotificationDate(java.time.LocalDateTime.now());
            notif.setStatus("UNREAD");
            notificationRepository.save(notif);
        } catch (Exception e) {
            System.err.println("Failed to trigger alumni registration notification: " + e.getMessage());
        }

        return saved;
    }

    @Override
    public Alumni updateAlumni(Alumni alumni) {
        Alumni existing = alumniRepository.findById(alumni.getAlumniId())
                .orElseThrow(() -> new ResourceNotFoundException("Alumni not found"));
        
        if (alumni.getPassword() != null && !alumni.getPassword().isEmpty() && !alumni.getPassword().equals(existing.getPassword())) {
            alumni.setPassword(passwordEncoder.encode(alumni.getPassword()));
        } else {
            alumni.setPassword(existing.getPassword());
        }
        return alumniRepository.save(alumni);
    }

    @jakarta.persistence.PersistenceContext
    private jakarta.persistence.EntityManager entityManager;

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void deleteAlumni(Integer alumniId) {
        Alumni alumni = alumniRepository.findById(alumniId)
                .orElseThrow(() -> new ResourceNotFoundException("Alumni not found"));

        // 1. Delete dependent event registrations for this alumni
        try {
            entityManager.createNativeQuery("DELETE FROM EVENT_REGISTRATION WHERE ALUMNI_ID = :alumniId")
                    .setParameter("alumniId", alumniId)
                    .executeUpdate();
        } catch (Exception e) {
            // Ignore if table does not exist
        }

        // 2. Delete dependent mentorship requests for this alumni
        try {
            entityManager.createNativeQuery("DELETE FROM MENTORSHIP_REQUEST WHERE ALUMNI_ID = :alumniId")
                    .setParameter("alumniId", alumniId)
                    .executeUpdate();
        } catch (Exception e) {
            // Ignore if table does not exist
        }

        // 3. Delete dependent donations for this alumni
        try {
            entityManager.createNativeQuery("DELETE FROM DONATION WHERE ALUMNI_ID = :alumniId")
                    .setParameter("alumniId", alumniId)
                    .executeUpdate();
        } catch (Exception e) {
            // Ignore if table does not exist
        }

        // 4. Delete dependent notifications for this alumni
        try {
            entityManager.createNativeQuery("DELETE FROM NOTIFICATION WHERE USER_ID = :alumniId AND UPPER(USER_TYPE) = 'ALUMNI'")
                    .setParameter("alumniId", alumniId)
                    .executeUpdate();
        } catch (Exception e) {
            // Ignore if table does not exist
        }

        // 5. Delete dependent OTP records for this alumni
        try {
            entityManager.createNativeQuery("DELETE FROM PASSWORD_RESET_OTP WHERE USER_ID = :alumniId AND UPPER(USER_TYPE) = 'ALUMNI'")
                    .setParameter("alumniId", alumniId)
                    .executeUpdate();
        } catch (Exception e) {
            // Ignore if table does not exist
        }

        // 6. Delete alumni entity
        alumniRepository.delete(alumni);
    }

    @Override
    public Alumni getAlumniById(Integer alumniId) {
        return alumniRepository.findById(alumniId)
                .orElseThrow(() -> new ResourceNotFoundException("Alumni not found"));
    }

    @Override
    public List<Alumni> getAllAlumni() {
        return alumniRepository.findAll();
    }

    @Override
    public Alumni getAlumniByEmail(String email) {
        return alumniRepository.findByEmail(email);
    }

    @Override
    public Alumni login(String email, String password) {
        Alumni alumni = alumniRepository.findByEmail(email);
        if (alumni == null) {
            throw new RuntimeException("Invalid Email");
        }
        if (!passwordEncoder.matches(password, alumni.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }
        return alumni;
    }
}
