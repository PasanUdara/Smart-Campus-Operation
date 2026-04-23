package com.example.smartcampus.backend.services;

import org.springframework.stereotype.Service;

import com.example.smartcampus.backend.models.Booking;
import com.example.smartcampus.backend.repositories.BookingRepo;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepo bookingRepository;

        @Autowired
    private NotificationService notificationService;  // nisidu- Inject NotificationService

     public Booking createBooking(Booking booking) {
        Booking savedBooking = bookingRepository.save(booking);
        
        // ADD THIS - Create notification for user
        String message = "Your booking for " + booking.getResourceId() + 
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

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking getBookingById(String id) {
        return bookingRepository.findById(id).orElse(null);
    }

    public Booking updateBooking(String id, Booking updatedBooking) {
        return bookingRepository.findById(id).map(booking -> {

             String oldStatus = booking.getStatus();  // ADD THIS

            booking.setResourceId(updatedBooking.getResourceId());
            booking.setUserId(updatedBooking.getUserId());
            booking.setStartTime(updatedBooking.getStartTime());
            booking.setEndTime(updatedBooking.getEndTime());
            booking.setStatus(updatedBooking.getStatus());
            booking.setPurpose(updatedBooking.getPurpose());
            booking.setAttendees(updatedBooking.getAttendees());
            booking.setAdminRemarks(updatedBooking.getAdminRemarks());
            Booking savedBooking = bookingRepository.save(booking);
        
        // ADD THIS - Send notification if status changed
        if (oldStatus != null && !oldStatus.equals(updatedBooking.getStatus())) {
            String message = "Your booking for " + booking.getResourceId() + 
                             " has been " + updatedBooking.getStatus().toLowerCase();
            notificationService.sendNotification(
                booking.getUserId(),
                "Booking " + updatedBooking.getStatus(),
                message,
                "BOOKING",
                id
            );
        }
        
        return savedBooking;


        }).orElse(null);
    }

    public void deleteBooking(String id) {
        bookingRepository.deleteById(id);
    }
}
