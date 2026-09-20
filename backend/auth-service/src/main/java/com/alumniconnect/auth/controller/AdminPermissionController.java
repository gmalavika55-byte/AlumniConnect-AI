package com.alumniconnect.auth.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.alumniconnect.auth.entity.AdminPermission;
import com.alumniconnect.auth.service.AdminPermissionService;

@RestController
@RequestMapping("/admin/permissions")
public class AdminPermissionController {

    @Autowired
    private AdminPermissionService permissionService;

    @GetMapping
    public List<AdminPermission> getAllPermissions() {
        return permissionService.getAllPermissions();
    }

    @PutMapping
    public List<AdminPermission> updatePermissions(@RequestBody List<AdminPermission> permissions) {
        return permissionService.updatePermissions(permissions);
    }
}
