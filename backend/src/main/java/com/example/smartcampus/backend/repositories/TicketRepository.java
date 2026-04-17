package com.example.smartcampus.backend.repositories;

import com.example.smartcampus.backend.models.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TicketRepository extends MongoRepository<Ticket, String> {
    List<Ticket> findByStatus(String status);
    List<Ticket> findByTechnicianId(String technicianId); // Technician ට අදාළ tickets සෙවීමට [cite: 126]
}