package com.example.smartcampus.backend.controllers;

import com.example.smartcampus.backend.config.JwtUtil;
import com.example.smartcampus.backend.models.User;
import com.example.smartcampus.backend.repositories.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class GoogleAuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    @PostMapping("/google")
    public Map<String, Object> googleLogin(@RequestBody Map<String, String> request) {
        String idTokenString = request.get("token");
        Map<String, Object> response = new HashMap<>();

        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(), JacksonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList(googleClientId))
                .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                
                String email = payload.getEmail();
                String name = (String) payload.get("name");
                String providerId = payload.getSubject();
                
                Optional<User> existingUser = userRepository.findByEmail(email);
                User user;
                
                if (existingUser.isPresent()) {
                    user = existingUser.get();
                    user.setLastLogin(new java.util.Date());
                } else {
                    // Create new user
                    user = new User(email, name, "google", providerId);
                    user.setActive(true);
                    user.setCreatedAt(new java.util.Date());
                }
                
                userRepository.save(user);
                
                String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRoles());
                
                response.put("success", true);
                response.put("token", token);
                response.put("userId", user.getId());
                response.put("email", user.getEmail());
                response.put("name", user.getName());
                response.put("roles", user.getRoles());
            } else {
                response.put("success", false);
                response.put("message", "Invalid Google token");
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Google authentication failed: " + e.getMessage());
        }
        
        return response;
    }
}