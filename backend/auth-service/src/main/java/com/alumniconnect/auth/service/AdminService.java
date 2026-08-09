package com.alumniconnect.auth.service;

import java.util.List;
import com.alumniconnect.auth.entity.Admin;

public interface AdminService {
    Admin addAdmin(Admin admin);
    Admin updateAdmin(Admin admin);
    void deleteAdmin(Integer adminId);
    Admin getAdminById(Integer adminId);
    List<Admin> getAllAdmins();
    Admin getAdminByEmail(String email);
    Admin login(String email, String password);
}
