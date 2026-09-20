package com.alumniconnect.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.alumniconnect.auth.entity.Notification;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserId(Long userId);
    List<Notification> findByUserType(String userType);
    List<Notification> findByStatus(String status);
    List<Notification> findByUserTypeOrderByNotificationDateDesc(String userType);
    List<Notification> findAllByOrderByNotificationDateDesc();
    long countByUserTypeAndStatus(String userType, String status);
    List<Notification> findByUserTypeAndStatus(String userType, String status);

    List<Notification> findByUserIdAndUserTypeOrderByNotificationDateDesc(Long userId, String userType);
    long countByUserIdAndUserTypeAndStatus(Long userId, String userType, String status);
    List<Notification> findByUserIdAndUserTypeAndStatus(Long userId, String userType, String status);
}
