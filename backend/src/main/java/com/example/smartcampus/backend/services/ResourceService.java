package com.example.smartcampus.backend.services;

import com.example.smartcampus.backend.models.Resource;
import com.example.smartcampus.backend.repositories.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public Resource createResource(Resource resource) {
        return resourceRepository.save(resource);
    }

    public Optional<Resource> getResourceById(String id) {
        return resourceRepository.findById(id);
    }

    public Resource updateResource(String id, Resource updatedResource) {
        return resourceRepository.findById(id).map(resource -> {
            resource.setName(updatedResource.getName());
            resource.setType(updatedResource.getType());
            resource.setCapacity(updatedResource.getCapacity());
            resource.setLocation(updatedResource.getLocation());
            resource.setAvailabilityWindow(updatedResource.getAvailabilityWindow());
            resource.setStatus(updatedResource.getStatus());

            return resourceRepository.save(resource);
        }).orElseThrow(() -> new RuntimeException("Resource not found"));
    }

    public void deleteResource(String id) {
        resourceRepository.deleteById(id);
    }

    public List<Resource> getResourcesByType(String type) {
        return resourceRepository.findByType(type);
    }

    public List<Resource> getResourcesByLocation(String location) {
        return resourceRepository.findByLocation(location);
    }

    public List<Resource> getResourcesByCapacity(int capacity) {
        return resourceRepository.findByCapacityGreaterThanEqual(capacity);
    }
}