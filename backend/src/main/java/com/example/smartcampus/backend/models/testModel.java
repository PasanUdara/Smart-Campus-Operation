package com.example.smartcampus.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Document(collection = "test")
@Data
public class testModel {

    @Id
    private String id;

    // Getters and setters
}
