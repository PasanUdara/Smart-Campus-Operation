package com.example.smartcampus.backend.controllers;

import org.springframework.web.bind.annotation.*;
import com.example.smartcampus.backend.services.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.smartcampus.backend.models.Booking;
import com.example.smartcampus.backend.config.JwtUtil;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    @Autowired
    private BookingService bookingService;

       @Autowired
    private JwtUtil jwtUtil;  // ADD THIS

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/{id}")
    public Booking getBookingById(@PathVariable String id) {
        return bookingService.getBookingById(id);
    }

    @PostMapping
    public Booking createBooking(@RequestBody Booking booking,
         @RequestHeader(value = "Authorization", required = false) String authHeader) 
         { // MODIFY THIS
        
        // ========== EXTRACT USER ID FROM JWT TOKEN ==========
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                String userId = jwtUtil.extractUserId(token);
                booking.setUserId(userId);  // Override with authenticated user
            } catch (Exception e) {
                System.err.println("Invalid token: " + e.getMessage());
            }
        }

          // Ensure new bookings start with PENDING status
        if (booking.getStatus() == null || booking.getStatus().isEmpty()) {
            booking.setStatus("PENDING");
        }
        // ====================================================
        return bookingService.createBooking(booking);
    }

    @PostMapping("/{id}")
    public Booking updateBooking(@PathVariable String id, @RequestBody Booking updatedBooking) {
        return bookingService.updateBooking(id, updatedBooking);
    }

    @DeleteMapping("/{id}")
    public void deleteBooking(@PathVariable String id) {
        bookingService.deleteBooking(id);
    }


}
