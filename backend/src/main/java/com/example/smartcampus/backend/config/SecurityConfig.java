package com.example.smartcampus.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder; 
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.smartcampus.backend.repositories.UserRepository;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    
    @Autowired
    private CustomOAuth2UserService customOAuth2UserService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/auth/**", "/api/test/**", "/login/**", "/oauth2/**").permitAll()
                
                // Public access for testing tickets, bookings, and resources
                // .requestMatchers("/api/resources/**", "/api/bookings/**", "/api/tickets/**").permitAll()

                .requestMatchers("/api/resources/**").authenticated()
                
                // Protected endpoints
                .requestMatchers("/api/users/**").hasRole("ADMIN")
                .requestMatchers("/api/notifications/**").authenticated()
                .anyRequest().authenticated()
            )
            // OAuth2 Login Configuration
            .oauth2Login(oauth2 -> oauth2
                .userInfoEndpoint(userInfo -> userInfo
                    .userService(customOAuth2UserService)
                )
                .successHandler((request, response, authentication) -> {
                    org.springframework.security.oauth2.core.user.OAuth2User oAuth2User = 
                        (org.springframework.security.oauth2.core.user.OAuth2User) authentication.getPrincipal();
                    String email = (String) oAuth2User.getAttributes().get("email");
                    
                    java.util.Optional<com.example.smartcampus.backend.models.User> userOpt = userRepository.findByEmail(email);
                    if (userOpt.isPresent()) {
                        com.example.smartcampus.backend.models.User user = userOpt.get();
                        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRoles());
                        response.sendRedirect("http://localhost:5173/oauth-callback?token=" + token);
                    } else {
                        response.sendRedirect("http://localhost:5173/login?error=User not found");
                    }
                })
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}