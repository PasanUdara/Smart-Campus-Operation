package com.example.smartcampus.backend.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Comment {
    private String id;
    private String authorId;
    private String text;
    private Date timestamp = new Date();
}