package com.example.smartcampus.backend.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.smartcampus.backend.models.Booking;


public interface BookingRepo extends MongoRepository<Booking, String> {

}
