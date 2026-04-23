package com.example.smartcampus.backend.controllers;

import com.example.smartcampus.backend.models.Resource;
import com.example.smartcampus.backend.services.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "http://localhost:5173")
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    // =========================
    // 🔓 GET ALL (USER + ADMIN)
    // =========================
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public List<Resource> getAllResources() {
        return resourceService.getAllResources();
    }

    // =========================
    // 🔓 GET BY ID
    // =========================
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Resource getResourceById(@PathVariable String id) {
        return resourceService.getResourceById(id);
    }

    // =========================
    // 🔒 CREATE (ADMIN ONLY)
    // =========================
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Resource createResource(@RequestBody Resource resource) {
        return resourceService.createResource(resource);
    }

    // =========================
    // 🔒 UPDATE (ADMIN ONLY)
    // =========================
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Resource updateResource(@PathVariable String id,
                                  @RequestBody Resource resource) {
        return resourceService.updateResource(id, resource);
    }

    // =========================
    // 🔒 DELETE (ADMIN ONLY)
    // =========================
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteResource(@PathVariable String id) {
        resourceService.deleteResource(id);
        return "Resource deleted successfully";
    }

    // =========================
    // 🔓 SEARCH BY TYPE
    // =========================
    @GetMapping("/type/{type}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public List<Resource> getResourcesByType(@PathVariable String type) {
        return resourceService.getResourcesByType(type);
    }

    // =========================
    // 🔓 SEARCH BY LOCATION
    // =========================
    @GetMapping("/location/{location}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public List<Resource> getResourcesByLocation(@PathVariable String location) {
        return resourceService.getResourcesByLocation(location);
    }

    // =========================
    // 🔓 SEARCH BY CAPACITY
    // =========================
    @GetMapping("/capacity/{capacity}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public List<Resource> getResourcesByCapacity(@PathVariable int capacity) {
        return resourceService.getResourcesByCapacity(capacity);
    }
}