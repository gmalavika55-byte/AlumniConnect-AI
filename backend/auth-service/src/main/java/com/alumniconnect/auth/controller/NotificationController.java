package com.alumniconnect.auth.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.alumniconnect.auth.entity.Notification;
import com.alumniconnect.auth.service.NotificationService;

@RestController
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/notification/add")
    public Notification addNotification(@RequestBody Notification notification) {
        return notificationService.addNotification(notification);
    }

    @PutMapping("/notification/update")
    public Notification updateNotification(@RequestBody Notification notification) {
        return notificationService.updateNotification(notification);
    }

    @DeleteMapping("/notification/delete/{id}")
    public String deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return "Notification deleted successfully";
    }

    @GetMapping("/notification/get/{id}")
    public Notification getNotificationById(@PathVariable Long id) {
        return notificationService.getNotificationById(id);
    }

    @GetMapping("/notification/getall")
    public List<Notification> getAllNotifications() {
        return notificationService.getAllNotifications();
    }

    // Role & User Scoped Notification Endpoints
    @GetMapping("/notification/user/{userType}/{userId}")
    public List<Notification> getUserNotifications(
            @PathVariable String userType,
            @PathVariable Long userId) {
        return notificationService.getUserNotifications(userType, userId);
    }

    @GetMapping("/notification/user/{userType}/{userId}/unread-count")
    public ResponseEntity<Map<String, Object>> getUserUnreadCount(
            @PathVariable String userType,
            @PathVariable Long userId) {
        long count = notificationService.getUserUnreadCount(userType, userId);
        Map<String, Object> response = new HashMap<>();
        response.put("unreadCount", count);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/notification/{id}/read")
    public Notification markSingleAsRead(@PathVariable Long id) {
        return notificationService.markNotificationAsRead(id);
    }

    @PutMapping("/notification/user/{userType}/{userId}/read-all")
    public ResponseEntity<Map<String, String>> markUserAllAsRead(
            @PathVariable String userType,
            @PathVariable Long userId) {
        notificationService.markAllUserNotificationsAsRead(userType, userId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "All notifications marked as read");
        return ResponseEntity.ok(response);
    }

    // Admin Notification Endpoints
    @GetMapping("/admin/notifications")
    public List<Notification> getAdminNotifications() {
        return notificationService.getAdminNotifications();
    }

    @GetMapping("/admin/notifications/unread-count")
    public ResponseEntity<Map<String, Object>> getAdminUnreadCount() {
        long count = notificationService.getAdminUnreadCount();
        Map<String, Object> response = new HashMap<>();
        response.put("unreadCount", count);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/admin/notifications/{id}/read")
    public Notification markAsRead(@PathVariable Long id) {
        return notificationService.markNotificationAsRead(id);
    }

    @PutMapping("/admin/notifications/read-all")
    public ResponseEntity<Map<String, String>> markAllAsRead() {
        notificationService.markAllAdminNotificationsAsRead();
        Map<String, String> response = new HashMap<>();
        response.put("message", "All admin notifications marked as read");
        return ResponseEntity.ok(response);
    }
}
