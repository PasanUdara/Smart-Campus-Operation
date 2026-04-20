package com.example.smartcampus.backend.services;

import com.example.smartcampus.backend.models.Ticket;
import com.example.smartcampus.backend.models.Comment;
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

    public Ticket saveTicket(String resId, String cat, String desc, String prio, String contact, 
                             String name, String sId, String email, String bld, MultipartFile[] images) {
        Ticket ticket = new Ticket();
        ticket.setResourceId(resId);
        ticket.setCategory(cat);
        ticket.setDescription(desc);
        ticket.setPriority(prio);
        ticket.setContactDetails(contact);
        ticket.setReporterName(name);
        ticket.setStudentId(sId);
        ticket.setEmail(email);
        ticket.setBuilding(bld);

        if (images != null) {
            File folder = new File(UPLOAD_DIR);
            if (!folder.exists()) folder.mkdirs();
            for (MultipartFile img : images) {
                try {
                    String fileName = UUID.randomUUID() + "_" + img.getOriginalFilename();
                    img.transferTo(new File(UPLOAD_DIR + File.separator + fileName));
                    ticket.getImageUrls().add(fileName);
                } catch (Exception e) { e.printStackTrace(); }
            }
        }
        return ticketRepository.save(ticket);
    }

    public List<Ticket> getAllTickets() { return ticketRepository.findAll(); }

    public Ticket updateStatus(String id, String status, String note, String techId) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow();
        ticket.setStatus(status);
        if (techId != null && !techId.isEmpty()) ticket.setAssignedTechnicianId(techId);
        if ("RESOLVED".equals(status)) ticket.setResolutionNotes(note);
        if ("REJECTED".equals(status)) ticket.setRejectedReason(note);
        return ticketRepository.save(ticket);
    }

    public void addComment(String tId, String authId, String text) {
        Ticket ticket = ticketRepository.findById(tId).orElseThrow();
        Comment c = new Comment();
        c.setId(UUID.randomUUID().toString());
        c.setAuthorId(authId);
        c.setText(text);
        c.setTimestamp(new Date());
        ticket.getComments().add(c);
        ticketRepository.save(ticket);
    }

    // ✅ FIXED: Comment Edit Logic
    public void editComment(String tId, String cId, String authId, String newText) {
        Ticket ticket = ticketRepository.findById(tId).orElseThrow();
        boolean isUpdated = false;
        for (Comment c : ticket.getComments()) {
            // ID එක සහ AuthorID එක දෙකම මැච් වෙනවාද බලනවා
            if (c.getId().equals(cId) && c.getAuthorId().equals(authId)) {
                c.setText(newText);
                c.setTimestamp(new Date());
                isUpdated = true;
                break;
            }
        }
        if (isUpdated) {
            ticketRepository.save(ticket);
        }
    }

    public void deleteComment(String tId, String cId) {
        Ticket ticket = ticketRepository.findById(tId).orElseThrow();
        ticket.getComments().removeIf(c -> c.getId().equals(cId));
        ticketRepository.save(ticket);
    }

    public void deleteTicket(String id) { ticketRepository.deleteById(id); }
}