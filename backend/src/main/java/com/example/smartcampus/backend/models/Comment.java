package com.example.smartcampus.backend.models;

import lombok.Data;
import java.util.Date;

@Data
public class Comment {
    private String id;
    private String authorId;
    private String text;
    private Date timestamp;
}