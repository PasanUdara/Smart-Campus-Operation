package com.example.smartcampus.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;
import java.time.LocalDateTime;

@Document(collection = "bookings")
@Data
public class Booking {

    @Id
    private String id;
    private String resourceId;
    private String resourceName;   // Denormalized for display
    private String userId;
    private String userName;       // Denormalized for display
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status; // PENDING, APPROVED, REJECTED, CANCELLED
    private String purpose;
    private Integer expectedAttendees;
    private String adminRemarks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
