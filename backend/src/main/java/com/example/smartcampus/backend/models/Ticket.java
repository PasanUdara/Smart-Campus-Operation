package com.example.smartcampus.backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.ArrayList;

@Data
@Document(collection = "tickets")
public class Ticket {
    @Id
    private String id;
    private String resourceId; 
    private String category;
    private String description;
    private String priority; // LOW, MEDIUM, HIGH
    private String status = "OPEN"; // OPEN, IN_PROGRESS, RESOLVED, REJECTED, CLOSED [cite: 41]
    private String technicianId; // Assign කරන technician ගේ ID එක [cite: 42]
    private String resolutionNotes; 
    private String rejectedReason; // Admin reject කරනවා නම් හේතුව [cite: 41]
    private List<String> imageUrls = new ArrayList<>(); // පින්තූර 3ක් සඳහා [cite: 40]
    private List<Comment> comments = new ArrayList<>(); // Users සහ Staff comments [cite: 43]

    @Data
    public static class Comment {
        private String id;
        private String userId;
        private String text;
    }
}