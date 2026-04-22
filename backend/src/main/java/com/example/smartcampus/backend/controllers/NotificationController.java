package com.example.smartcampus.backend.controllers;

import com.example.smartcampus.backend.config.JwtUtil;
import com.example.smartcampus.backend.models.Notification;
import com.example.smartcampus.backend.repositories.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    // Helper method to extract userId from token
    private String extractUserIdFromToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                return jwtUtil.extractUserId(token);
            } catch (Exception e) {
                return null;
            }
        }
        return null;
    }
    


    // YOUR ENDPOINT 2: GET /api/notifications - Fetch user's notifications
    @GetMapping
    public Map<String, Object> getNotifications(@RequestHeader("Authorization") String authHeader) {
        String userId = extractUserIdFromToken(authHeader);
        
        Map<String, Object> response = new HashMap<>();
        
        if (userId == null) {
            response.put("error", "Unauthorized");
            return response;
        }
        
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        long unreadCount = notificationRepository.countByUserIdAndIsReadFalse(userId);
        
        response.put("notifications", notifications);
        response.put("unreadCount", unreadCount);
        return response;
    }
    
    // YOUR ENDPOINT 3: PATCH /api/notifications/{id}/read - Mark as read
    @PatchMapping("/{id}/read")
    public Map<String, String> markAsRead(@PathVariable String id, @RequestHeader("Authorization") String authHeader) {
        String userId = extractUserIdFromToken(authHeader);
        
        Map<String, String> response = new HashMap<>();
        
        if (userId == null) {
            response.put("error", "Unauthorized");
            return response;
        }
        
        Notification notification = notificationRepository.findById(id).orElse(null);
        
        if (notification == null) {
            response.put("message", "Notification not found");
            return response;
        }
        
        if (!notification.getUserId().equals(userId)) {
            response.put("message", "Unauthorized - This notification belongs to another user");
            return response;
        }
        
        notification.setRead(true);
        notificationRepository.save(notification);
        
        response.put("message", "Notification marked as read");
        return response;
    }
}