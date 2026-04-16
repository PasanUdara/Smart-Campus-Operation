package com.example.smartcampus.backend.services;

import org.springframework.stereotype.Service;

import com.example.smartcampus.backend.models.testModel;
import com.example.smartcampus.backend.repositories.testRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Service
public class testService {

    @Autowired
    private testRepository testRepository;

    public List<testModel> getAllTests() {
        return testRepository.findAll();
    }
}
