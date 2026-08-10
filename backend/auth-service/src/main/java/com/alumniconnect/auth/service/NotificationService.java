package com.alumniconnect.auth.service;

import java.util.List;
import com.alumniconnect.auth.entity.Notification;

public interface NotificationService {
    Notification addNotification(Notification notification);
    Notification updateNotification(Notification notification);
    void deleteNotification(Long notificationId);
    Notification getNotificationById(Long notificationId);
    List<Notification> getAllNotifications();
}
