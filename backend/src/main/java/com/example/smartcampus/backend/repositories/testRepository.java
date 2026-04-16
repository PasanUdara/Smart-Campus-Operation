package com.example.smartcampus.backend.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.smartcampus.backend.models.testModel;


public interface testRepository extends MongoRepository<testModel, String> {

}
