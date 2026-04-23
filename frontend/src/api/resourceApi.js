import axios from "axios";

const BASE_URL = "http://localhost:8081/api/resources";

// =========================
// BASIC CRUD OPERATIONS
// =========================

// Get all resources
export const getAllResources = () => axios.get(BASE_URL);

// Get resource by ID
export const getResourceById = (id) => axios.get(`${BASE_URL}/${id}`);

// Create new resource
export const createResource = (resourceData) =>
  axios.post(BASE_URL, resourceData);

// Update resource
export const updateResource = (id, resourceData) =>
  axios.put(`${BASE_URL}/${id}`, resourceData);

// Delete resource
export const deleteResource = (id) =>
  axios.delete(`${BASE_URL}/${id}`);


// =========================
// SEARCH / FILTER OPERATIONS
// =========================

// Search by type
export const searchByType = (type) =>
  axios.get(`${BASE_URL}/type/${type}`);

// Search by location
export const searchByLocation = (location) =>
  axios.get(`${BASE_URL}/location/${location}`);

// Search by capacity (>= value)
export const searchByCapacity = (capacity) =>
  axios.get(`${BASE_URL}/capacity/${capacity}`);