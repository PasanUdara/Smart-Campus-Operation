package com.example.smartcampus.backend.services;

import com.example.smartcampus.backend.models.Notification;
import com.example.smartcampus.backend.repositories.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    public void sendNotification(String userId, String title, String message, String type, String referenceId) {
        Notification notification = new Notification(userId, title, message, type, referenceId);
        notificationRepository.save(notification);
    }
}