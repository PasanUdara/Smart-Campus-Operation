package com.example.smartcampus.backend.config;

import com.example.smartcampus.backend.models.User;
import com.example.smartcampus.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        Map<String, Object> attributes = oAuth2User.getAttributes();
        
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String providerId = (String) attributes.get("sub");
        
        // Check if user exists in database
        Optional<User> existingUser = userRepository.findByEmail(email);
        User user;
        
        if (existingUser.isPresent()) {
            user = existingUser.get();
            // Update last login time
            user.setLastLogin(new java.util.Date());
            // Ensure provider info is set
            if (user.getProvider() == null) {
                user.setProvider(registrationId);
                user.setProviderId(providerId);
            }
        } else {
            // Create new user for first-time Google login
            user = new User(email, name, registrationId, providerId);
            user.setActive(true);
            user.setCreatedAt(new java.util.Date());
        }
        
        userRepository.save(user);
        
        return oAuth2User;
    }
}