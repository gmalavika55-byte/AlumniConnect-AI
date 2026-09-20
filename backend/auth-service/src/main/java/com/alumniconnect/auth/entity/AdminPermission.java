package com.alumniconnect.auth.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ADMIN_PERMISSION", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"ROLE", "FEATURE"})
})
public class AdminPermission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PERMISSION_ID")
    private Long permissionId;

    @Column(name = "ROLE", nullable = false)
    private String role;

    @Column(name = "FEATURE", nullable = false)
    private String feature;

    @Column(name = "ENABLED", nullable = false)
    private Boolean enabled = false;

    public AdminPermission() {
    }

    public AdminPermission(String role, String feature, Boolean enabled) {
        this.role = role;
        this.feature = feature;
        this.enabled = enabled;
    }

    public AdminPermission(Long permissionId, String role, String feature, Boolean enabled) {
        this.permissionId = permissionId;
        this.role = role;
        this.feature = feature;
        this.enabled = enabled;
    }

    public Long getPermissionId() {
        return permissionId;
    }

    public void setPermissionId(Long permissionId) {
        this.permissionId = permissionId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getFeature() {
        return feature;
    }

    public void setFeature(String feature) {
        this.feature = feature;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }
}
