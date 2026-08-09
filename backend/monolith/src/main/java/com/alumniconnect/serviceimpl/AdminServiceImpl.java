package com.alumniconnect.serviceimpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alumniconnect.entity.Admin;
import com.alumniconnect.exception.ResourceNotFoundException;
import com.alumniconnect.repository.AdminRepository;
import com.alumniconnect.service.AdminService;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public Admin addAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    @Override
    public Admin updateAdmin(Admin admin) {
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

        if(admin == null) {
            throw new RuntimeException("Invalid Email");
        }

        if(!admin.getPassword().equals(password)) {
            throw new RuntimeException("Invalid Password");
        }

        return admin;
    }

}