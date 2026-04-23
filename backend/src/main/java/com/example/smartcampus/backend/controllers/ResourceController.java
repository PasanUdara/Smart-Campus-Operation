package com.example.smartcampus.backend.controllers;

import com.example.smartcampus.backend.models.Resource;
import com.example.smartcampus.backend.services.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "http://localhost:5173")
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    @GetMapping
    public List<Resource> getAllResources() {
        return resourceService.getAllResources();
    }

    @PostMapping
    public Resource createResource(@RequestBody Resource resource) {
        return resourceService.createResource(resource);
    }

    // ✅ FIXED HERE
    @GetMapping("/{id}")
    public Resource getResourceById(@PathVariable String id) {
        return resourceService.getResourceById(id);
    }

    @PutMapping("/{id}")
    public Resource updateResource(@PathVariable String id, @RequestBody Resource resource) {
        return resourceService.updateResource(id, resource);
    }

    @DeleteMapping("/{id}")
    public String deleteResource(@PathVariable String id) {
        resourceService.deleteResource(id);
        return "Resource deleted successfully";
    }

    @GetMapping("/type/{type}")
    public List<Resource> getResourcesByType(@PathVariable String type) {
        return resourceService.getResourcesByType(type);
    }

    @GetMapping("/location/{location}")
    public List<Resource> getResourcesByLocation(@PathVariable String location) {
        return resourceService.getResourcesByLocation(location);
    }

    @GetMapping("/capacity/{capacity}")
    public List<Resource> getResourcesByCapacity(@PathVariable int capacity) {
        return resourceService.getResourcesByCapacity(capacity);
    }
}