package com.alumniconnect.auth.serviceimpl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alumniconnect.auth.entity.Admin;
import com.alumniconnect.auth.exception.ResourceNotFoundException;
import com.alumniconnect.auth.repository.AdminRepository;
import com.alumniconnect.auth.service.AdminService;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Admin addAdmin(Admin admin) {
        if (admin.getPassword() != null && !admin.getPassword().trim().isEmpty()) {
            admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        }
        return adminRepository.save(admin);
    }

    @Override
    public Admin updateAdmin(Admin admin) {
        Admin existing = adminRepository.findById(admin.getAdminId())
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with ID: " + admin.getAdminId()));
        
        existing.setName(admin.getName());
        existing.setEmail(admin.getEmail());
        existing.setMobile(admin.getMobile());
        existing.setDesignation(admin.getDesignation());
        existing.setDepartment(admin.getDepartment());
        if (admin.getProfilePhoto() != null) {
            existing.setProfilePhoto(admin.getProfilePhoto());
        }

        if (admin.getPassword() != null && !admin.getPassword().trim().isEmpty() && !admin.getPassword().equals(existing.getPassword())) {
            existing.setPassword(passwordEncoder.encode(admin.getPassword()));
        }
        
        Admin saved = adminRepository.save(existing);
        return new Admin(
            saved.getAdminId(), saved.getEmployeeId(), saved.getName(),
            saved.getEmail(), saved.getMobile(), saved.getDesignation(),
            saved.getDepartment(), saved.getRole(), null, saved.getProfilePhoto()
        );
    }

    @Override
    public void deleteAdmin(Integer adminId) {
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with ID: " + adminId));
        adminRepository.delete(admin);
    }

    @Override
    public Admin getAdminById(Integer adminId) {
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with ID: " + adminId));
        return new Admin(
            admin.getAdminId(), admin.getEmployeeId(), admin.getName(),
            admin.getEmail(), admin.getMobile(), admin.getDesignation(),
            admin.getDepartment(), admin.getRole(), null, admin.getProfilePhoto()
        );
    }

    @Override
    public List<Admin> getAllAdmins() {
        List<Admin> list = adminRepository.findAll();
        return list.stream().map(a -> new Admin(
            a.getAdminId(), a.getEmployeeId(), a.getName(),
            a.getEmail(), a.getMobile(), a.getDesignation(),
            a.getDepartment(), a.getRole(), null, a.getProfilePhoto()
        )).toList();
    }

    @Override
    public Admin getAdminByEmail(String email) {
        if (email == null) return null;
        String trimmed = email.trim();
        Admin admin = adminRepository.findByEmailIgnoreCase(trimmed);
        if (admin == null) {
            admin = adminRepository.findByEmployeeIdIgnoreCase(trimmed);
        }
        return admin;
    }

    @Override
    public Admin login(String email, String password) {
        if (email == null || email.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("Invalid email or password.");
        }
        String trimmed = email.trim();
        Admin admin = adminRepository.findByEmailIgnoreCase(trimmed);
        if (admin == null) {
            admin = adminRepository.findByEmployeeIdIgnoreCase(trimmed);
        }
        if (admin == null || admin.getPassword() == null || admin.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Invalid email or password.");
        }
        if (!passwordEncoder.matches(password, admin.getPassword()) && !password.equals(admin.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password.");
        }
        return new Admin(
            admin.getAdminId(), admin.getEmployeeId(), admin.getName(),
            admin.getEmail(), admin.getMobile(), admin.getDesignation(),
            admin.getDepartment(), admin.getRole(), null, admin.getProfilePhoto()
        );
    }

    @Override
    @Transactional
    public void changePassword(Integer adminId, String currentPassword, String newPassword) {
        if (adminId == null) {
            throw new IllegalArgumentException("Admin ID must be provided.");
        }
        if (currentPassword == null || currentPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("Current password is required.");
        }
        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("New password is required.");
        }
        if (newPassword.length() < 6) {
            throw new IllegalArgumentException("New password must be at least 6 characters long.");
        }
        if (currentPassword.equals(newPassword)) {
            throw new IllegalArgumentException("New password cannot be identical to current password.");
        }

        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with ID: " + adminId));

        if (admin.getPassword() == null || !passwordEncoder.matches(currentPassword, admin.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect.");
        }

        admin.setPassword(passwordEncoder.encode(newPassword));
        adminRepository.save(admin);
    }
}
