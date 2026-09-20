package com.alumniconnect.auth.serviceimpl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alumniconnect.auth.entity.AdminPermission;
import com.alumniconnect.auth.repository.AdminPermissionRepository;
import com.alumniconnect.auth.service.AdminPermissionService;

@Service
public class AdminPermissionServiceImpl implements AdminPermissionService {

    @Autowired
    private AdminPermissionRepository permissionRepository;

    public static final List<String> ALL_FEATURES = Arrays.asList(
        "VIEW_STUDENT_PROFILES",
        "VIEW_ALUMNI_DIRECTORY",
        "REQUEST_MENTORSHIP",
        "APPROVE_ALUMNI_VERIFICATION",
        "PUBLISH_GLOBAL_EVENTS",
        "EXPORT_ANALYTICS",
        "MANAGE_STUDENTS",
        "MANAGE_ALUMNI",
        "MANAGE_MENTORSHIP",
        "MANAGE_EVENTS",
        "MANAGE_FUNDRAISING",
        "VIEW_REPORTS",
        "MANAGE_SETTINGS"
    );

    public static final List<String> ALL_ROLES = Arrays.asList("ADMIN", "ALUMNI", "STUDENT");

    @Override
    @Transactional
    public List<AdminPermission> getAllPermissions() {
        List<AdminPermission> existing = permissionRepository.findAll();
        if (existing.isEmpty()) {
            initDefaultPermissions();
            existing = permissionRepository.findAll();
        } else {
            // Ensure any newly introduced feature or role is initialized if missing
            boolean updated = false;
            for (String role : ALL_ROLES) {
                for (String feature : ALL_FEATURES) {
                    Optional<AdminPermission> opt = permissionRepository.findByRoleAndFeature(role, feature);
                    if (!opt.isPresent()) {
                        boolean defaultEnabled = getDefaultValue(role, feature);
                        permissionRepository.save(new AdminPermission(role, feature, defaultEnabled));
                        updated = true;
                    }
                }
            }
            if (updated) {
                existing = permissionRepository.findAll();
            }
        }
        return existing;
    }

    @Override
    @Transactional
    public List<AdminPermission> updatePermissions(List<AdminPermission> permissions) {
        if (permissions == null || permissions.isEmpty()) {
            return getAllPermissions();
        }

        for (AdminPermission item : permissions) {
            String role = item.getRole() != null ? item.getRole().toUpperCase() : "";
            String feature = item.getFeature() != null ? item.getFeature().toUpperCase() : "";

            if (!ALL_ROLES.contains(role)) {
                throw new IllegalArgumentException("Invalid role: " + role);
            }
            if (!ALL_FEATURES.contains(feature)) {
                throw new IllegalArgumentException("Invalid feature: " + feature);
            }

            Boolean enabled = item.getEnabled() != null ? item.getEnabled() : false;

            // MANDATORY ADMIN PROTECTION: ADMIN role must ALWAYS have MANAGE_SETTINGS enabled
            if ("ADMIN".equals(role) && "MANAGE_SETTINGS".equals(feature)) {
                enabled = true;
            }

            Optional<AdminPermission> opt = permissionRepository.findByRoleAndFeature(role, feature);
            if (opt.isPresent()) {
                AdminPermission perm = opt.get();
                perm.setEnabled(enabled);
                permissionRepository.save(perm);
            } else {
                permissionRepository.save(new AdminPermission(role, feature, enabled));
            }
        }

        return getAllPermissions();
    }

    private void initDefaultPermissions() {
        List<AdminPermission> defaults = new ArrayList<>();
        for (String role : ALL_ROLES) {
            for (String feature : ALL_FEATURES) {
                boolean enabled = getDefaultValue(role, feature);
                defaults.add(new AdminPermission(role, feature, enabled));
            }
        }
        permissionRepository.saveAll(defaults);
    }

    private boolean getDefaultValue(String role, String feature) {
        if ("ADMIN".equals(role)) {
            return true;
        } else if ("ALUMNI".equals(role)) {
            return "VIEW_STUDENT_PROFILES".equals(feature) ||
                   "VIEW_ALUMNI_DIRECTORY".equals(feature) ||
                   "PUBLISH_GLOBAL_EVENTS".equals(feature);
        } else if ("STUDENT".equals(role)) {
            return "VIEW_STUDENT_PROFILES".equals(feature) ||
                   "VIEW_ALUMNI_DIRECTORY".equals(feature) ||
                   "REQUEST_MENTORSHIP".equals(feature);
        }
        return false;
    }
}
