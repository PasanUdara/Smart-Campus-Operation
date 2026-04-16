package com.example.smartcampus.backend.controllers;

import org.springframework.web.bind.annotation.*;
import com.example.smartcampus.backend.services.testService;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.smartcampus.backend.models.testModel;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RestController
@RequestMapping("/api/tests")
@CrossOrigin(origins = "http://localhost:5173")
public class testController {

    @Autowired
    private testService testService;

    @GetMapping
    public List<testModel> getAllTests() {
        return testService.getAllTests();
    }
}
