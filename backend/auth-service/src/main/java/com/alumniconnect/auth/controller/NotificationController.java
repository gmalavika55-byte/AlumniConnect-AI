package com.alumniconnect.auth.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.alumniconnect.auth.entity.Notification;
import com.alumniconnect.auth.service.NotificationService;

@RestController
@RequestMapping("/notification")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/add")
    public Notification addNotification(@RequestBody Notification notification) {
        return notificationService.addNotification(notification);
    }

    @PutMapping("/update")
    public Notification updateNotification(@RequestBody Notification notification) {
        return notificationService.updateNotification(notification);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return "Notification deleted successfully";
    }

    @GetMapping("/get/{id}")
    public Notification getNotificationById(@PathVariable Long id) {
        return notificationService.getNotificationById(id);
    }

    @GetMapping("/getall")
    public List<Notification> getAllNotifications() {
        return notificationService.getAllNotifications();
    }
}
