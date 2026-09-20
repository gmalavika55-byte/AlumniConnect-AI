package com.alumniconnect.auth.serviceimpl;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alumniconnect.auth.entity.Notification;
import com.alumniconnect.auth.exception.ResourceNotFoundException;
import com.alumniconnect.auth.repository.NotificationRepository;
import com.alumniconnect.auth.service.NotificationService;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public Notification addNotification(Notification notification) {
        if (notification.getNotificationDate() == null) {
            notification.setNotificationDate(LocalDateTime.now());
        }
        if (notification.getStatus() == null || notification.getStatus().trim().isEmpty()) {
            notification.setStatus("UNREAD");
        }
        if (notification.getUserType() == null || notification.getUserType().trim().isEmpty()) {
            notification.setUserType("ADMIN");
        } else {
            notification.setUserType(notification.getUserType().trim().toUpperCase());
        }
        return notificationRepository.save(notification);
    }

    @Override
    public Notification updateNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    @Override
    public void deleteNotification(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        notificationRepository.delete(notification);
    }

    @Override
    public Notification getNotificationById(Long notificationId) {
        return notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
    }

    @Override
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAllByOrderByNotificationDateDesc();
    }

    @Override
    public List<Notification> getAdminNotifications() {
        List<Notification> list = notificationRepository.findByUserTypeOrderByNotificationDateDesc("ADMIN");
        if (list.isEmpty()) {
            return notificationRepository.findAllByOrderByNotificationDateDesc();
        }
        return list;
    }

    @Override
    public long getAdminUnreadCount() {
        return notificationRepository.countByUserTypeAndStatus("ADMIN", "UNREAD");
    }

    @Override
    public Notification markNotificationAsRead(Long notificationId) {
        Notification notification = getNotificationById(notificationId);
        notification.setStatus("READ");
        return notificationRepository.save(notification);
    }

    @Override
    public void markAllAdminNotificationsAsRead() {
        List<Notification> unreadList = notificationRepository.findByUserTypeAndStatus("ADMIN", "UNREAD");
        for (Notification n : unreadList) {
            n.setStatus("READ");
            notificationRepository.save(n);
        }
    }

    @Override
    public List<Notification> getUserNotifications(String userType, Long userId) {
        if (userType == null || userId == null) return List.of();
        String uType = userType.trim().toUpperCase();
        return notificationRepository.findByUserIdAndUserTypeOrderByNotificationDateDesc(userId, uType);
    }

    @Override
    public long getUserUnreadCount(String userType, Long userId) {
        if (userType == null || userId == null) return 0;
        String uType = userType.trim().toUpperCase();
        return notificationRepository.countByUserIdAndUserTypeAndStatus(userId, uType, "UNREAD");
    }

    @Override
    public void markAllUserNotificationsAsRead(String userType, Long userId) {
        if (userType == null || userId == null) return;
        String uType = userType.trim().toUpperCase();
        List<Notification> unreadList = notificationRepository.findByUserIdAndUserTypeAndStatus(userId, uType, "UNREAD");
        for (Notification n : unreadList) {
            n.setStatus("READ");
            notificationRepository.save(n);
        }
    }
}
