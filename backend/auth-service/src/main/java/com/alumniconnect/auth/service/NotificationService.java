package com.alumniconnect.auth.service;

import java.util.List;
import com.alumniconnect.auth.entity.Notification;

public interface NotificationService {
    Notification addNotification(Notification notification);
    Notification updateNotification(Notification notification);
    void deleteNotification(Long notificationId);
    Notification getNotificationById(Long notificationId);
    List<Notification> getAllNotifications();
    List<Notification> getAdminNotifications();
    long getAdminUnreadCount();
    Notification markNotificationAsRead(Long notificationId);
    void markAllAdminNotificationsAsRead();

    List<Notification> getUserNotifications(String userType, Long userId);
    long getUserUnreadCount(String userType, Long userId);
    void markAllUserNotificationsAsRead(String userType, Long userId);
}
