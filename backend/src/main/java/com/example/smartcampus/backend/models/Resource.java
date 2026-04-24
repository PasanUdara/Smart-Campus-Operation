package com.example.smartcampus.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "resources")
public class Resource {

    @Id
    private String id;

    private String name;
    private String type;
    private int capacity;
    private String location;

    // Existing feature (keep)
    private String availabilityWindow;

    // New feature → Availability Calendar
    private String availableDays;   // Example: Mon - Fri
    private String availableTime;   // Example: 8AM - 5PM

    private ResourceStatus status;

    public Resource() {
    }

    public Resource(
            String name,
            String type,
            int capacity,
            String location,
            String availabilityWindow,
            String availableDays,
            String availableTime,
            ResourceStatus status
    ) {
        this.name = name;
        this.type = type;
        this.capacity = capacity;
        this.location = location;
        this.availabilityWindow = availabilityWindow;
        this.availableDays = availableDays;
        this.availableTime = availableTime;
        this.status = status;
    }

    // =========================
    // GETTERS & SETTERS
    // =========================

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getAvailabilityWindow() {
        return availabilityWindow;
    }

    public void setAvailabilityWindow(String availabilityWindow) {
        this.availabilityWindow = availabilityWindow;
    }

    public String getAvailableDays() {
        return availableDays;
    }

    public void setAvailableDays(String availableDays) {
        this.availableDays = availableDays;
    }

    public String getAvailableTime() {
        return availableTime;
    }

    public void setAvailableTime(String availableTime) {
        this.availableTime = availableTime;
    }

    public ResourceStatus getStatus() {
        return status;
    }

    public void setStatus(ResourceStatus status) {
        this.status = status;
    }
}