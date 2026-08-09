package com.alumniconnect.auth.serviceimpl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.alumniconnect.auth.entity.Student;
import com.alumniconnect.auth.exception.ResourceNotFoundException;
import com.alumniconnect.auth.repository.StudentRepository;
import com.alumniconnect.auth.service.StudentService;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Student addStudent(Student student) {
        // Hash password before saving
        student.setPassword(passwordEncoder.encode(student.getPassword()));
        return studentRepository.save(student);
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

    @Override
    public void deleteStudent(Integer studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
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
        return studentRepository.findByEmail(email);
    }

    @Override
    public Student login(String email, String password) {
        Student student = studentRepository.findByEmail(email);
        if (student == null) {
            throw new RuntimeException("Invalid Email");
        }
        if (!passwordEncoder.matches(password, student.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }
        return student;
    }
}
