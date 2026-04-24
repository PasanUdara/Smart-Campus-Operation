package com.example.smartcampus.backend.controllers;

import com.example.smartcampus.backend.models.User;
import com.example.smartcampus.backend.repositories.UserRepository;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.*;


@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

  
    
    // DELETE /api/users/{id} - Admin removes user
    @DeleteMapping("/{id}")
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
    
    // CREATE USER (Admin only)
    @PostMapping
    public Map<String, Object> createUser(@RequestBody Map<String, String> request) {
        System.out.println("=== CREATE USER REQUEST RECEIVED ===");
        System.out.println("Email: " + request.get("email"));
        System.out.println("Name: " + request.get("name"));
        System.out.println("Role: " + request.get("role"));
        
        Map<String, Object> response = new HashMap<>();
        
        String email = request.get("email");
        String name = request.get("name");
        String role = request.get("role");
        String password = request.get("password");
        
        // Check if user already exists
        if (userRepository.findByEmail(email).isPresent()) {
            response.put("success", false);
            response.put("message", "User with this email already exists");
            return response;
        }
        
        User user = new User();
        user.setEmail(email);
        user.setName(name);
        user.setActive(true);
        user.setCreatedAt(new Date());
        
        // Set roles
        List<String> roles = new ArrayList<>();
        roles.add("ROLE_USER");
        if ("ADMIN".equals(role)) {
            roles.add("ROLE_ADMIN");
        } else if ("TECHNICIAN".equals(role)) {
            roles.add("ROLE_TECHNICIAN");
        }
        user.setRoles(roles);
        
        // Set password if provided, otherwise generate random one
        String finalPassword = password;
        if (finalPassword == null || finalPassword.isEmpty()) {
            finalPassword = generateRandomPassword();
        }
        user.setPassword(passwordEncoder.encode(finalPassword));
        
        userRepository.save(user);
        // After userRepository.save(user);

        
        response.put("success", true);
        response.put("message", "User created successfully");
        response.put("password", finalPassword);
        response.put("user", user);
        
        return response;
    }
    
    // BULK CREATE USERS (Admin only)
    @PostMapping("/bulk")
    public Map<String, Object> createUsersBulk(@RequestBody List<Map<String, String>> usersList) {
        Map<String, Object> response = new HashMap<>();
        List<Map<String, Object>> results = new ArrayList<>();
        int successCount = 0;
        
        for (Map<String, String> userData : usersList) {
            Map<String, Object> result = new HashMap<>();
            String email = userData.get("email");
            
            if (userRepository.findByEmail(email).isPresent()) {
                result.put("email", email);
                result.put("success", false);
                result.put("message", "User already exists");
            } else {
                try {
                    User user = new User();
                    user.setEmail(email);
                    user.setName(userData.get("name"));
                    user.setActive(true);
                    user.setCreatedAt(new Date());
                    
                    List<String> roles = new ArrayList<>();
                    roles.add("ROLE_USER");
                    String role = userData.get("role");
                    if ("ADMIN".equals(role)) {
                        roles.add("ROLE_ADMIN");
                    } else if ("TECHNICIAN".equals(role)) {
                        roles.add("ROLE_TECHNICIAN");
                    }
                    user.setRoles(roles);
                    
                    String password = generateRandomPassword();
                    user.setPassword(passwordEncoder.encode(password));
                    
                    userRepository.save(user);
                    
                    result.put("email", email);
                    result.put("success", true);
                    result.put("password", password);
                    successCount++;
                } catch (Exception e) {
                    result.put("email", email);
                    result.put("success", false);
                    result.put("message", e.getMessage());
                }
            }
            results.add(result);
        }
        
        response.put("total", usersList.size());
        response.put("successCount", successCount);
        response.put("results", results);
        
        return response;
    }
    
    // Helper method to generate random password
    private String generateRandomPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 10; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
    
    // Get all users (admin only)
    @GetMapping
    public Iterable<User> getAllUsers() {
        return userRepository.findAll();
    }
}