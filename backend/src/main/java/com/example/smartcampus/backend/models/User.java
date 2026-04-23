package com.example.smartcampus.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String email;
    
    private String name;
    private String password; // Will be encoded (for email/password login - optional)
    
    // For Google OAuth
    private String provider;     // "google"
    private String providerId;   // Google sub ID
    
    private List<String> roles = new ArrayList<>(); // e.g., "ROLE_USER", "ROLE_ADMIN"
    private boolean active = true;
    private Date createdAt = new Date();
    private Date lastLogin;
    
    // Constructor for manual user creation (admin)
    public User(String email, String name, List<String> roles) {
        this.email = email;
        this.name = name;
        this.roles = roles;
        this.createdAt = new Date();
    }
    
    // Constructor for OAuth user
    public User(String email, String name, String provider, String providerId) {
        this.email = email;
        this.name = name;
        this.provider = provider;
        this.providerId = providerId;
        this.roles.add("ROLE_USER");
        this.createdAt = new Date();
    }
}