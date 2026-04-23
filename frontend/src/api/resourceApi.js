import axios from "axios";

const BASE_URL = "http://localhost:8080/api/resources";

// =========================
// BASIC CRUD OPERATIONS
// =========================

export const getAllResources = () => axios.get(BASE_URL);

export const getResourceById = (id) => axios.get(`${BASE_URL}/${id}`);

export const createResource = (resourceData) =>
  axios.post(BASE_URL, resourceData);

export const updateResource = (id, resourceData) =>
  axios.put(`${BASE_URL}/${id}`, resourceData);

export const deleteResource = (id) =>
  axios.delete(`${BASE_URL}/${id}`);

// =========================
// SEARCH / FILTER OPERATIONS
// =========================

export const searchByType = (type) =>
  axios.get(`${BASE_URL}/type/${type}`);

export const searchByLocation = (location) =>
  axios.get(`${BASE_URL}/location/${location}`);

export const searchByCapacity = (capacity) =>
  axios.get(`${BASE_URL}/capacity/${capacity}`);