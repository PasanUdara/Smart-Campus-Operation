package com.example.smartcampus.backend.controllers;

import com.example.smartcampus.backend.models.Ticket;
import com.example.smartcampus.backend.services.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
// මෙන්න මේ line එක අනිවාර්යයෙන්ම ඕනේ. localhost සහ 127.0.0.1 කියන දෙකම ඇතුළත් කරලා තියෙන්නේ.
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"}, allowCredentials = "true", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class TicketController {

    @Autowired
    private TicketService ticketService;

    // 1. POST: Create Ticket
    @PostMapping
    public Ticket createTicket(
            @RequestParam("resourceId") String resourceId,
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @RequestParam("priority") String priority,
            @RequestParam(value = "images", required = false) MultipartFile[] images) {
        return ticketService.saveTicket(resourceId, category, description, priority, images);
    }

    // 2. GET: Fetch all tickets
    @GetMapping
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }

    // 3. PUT: Update status
    @PutMapping("/{id}")
    public Ticket updateTicket(@PathVariable String id, 
                               @RequestParam("status") String status,
                               @RequestParam(value = "note", required = false) String note,
                               @RequestParam(value = "technicianId", required = false) String technicianId) {
        return ticketService.updateTicketStatus(id, status, note, technicianId);
    }

    // 4. DELETE: Delete a ticket
    @DeleteMapping("/{id}")
    public void deleteTicket(@PathVariable String id) {
        ticketService.deleteTicket(id);
    }
}