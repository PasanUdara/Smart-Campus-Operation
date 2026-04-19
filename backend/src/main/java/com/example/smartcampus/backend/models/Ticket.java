package com.example.smartcampus.backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.*;

@Data
@Document(collection = "tickets")
public class Ticket {
    @Id
    private String id;
    private String resourceId;
    private String category;
    private String description;
    private String priority;
    private String contactDetails; 
    private List<String> imageUrls = new ArrayList<>(); 
    private String status = "OPEN"; 
    private String assignedTechnicianId; // ✅ නම නිවැරදියි
    private String resolutionNotes;
    private String rejectedReason;
    private List<Comment> comments = new ArrayList<>(); 
    private Date createdAt = new Date();
}