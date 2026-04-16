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

    public Booking createBooking(Booking booking) {
        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking getBookingById(String id) {
        return bookingRepository.findById(id).orElse(null);
    }

    public Booking updateBooking(String id, Booking updatedBooking) {
        return bookingRepository.findById(id).map(booking -> {
            booking.setResourceId(updatedBooking.getResourceId());
            booking.setUserId(updatedBooking.getUserId());
            booking.setStartTime(updatedBooking.getStartTime());
            booking.setEndTime(updatedBooking.getEndTime());
            booking.setStatus(updatedBooking.getStatus());
            booking.setPurpose(updatedBooking.getPurpose());
            booking.setAttendees(updatedBooking.getAttendees());
            booking.setAdminRemarks(updatedBooking.getAdminRemarks());
            return bookingRepository.save(booking);
        }).orElse(null);
    }

    public void deleteBooking(String id) {
        bookingRepository.deleteById(id);
    }
}
