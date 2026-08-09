package com.alumniconnect.auth.serviceimpl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        return adminRepository.save(admin);
    }

    @Override
    public Admin updateAdmin(Admin admin) {
        Admin existing = adminRepository.findById(admin.getAdminId())
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));
        
        if (admin.getPassword() != null && !admin.getPassword().isEmpty() && !admin.getPassword().equals(existing.getPassword())) {
            admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        } else {
            admin.setPassword(existing.getPassword());
        }
        return adminRepository.save(admin);
    }

    @Override
    public void deleteAdmin(Integer adminId) {
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));
        adminRepository.delete(admin);
    }

    @Override
    public Admin getAdminById(Integer adminId) {
        return adminRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));
    }

    @Override
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    @Override
    public Admin getAdminByEmail(String email) {
        return adminRepository.findByEmail(email);
    }

    @Override
    public Admin login(String email, String password) {
        Admin admin = adminRepository.findByEmail(email);
        if (admin == null) {
            throw new RuntimeException("Invalid Email");
        }
        if (!passwordEncoder.matches(password, admin.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }
        return admin;
    }
}
