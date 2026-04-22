package com.example.smartcampus.backend.controllers;

import com.example.smartcampus.backend.models.User;
import com.example.smartcampus.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {
    
    @Autowired
    private UserRepository userRepository;
    
    // YOUR ENDPOINT 4: DELETE /api/users/{id} - Admin removes user
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, String> deleteUser(@PathVariable String id) {
        Map<String, String> response = new HashMap<>();
        
        Optional<User> userOpt = userRepository.findById(id);
        
        if (userOpt.isEmpty()) {
            response.put("message", "User not found");
            return response;
        }
        
        User user = userOpt.get();
        userRepository.deleteById(id);
        
        response.put("message", "User " + user.getEmail() + " has been deleted successfully");
        return response;
    }
    
    // Bonus: Get all users (admin only)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Iterable<User> getAllUsers() {
        return userRepository.findAll();
    }
}