package com.example.smartcampus.backend.controllers;

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

    @PostMapping
    public Ticket create(
            @RequestParam("resourceId") String resId, @RequestParam("category") String cat,
            @RequestParam("description") String desc, @RequestParam("priority") String prio,
            @RequestParam("contactDetails") String contact,
            @RequestParam(value = "images", required = false) MultipartFile[] images) {
        return ticketService.saveTicket(resId, cat, desc, prio, contact, images);
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
    public void addComment(@PathVariable String id, @RequestBody Map<String, String> body) {
        ticketService.addComment(id, body.get("authorId"), body.get("text"));
    }

    @DeleteMapping("/{id}/comments/{commentId}")
    public void deleteComment(@PathVariable String id, @PathVariable String commentId) {
        ticketService.deleteComment(id, commentId);
    }

    @DeleteMapping("/{id}")
    public void deleteTicket(@PathVariable String id) { ticketService.deleteTicket(id); }
}