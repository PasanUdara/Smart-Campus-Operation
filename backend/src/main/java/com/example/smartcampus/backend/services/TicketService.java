package com.example.smartcampus.backend.services;

import com.example.smartcampus.backend.models.Ticket;
import com.example.smartcampus.backend.repositories.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.nio.file.Paths;
import java.util.*;

@Service
public class TicketService {
    @Autowired
    private TicketRepository ticketRepository;

    private final String UPLOAD_DIR = Paths.get("uploads").toAbsolutePath().toString();

    public Ticket saveTicket(String resId, String cat, String desc, String prio, MultipartFile[] images) {
        Ticket ticket = new Ticket();
        ticket.setResourceId(resId);
        ticket.setCategory(cat);
        ticket.setDescription(desc);
        ticket.setPriority(prio);

        if (images != null) {
            File uploadFolder = new File(UPLOAD_DIR);
            if (!uploadFolder.exists()) uploadFolder.mkdirs();

            for (MultipartFile file : images) {
                try {
                    String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                    file.transferTo(new File(UPLOAD_DIR + File.separator + fileName));
                    ticket.getImageUrls().add(fileName);
                } catch (Exception e) { e.printStackTrace(); }
            }
        }
        return ticketRepository.save(ticket);
    }

    public Ticket updateTicketStatus(String id, String status, String note, String technicianId) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow();
        ticket.setStatus(status);
        if (status.equals("REJECTED")) ticket.setRejectedReason(note);
        else ticket.setResolutionNotes(note);
        
        if (technicianId != null) ticket.setTechnicianId(technicianId);
        return ticketRepository.save(ticket);
    }

    public List<Ticket> getAllTickets() { return ticketRepository.findAll(); }

    public void deleteComment(String id, String commentId) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow();
        ticket.getComments().removeIf(c -> c.getId().equals(commentId));
        ticketRepository.save(ticket);
    }

    // මෙන්න මේ කොටස තමයි අඩුවෙලා තිබුණේ 🗑️
    public void deleteTicket(String id) {
        ticketRepository.deleteById(id);
    }
}