package com.example.smartcampus.backend.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.smartcampus.backend.models.Booking;

import java.util.List;

public interface BookingRepo extends MongoRepository<Booking, String> {

    // Find all bookings by a specific user
    List<Booking> findByUserId(String userId);

    // Find bookings by status (for admin filtering)
    List<Booking> findByStatus(String status);

    // Find bookings by resource ID
    List<Booking> findByResourceId(String resourceId);

    // Find bookings for a resource that are in specific statuses (for conflict detection)
    List<Booking> findByResourceIdAndStatusIn(String resourceId, List<String> statuses);

    // Find bookings by user and status
    List<Booking> findByUserIdAndStatus(String userId, String status);
}
