package com.example.smartcampus.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.smartcampus.backend.services.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.smartcampus.backend.models.Booking;
import com.example.smartcampus.backend.config.JwtUtil;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private JwtUtil jwtUtil;

    // ────────────────────────────────────────────
    // Helper: extract userId from Authorization header
    // ────────────────────────────────────────────
    private String extractUserId(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtUtil.extractUserId(token);
        }
        return null;
    }

    private List<String> extractRoles(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtUtil.extractRoles(token);
        }
        return List.of();
    }

    // ────────────────────────────────────────────
    // 1. CREATE BOOKING (User)
    // ────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<?> createBooking(
            @RequestBody Booking booking,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            // Extract user ID from JWT token and set on booking
            String userId = extractUserId(authHeader);
            if (userId != null) {
                booking.setUserId(userId);
            }

            // Force PENDING status for new bookings
            booking.setStatus("PENDING");

            Booking created = bookingService.createBooking(booking);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);

        } catch (IllegalArgumentException e) {
            // Validation error → 400 Bad Request
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        } catch (RuntimeException e) {
            // Scheduling conflict → 409 Conflict
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ────────────────────────────────────────────
    // 2. GET ALL BOOKINGS (Admin) — with optional status filter
    // ────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings(
            @RequestParam(required = false) String status) {
        List<Booking> bookings;
        if (status != null && !status.isEmpty() && !"ALL".equalsIgnoreCase(status)) {
            bookings = bookingService.getBookingsByStatus(status);
        } else {
            bookings = bookingService.getAllBookings();
        }
        return ResponseEntity.ok(bookings);
    }

    // ────────────────────────────────────────────
    // 3. GET MY BOOKINGS (Current user)
    // ────────────────────────────────────────────
    @GetMapping("/my")
    public ResponseEntity<?> getMyBookings(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        String userId = extractUserId(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Authentication required"));
        }
        List<Booking> bookings = bookingService.getBookingsByUserId(userId);
        return ResponseEntity.ok(bookings);
    }

    // ────────────────────────────────────────────
    // 4. GET SINGLE BOOKING
    // ────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable String id) {
        Booking booking = bookingService.getBookingById(id);
        if (booking == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Booking not found"));
        }
        return ResponseEntity.ok(booking);
    }

    // ────────────────────────────────────────────
    // 5. APPROVE BOOKING (Admin)
    // ────────────────────────────────────────────
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveBooking(
            @PathVariable String id,
            @RequestBody(required = false) Map<String, String> body) {
        try {
            String remarks = (body != null) ? body.get("adminRemarks") : null;
            Booking approved = bookingService.approveBooking(id, remarks);
            return ResponseEntity.ok(approved);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // 6. REJECT BOOKING (Admin)
    // ────────────────────────────────────────────
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectBooking(
            @PathVariable String id,
            @RequestBody(required = false) Map<String, String> body) {
        try {
            String remarks = (body != null) ? body.get("adminRemarks") : null;
            Booking rejected = bookingService.rejectBooking(id, remarks);
            return ResponseEntity.ok(rejected);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ────────────────────────────────────────────
    // 7. CANCEL BOOKING (User — only APPROVED bookings)
    // ────────────────────────────────────────────
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable String id) {
        try {
            Booking cancelled = bookingService.cancelBooking(id);
            return ResponseEntity.ok(cancelled);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ────────────────────────────────────────────
    // 8. UPDATE BOOKING (General — kept for backward compat)
    // ────────────────────────────────────────────
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBooking(
            @PathVariable String id,
            @RequestBody Booking updatedBooking) {
        Booking booking = bookingService.getBookingById(id);
        if (booking == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Booking not found"));
        }

        // Update mutable fields
        if (updatedBooking.getStatus() != null) booking.setStatus(updatedBooking.getStatus());
        if (updatedBooking.getAdminRemarks() != null) booking.setAdminRemarks(updatedBooking.getAdminRemarks());

        // Save directly (already handled by specific approve/reject/cancel endpoints)
        return ResponseEntity.ok(booking);
    }

    // ────────────────────────────────────────────
    // 9. DELETE BOOKING (Admin)
    // ────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable String id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.ok(Map.of("message", "Booking deleted successfully"));
    }
}
