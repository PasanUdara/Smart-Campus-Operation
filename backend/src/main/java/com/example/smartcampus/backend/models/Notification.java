package com.example.smartcampus.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class Notification {
    
    @Id
    private String id;
    private String userId;      // Who receives this notification
    private String title;       // "Booking Approved"
    private String message;     // "Your booking for Lab 101 was approved"
    private String type;        // "BOOKING", "TICKET", "COMMENT"
    private String referenceId; // bookingId or ticketId
    private boolean isRead = false;
    private Date createdAt = new Date();
    
    // Convenience constructor
    public Notification(String userId, String title, String message, String type, String referenceId) {
        this.userId = userId;
        this.title = title;
        this.message = message;
        this.type = type;
        this.referenceId = referenceId;
        this.createdAt = new Date();
    }
}
