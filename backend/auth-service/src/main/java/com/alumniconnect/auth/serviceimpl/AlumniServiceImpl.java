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
        return alumniRepository.save(alumni);
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

    @Override
    public void deleteAlumni(Integer alumniId) {
        Alumni alumni = alumniRepository.findById(alumniId)
                .orElseThrow(() -> new ResourceNotFoundException("Alumni not found"));
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
