package com.example.smartcampus.backend.repositories;

import com.example.smartcampus.backend.models.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TicketRepository extends MongoRepository<Ticket, String> {
    // Model එකේ තියෙන assignedTechnicianId නමට ගැලපෙන්න මෙතන හදලා තියෙන්නේ
    List<Ticket> findByAssignedTechnicianId(String assignedTechnicianId);
}