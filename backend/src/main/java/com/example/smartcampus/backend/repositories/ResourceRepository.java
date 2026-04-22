package com.example.smartcampus.backend.repositories;

import com.example.smartcampus.backend.models.Resource;
import com.example.smartcampus.backend.models.ResourceStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ResourceRepository extends MongoRepository<Resource, String> {

    List<Resource> findByType(String type);

    List<Resource> findByLocation(String location);

    List<Resource> findByCapacityGreaterThanEqual(int capacity);

    List<Resource> findByStatus(ResourceStatus status);
}