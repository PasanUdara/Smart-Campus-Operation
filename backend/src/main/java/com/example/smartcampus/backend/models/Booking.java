package com.example.smartcampus.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;
import java.time.LocalDateTime;

@Document(collection = "test")
@Data
public class Booking {

    @Id
    private String id;
    private String resourceId;
    private String userId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status; // e.g., "confirmed", "pending", "cancelled"
    private String purpose; // e.g., "study", "meeting", "event"
    private Integer attendees; // Number of attendees for the booking
    private String adminRemarks; // Optional field for admin notes or remarks
}
