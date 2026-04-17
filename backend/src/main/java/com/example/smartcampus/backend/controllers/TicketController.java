package com.example.smartcampus.backend.controllers;

import com.example.smartcampus.backend.models.Ticket;
import com.example.smartcampus.backend.services.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:5173")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    // 1. POST: Create Ticket with Images [cite: 125]
    @PostMapping
    public Ticket createTicket(
            @RequestParam("resourceId") String resourceId,
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @RequestParam("priority") String priority,
            @RequestParam(value = "images", required = false) MultipartFile[] images) {
        return ticketService.saveTicket(resourceId, category, description, priority, images);
    }

    // 2. GET: Fetch all tickets (Admin/Technician roles අනුව filter කළ හැක) [cite: 126]
    @GetMapping
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }

    // 3. PUT: Update status (Admin සඳහා REJECT, Technician සඳහා RESOLVED) [cite: 127]
    @PutMapping("/{id}")
    public Ticket updateTicket(@PathVariable String id, 
                               @RequestParam("status") String status,
                               @RequestParam(value = "note", required = false) String note,
                               @RequestParam(value = "technicianId", required = false) String technicianId) {
        return ticketService.updateTicketStatus(id, status, note, technicianId);
    }

    // 4. DELETE: Delete a comment [cite: 128]
    @DeleteMapping("/{id}/comments/{commentId}")
    public void deleteComment(@PathVariable String id, @PathVariable String commentId) {
        ticketService.deleteComment(id, commentId);
    }
}