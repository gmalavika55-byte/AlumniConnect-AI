package com.alumniconnect.auth.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.alumniconnect.auth.entity.Admin;
import com.alumniconnect.auth.entity.LoginRequest;
import com.alumniconnect.auth.service.AdminService;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/add")
    public Admin addAdmin(@RequestBody Admin admin) {
        return adminService.addAdmin(admin);
    }

    @PutMapping("/update")
    public Admin updateAdmin(@RequestBody Admin admin) {
        return adminService.updateAdmin(admin);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteAdmin(@PathVariable Integer id) {
        adminService.deleteAdmin(id);
        return "Admin deleted successfully";
    }

    @GetMapping("/get/{id}")
    public Admin getAdminById(@PathVariable Integer id) {
        return adminService.getAdminById(id);
    }

    @GetMapping("/getall")
    public List<Admin> getAllAdmins() {
        return adminService.getAllAdmins();
    }

    @PostMapping("/login")
    public Admin login(@RequestBody LoginRequest loginRequest) {
        return adminService.login(
                loginRequest.getEmail(),
                loginRequest.getPassword());
    }
}
