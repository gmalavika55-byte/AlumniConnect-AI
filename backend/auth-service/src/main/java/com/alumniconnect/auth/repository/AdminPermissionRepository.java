package com.alumniconnect.auth.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.alumniconnect.auth.entity.AdminPermission;

@Repository
public interface AdminPermissionRepository extends JpaRepository<AdminPermission, Long> {
    List<AdminPermission> findByRole(String role);
    Optional<AdminPermission> findByRoleAndFeature(String role, String feature);
}
