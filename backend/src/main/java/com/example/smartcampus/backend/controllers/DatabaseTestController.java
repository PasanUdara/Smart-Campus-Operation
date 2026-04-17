package com.example.smartcampus.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class DatabaseTestController {

    @Autowired
    private MongoTemplate mongoTemplate;

    @GetMapping("/db-check")
    public String checkConnection() {
        try {
            
            mongoTemplate.getDb().listCollectionNames().first();
            return "Database Connection is Working! ✅ (User: Chanaka)";
        } catch (Exception e) {
            return "Database Connection Failed: ❌ " + e.getMessage();
        }
    }
}