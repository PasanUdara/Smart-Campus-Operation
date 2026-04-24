package com.example.smartcampus.backend.services;

import org.springframework.stereotype.Service;

import com.example.smartcampus.backend.models.Booking;
import com.example.smartcampus.backend.models.Resource;
import com.example.smartcampus.backend.models.User;
import com.example.smartcampus.backend.repositories.BookingRepo;
import com.example.smartcampus.backend.repositories.ResourceRepository;
import com.example.smartcampus.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepo bookingRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private UserRepository userRepository;

    // ────────────────────────────────────────────
    // VALIDATION CONSTANTS
    // ────────────────────────────────────────────
    private static final int MIN_BOOKING_MINUTES = 15;
    private static final int MAX_BOOKING_HOURS = 24;
    private static final int MAX_PURPOSE_LENGTH = 500;
    private static final int MIN_ATTENDEES = 1;
    private static final int MAX_ATTENDEES = 1000;

    /**
     * Validate all booking fields before creation.
     * Throws IllegalArgumentException with a descriptive message on failure.
     */
    private void validateBooking(Booking booking) {
        // 1. Resource ID is required
        if (booking.getResourceId() == null || booking.getResourceId().trim().isEmpty()) {
            throw new IllegalArgumentException("Resource ID is required. Please select a resource.");
        }

        // 2. Verify resource exists
        if (!resourceRepository.existsById(booking.getResourceId())) {
            throw new IllegalArgumentException("Invalid resource. The selected resource does not exist.");
        }

        // 3. Start time is required
        if (booking.getStartTime() == null) {
            throw new IllegalArgumentException("Start time is required.");
        }

        // 4. End time is required
        if (booking.getEndTime() == null) {
            throw new IllegalArgumentException("End time is required.");
        }

        // 5. Start time cannot equal end time
        if (booking.getStartTime().isEqual(booking.getEndTime())) {
            throw new IllegalArgumentException("Start time and end time cannot be the same. Please select a valid time range.");
        }

        // 6. End time must be after start time
        if (booking.getEndTime().isBefore(booking.getStartTime())) {
            throw new IllegalArgumentException("End time must be after the start time.");
        }

        // 7. Minimum booking duration (15 minutes)
        Duration duration = Duration.between(booking.getStartTime(), booking.getEndTime());
        if (duration.toMinutes() < MIN_BOOKING_MINUTES) {
            throw new IllegalArgumentException("Booking duration must be at least " + MIN_BOOKING_MINUTES + " minutes.");
        }

        // 9. Maximum booking duration (24 hours)
        if (duration.toHours() > MAX_BOOKING_HOURS) {
            throw new IllegalArgumentException("Booking duration cannot exceed " + MAX_BOOKING_HOURS + " hours.");
        }

        // 10. Purpose is required and has max length
        if (booking.getPurpose() == null || booking.getPurpose().trim().isEmpty()) {
            throw new IllegalArgumentException("Purpose is required. Please describe the reason for your booking.");
        }
        if (booking.getPurpose().trim().length() > MAX_PURPOSE_LENGTH) {
            throw new IllegalArgumentException("Purpose must be " + MAX_PURPOSE_LENGTH + " characters or less.");
        }

        // 11. Expected attendees validation
        if (booking.getExpectedAttendees() == null || booking.getExpectedAttendees() < MIN_ATTENDEES) {
            throw new IllegalArgumentException("Expected attendees must be at least " + MIN_ATTENDEES + ".");
        }
        if (booking.getExpectedAttendees() > MAX_ATTENDEES) {
            throw new IllegalArgumentException("Expected attendees cannot exceed " + MAX_ATTENDEES + ".");
        }

        // 12. Check attendees against resource capacity
        Optional<Resource> resource = resourceRepository.findById(booking.getResourceId());
        if (resource.isPresent() && booking.getExpectedAttendees() > resource.get().getCapacity()) {
            throw new IllegalArgumentException(
                "Expected attendees (" + booking.getExpectedAttendees() + 
                ") exceeds the resource capacity (" + resource.get().getCapacity() + 
                "). Please choose a larger facility or reduce attendees."
            );
        }
    }

    /**
     * Create a new booking with validation and conflict detection.
     * Throws RuntimeException if there is a scheduling conflict.
     * Throws IllegalArgumentException if validation fails.
     */
    public Booking createBooking(Booking booking) {
        // Validate all booking fields
        validateBooking(booking);

        // Check for scheduling conflicts (overlapping time ranges for the same resource)
        checkForConflicts(booking.getResourceId(), booking.getStartTime(), booking.getEndTime(), null);

        // Set default status and timestamps
        booking.setStatus("PENDING");
        booking.setCreatedAt(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());

        // Populate denormalized resource name
        if (booking.getResourceId() != null) {
            Optional<Resource> resource = resourceRepository.findById(booking.getResourceId());
            resource.ifPresent(r -> booking.setResourceName(r.getName()));
        }

        // Populate denormalized user name
        if (booking.getUserId() != null) {
            Optional<User> user = userRepository.findById(booking.getUserId());
            user.ifPresent(u -> booking.setUserName(u.getName()));
        }

        Booking savedBooking = bookingRepository.save(booking);

        // Create notification for user
        String resourceLabel = booking.getResourceName() != null ? booking.getResourceName() : booking.getResourceId();
        String message = "Your booking for " + resourceLabel +
                         " on " + booking.getStartTime() + " has been created and is pending approval.";
        notificationService.sendNotification(
            booking.getUserId(),
            "Booking Created",
            message,
            "BOOKING",
            savedBooking.getId()
        );

        return savedBooking;
    }

    /**
     * Check for scheduling conflicts with existing PENDING or APPROVED bookings.
     * Two bookings conflict if they are for the same resource and their time ranges overlap.
     * Overlap: newStart < existingEnd AND newEnd > existingStart
     */
    private void checkForConflicts(String resourceId, LocalDateTime startTime, LocalDateTime endTime, String excludeBookingId) {
        List<String> activeStatuses = Arrays.asList("PENDING", "APPROVED");
        List<Booking> activeBookings = bookingRepository.findByResourceIdAndStatusIn(resourceId, activeStatuses);

        for (Booking existing : activeBookings) {
            // Skip the booking being updated (for edit scenarios)
            if (excludeBookingId != null && excludeBookingId.equals(existing.getId())) {
                continue;
            }

            // Check overlap: newStart < existingEnd AND newEnd > existingStart
            if (startTime.isBefore(existing.getEndTime()) && endTime.isAfter(existing.getStartTime())) {
                throw new RuntimeException(
                    "Scheduling conflict! This resource is already booked from " +
                    existing.getStartTime() + " to " + existing.getEndTime() +
                    " (Booking ID: " + existing.getId() + ", Status: " + existing.getStatus() + ")"
                );
            }
        }
    }

    /**
     * Get all bookings (admin view).
     */
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    /**
     * Get bookings filtered by status (admin view).
     */
    public List<Booking> getBookingsByStatus(String status) {
        return bookingRepository.findByStatus(status);
    }

    /**
     * Get bookings for a specific user.
     */
    public List<Booking> getBookingsByUserId(String userId) {
        return bookingRepository.findByUserId(userId);
    }

    /**
     * Get a single booking by ID.
     */
    public Booking getBookingById(String id) {
        return bookingRepository.findById(id).orElse(null);
    }

    /**
     * Approve a PENDING booking (Admin action).
     */
    public Booking approveBooking(String id, String adminRemarks) {
        return bookingRepository.findById(id).map(booking -> {
            if (!"PENDING".equals(booking.getStatus())) {
                throw new RuntimeException("Only PENDING bookings can be approved. Current status: " + booking.getStatus());
            }

            booking.setStatus("APPROVED");
            booking.setAdminRemarks(adminRemarks);
            booking.setUpdatedAt(LocalDateTime.now());
            Booking saved = bookingRepository.save(booking);

            // Send notification to user
            String resourceLabel = booking.getResourceName() != null ? booking.getResourceName() : booking.getResourceId();
            String message = "Your booking for " + resourceLabel + " has been APPROVED.";
            if (adminRemarks != null && !adminRemarks.isEmpty()) {
                message += " Remarks: " + adminRemarks;
            }
            notificationService.sendNotification(
                booking.getUserId(),
                "Booking Approved",
                message,
                "BOOKING",
                id
            );

            return saved;
        }).orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
    }

    /**
     * Reject a PENDING booking (Admin action).
     */
    public Booking rejectBooking(String id, String adminRemarks) {
        return bookingRepository.findById(id).map(booking -> {
            if (!"PENDING".equals(booking.getStatus())) {
                throw new RuntimeException("Only PENDING bookings can be rejected. Current status: " + booking.getStatus());
            }

            booking.setStatus("REJECTED");
            booking.setAdminRemarks(adminRemarks);
            booking.setUpdatedAt(LocalDateTime.now());
            Booking saved = bookingRepository.save(booking);

            // Send notification to user
            String resourceLabel = booking.getResourceName() != null ? booking.getResourceName() : booking.getResourceId();
            String message = "Your booking for " + resourceLabel + " has been REJECTED.";
            if (adminRemarks != null && !adminRemarks.isEmpty()) {
                message += " Reason: " + adminRemarks;
            }
            notificationService.sendNotification(
                booking.getUserId(),
                "Booking Rejected",
                message,
                "BOOKING",
                id
            );

            return saved;
        }).orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
    }

    /**
     * Cancel an APPROVED booking (User or Admin action).
     */
    public Booking cancelBooking(String id) {
        return bookingRepository.findById(id).map(booking -> {
            if (!"APPROVED".equals(booking.getStatus())) {
                throw new RuntimeException("Only APPROVED bookings can be cancelled. Current status: " + booking.getStatus());
            }

            booking.setStatus("CANCELLED");
            booking.setUpdatedAt(LocalDateTime.now());
            Booking saved = bookingRepository.save(booking);

            // Send notification
            String resourceLabel = booking.getResourceName() != null ? booking.getResourceName() : booking.getResourceId();
            String message = "Your booking for " + resourceLabel + " has been CANCELLED.";
            notificationService.sendNotification(
                booking.getUserId(),
                "Booking Cancelled",
                message,
                "BOOKING",
                id
            );

            return saved;
        }).orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
    }

    /**
     * Delete a booking (Admin only).
     */
    public void deleteBooking(String id) {
        bookingRepository.deleteById(id);
    }
}
