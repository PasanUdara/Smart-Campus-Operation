package com.example.smartcampus.backend.controllers;

import com.example.smartcampus.backend.config.JwtUtil;
import com.example.smartcampus.backend.models.User;
import com.example.smartcampus.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    // YOUR ENDPOINT 1: POST /api/auth/login
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        
        Map<String, Object> response = new HashMap<>();
        
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "User not found");
            return response;
        }
        
        User user = userOpt.get();
        
        // Check if user has a password (for email/password login)
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            response.put("success", false);
            response.put("message", "Please login with Google OAuth");
            return response;
        }
        
        if (!passwordEncoder.matches(password, user.getPassword())) {
            response.put("success", false);
            response.put("message", "Invalid password");
            return response;
        }
        
        // Check if user is active
        if (!user.isActive()) {
            response.put("success", false);
            response.put("message", "Account is disabled");
            return response;
        }
        
        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRoles());
        
        response.put("success", true);
        response.put("token", token);
        response.put("userId", user.getId());
        response.put("email", user.getEmail());
        response.put("name", user.getName());
        response.put("roles", user.getRoles());
        
        return response;
    }
    


    // Get current user info from token
    @GetMapping("/me")
    public Map<String, Object> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        Map<String, Object> response = new HashMap<>();
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                String userId = jwtUtil.extractUserId(token);
                Optional<User> userOpt = userRepository.findById(userId);
                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    response.put("authenticated", true);
                    response.put("userId", user.getId());
                    response.put("email", user.getEmail());
                    response.put("name", user.getName());
                    response.put("roles", user.getRoles());
                    return response;
                }
            } catch (Exception e) {
                response.put("authenticated", false);
                return response;
            }
        }
        
        response.put("authenticated", false);
        return response;
    }
}