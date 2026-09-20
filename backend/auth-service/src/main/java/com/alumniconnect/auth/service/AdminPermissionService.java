package com.alumniconnect.auth.service;

import java.util.List;
import com.alumniconnect.auth.entity.AdminPermission;

public interface AdminPermissionService {
    List<AdminPermission> getAllPermissions();
    List<AdminPermission> updatePermissions(List<AdminPermission> permissions);
}
