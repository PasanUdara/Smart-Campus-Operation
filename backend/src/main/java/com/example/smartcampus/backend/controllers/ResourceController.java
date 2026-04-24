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

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public List<Resource> getAllResources() {
        return resourceService.getAllResources();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Resource getResourceById(@PathVariable String id) {
        return resourceService.getResourceById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Resource createResource(@RequestBody Resource resource) {
        return resourceService.createResource(resource);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Resource updateResource(@PathVariable String id,
                                  @RequestBody Resource resource) {
        return resourceService.updateResource(id, resource);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteResource(@PathVariable String id) {
        resourceService.deleteResource(id);
        return "Deleted";
    }

    @GetMapping("/type/{type}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public List<Resource> getResourcesByType(@PathVariable String type) {
        return resourceService.getResourcesByType(type);
    }

    @GetMapping("/location/{location}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public List<Resource> getResourcesByLocation(@PathVariable String location) {
        return resourceService.getResourcesByLocation(location);
    }

    @GetMapping("/capacity/{capacity}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public List<Resource> getResourcesByCapacity(@PathVariable int capacity) {
        return resourceService.getResourcesByCapacity(capacity);
    }
}