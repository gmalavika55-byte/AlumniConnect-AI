package com.alumniconnect.auth.serviceimpl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.alumniconnect.auth.entity.Student;
import com.alumniconnect.auth.exception.ResourceNotFoundException;
import com.alumniconnect.auth.repository.StudentRepository;
import com.alumniconnect.auth.service.StudentService;

import com.alumniconnect.auth.repository.AlumniRepository;
import com.alumniconnect.auth.repository.AdminRepository;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AlumniRepository alumniRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private com.alumniconnect.auth.repository.NotificationRepository notificationRepository;

    @Override
    public Student addStudent(Student student) {
        if (studentRepository.findByEmail(student.getEmail()) != null ||
            alumniRepository.findByEmail(student.getEmail()) != null ||
            adminRepository.findByEmail(student.getEmail()) != null) {
            throw new IllegalArgumentException("An account already exists with this email.");
        }

        if (studentRepository.findByRegisterNo(student.getRegisterNo()) != null) {
            throw new IllegalArgumentException("Register number already exists.");
        }

        // Hash password before saving
        student.setPassword(passwordEncoder.encode(student.getPassword()));
        Student saved = studentRepository.save(student);

        try {
            com.alumniconnect.auth.entity.Notification notif = new com.alumniconnect.auth.entity.Notification();
            notif.setUserType("ADMIN");
            notif.setUserId(saved.getStudentId().longValue());
            notif.setTitle("New Student Registration");
            notif.setMessage("A new student (" + (saved.getName() != null ? saved.getName() : "Student #" + saved.getStudentId()) + ") has registered on AlumniConnect.");
            notif.setNotificationDate(java.time.LocalDateTime.now());
            notif.setStatus("UNREAD");
            notificationRepository.save(notif);
        } catch (Exception e) {
            System.err.println("Failed to trigger student registration notification: " + e.getMessage());
        }

        return saved;
    }

    @Override
    public Student updateStudent(Student student) {
        // Retrieve existing and preserve hashed password if not modified
        Student existing = studentRepository.findById(student.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        
        if (student.getPassword() != null && !student.getPassword().isEmpty() && !student.getPassword().equals(existing.getPassword())) {
            student.setPassword(passwordEncoder.encode(student.getPassword()));
        } else {
            student.setPassword(existing.getPassword());
        }
        return studentRepository.save(student);
    }

    @jakarta.persistence.PersistenceContext
    private jakarta.persistence.EntityManager entityManager;

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void deleteStudent(Integer studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        // 1. Delete dependent event registrations for this student
        try {
            entityManager.createNativeQuery("DELETE FROM EVENT_REGISTRATION WHERE STUDENT_ID = :studentId")
                    .setParameter("studentId", studentId)
                    .executeUpdate();
        } catch (Exception e) {
            // Ignore if table does not exist
        }

        // 2. Delete dependent mentorship requests for this student
        try {
            entityManager.createNativeQuery("DELETE FROM MENTORSHIP_REQUEST WHERE STUDENT_ID = :studentId")
                    .setParameter("studentId", studentId)
                    .executeUpdate();
        } catch (Exception e) {
            // Ignore if table does not exist
        }

        // 3. Delete dependent certificates for this student
        try {
            entityManager.createNativeQuery("DELETE FROM CERTIFICATE WHERE STUDENT_ID = :studentId")
                    .setParameter("studentId", studentId)
                    .executeUpdate();
        } catch (Exception e) {
            // Ignore if table does not exist
        }

        // 4. Delete dependent career recommendations for this student
        try {
            entityManager.createNativeQuery("DELETE FROM CAREER_RECOMMENDATION WHERE STUDENT_ID = :studentId")
                    .setParameter("studentId", studentId)
                    .executeUpdate();
        } catch (Exception e) {
            // Ignore if table does not exist
        }

        // 5. Delete dependent notifications for this student
        try {
            entityManager.createNativeQuery("DELETE FROM NOTIFICATION WHERE USER_ID = :studentId AND UPPER(USER_TYPE) = 'STUDENT'")
                    .setParameter("studentId", studentId)
                    .executeUpdate();
        } catch (Exception e) {
            // Ignore if table does not exist
        }

        // 6. Delete dependent OTP records for this student
        try {
            entityManager.createNativeQuery("DELETE FROM PASSWORD_RESET_OTP WHERE USER_ID = :studentId AND UPPER(USER_TYPE) = 'STUDENT'")
                    .setParameter("studentId", studentId)
                    .executeUpdate();
        } catch (Exception e) {
            // Ignore if table does not exist
        }

        // 7. Delete student entity
        studentRepository.delete(student);
    }

    @Override
    public Student getStudentById(Integer studentId) {
        return studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
    }

    @Override
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Override
    public Student getStudentByEmail(String email) {
        if (email == null) return null;
        String trimmed = email.trim();
        Student student = studentRepository.findByEmailIgnoreCase(trimmed);
        if (student == null) {
            student = studentRepository.findByRegisterNoIgnoreCase(trimmed);
        }
        return student;
    }

    @Override
    public Student login(String email, String password) {
        if (email == null || email.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            throw new RuntimeException("Invalid Email or Register Number");
        }
        String trimmed = email.trim();
        Student student = studentRepository.findByEmailIgnoreCase(trimmed);
        if (student == null) {
            student = studentRepository.findByRegisterNoIgnoreCase(trimmed);
        }
        if (student == null) {
            throw new RuntimeException("Invalid Email or Register Number");
        }
        if (!passwordEncoder.matches(password, student.getPassword()) && !password.equals(student.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }
        return student;
    }
}
