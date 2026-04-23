package com.example.smartcampus.backend.controllers;

import com.example.smartcampus.backend.config.JwtUtil;
import com.example.smartcampus.backend.models.Ticket;
import com.example.smartcampus.backend.services.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.*;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private JwtUtil jwtUtil;  

    @PostMapping
    public Ticket create(
            @RequestParam("resourceId") String resId, @RequestParam("category") String cat,
            @RequestParam("description") String desc, @RequestParam("priority") String prio,
            @RequestParam("contactDetails") String contact, @RequestParam("reporterName") String name,
            @RequestParam("studentId") String sId, @RequestParam("email") String email,
            @RequestParam("building") String bld,
            @RequestParam(value = "images", required = false) MultipartFile[] images,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
                // ADD THIS
        
        // ========== EXTRACT USER INFO FROM JWT TOKEN ==========
        String createdBy = null;
        String createdByEmail = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                createdBy = jwtUtil.extractUserId(token);
                createdByEmail = jwtUtil.extractEmail(token);
            } catch (Exception e) {
                System.err.println("Invalid token: " + e.getMessage());
            }
        }
        // ======================================================
        
        return ticketService.saveTicket(resId, cat, desc, prio, contact, name, sId, email, bld, images,createdBy, createdByEmail);
    }

    @GetMapping
    public List<Ticket> getAll() { return ticketService.getAllTickets(); }

    @PutMapping("/{id}")
    public Ticket update(@PathVariable String id, @RequestParam("status") String status,
                         @RequestParam(value = "note", required = false) String note,
                         @RequestParam(value = "techId", required = false) String techId) {
        return ticketService.updateStatus(id, status, note, techId);
    }

    @PostMapping("/{id}/comments")
    public void addComment(@PathVariable String id, @RequestBody Map<String, String> body,
        @RequestHeader(value = "Authorization", required = false) String authHeader) {
       
       
            // ========== USE JWT USER ID AS AUTHOR IF AVAILABLE ==========
        String authorId = body.get("authorId");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                authorId = jwtUtil.extractUserId(token);  // Override with authenticated user
            } catch (Exception e) {
                // Keep the provided authorId if token invalid
            }
        }
        // =========================================================== 
        ticketService.addComment(id, authorId, body.get("text"));
    }

    @PutMapping("/{id}/comments/{commentId}")
    public void editComment(@PathVariable String id, @PathVariable String commentId, @RequestBody Map<String, String> body) {
        ticketService.editComment(id, commentId, body.get("authorId"), body.get("text"));
    }

    @DeleteMapping("/{id}/comments/{commentId}")
    public void deleteComment(@PathVariable String id, @PathVariable String commentId) {
        ticketService.deleteComment(id, commentId);
    }

    @DeleteMapping("/{id}")
    public void deleteTicket(@PathVariable String id) { ticketService.deleteTicket(id); }
}