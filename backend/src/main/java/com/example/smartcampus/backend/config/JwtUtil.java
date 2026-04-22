package com.example.smartcampus.backend.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.util.Date;
import java.util.List;

@Component
public class JwtUtil {
    
    @Value("${jwt.secret:smartcampus2026superSecretKeyForJWTTokenGenerationAtLeast32CharsLong}")
    private String secret;
    
    @Value("${jwt.expiration:86400000}")
    private long expiration;
    
    private Algorithm getAlgorithm() {
        return Algorithm.HMAC256(secret);
    }
    
    public String generateToken(String userId, String email, List<String> roles) {
        return JWT.create()
                .withSubject(userId)
                .withClaim("email", email)
                .withClaim("roles", roles)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + expiration))
                .sign(getAlgorithm());
    }
    
    public String extractUserId(String token) {
        return verifyAndDecode(token).getSubject();
    }
    
    public String extractEmail(String token) {
        return verifyAndDecode(token).getClaim("email").asString();
    }
    
    @SuppressWarnings("unchecked")
    public List<String> extractRoles(String token) {
        return verifyAndDecode(token).getClaim("roles").asList(String.class);
    }
    
    private DecodedJWT verifyAndDecode(String token) {
        JWTVerifier verifier = JWT.require(getAlgorithm()).build();
        return verifier.verify(token);
    }
    
    public boolean isTokenValid(String token) {
        try {
            DecodedJWT decodedJWT = verifyAndDecode(token);
            return decodedJWT.getExpiresAt().after(new Date());
        } catch (Exception e) {
            return false;
        }
    }
}