import axios from "axios";

const BASE_URL = "http://localhost:8080/api/resources";

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getAllResources = () =>
  axios.get(BASE_URL, getAuthHeader());

export const getResourceById = (id) =>
  axios.get(`${BASE_URL}/${id}`, getAuthHeader());

export const createResource = (data) =>
  axios.post(BASE_URL, data, getAuthHeader());

export const updateResource = (id, data) =>
  axios.put(`${BASE_URL}/${id}`, data, getAuthHeader());

export const deleteResource = (id) =>
  axios.delete(`${BASE_URL}/${id}`, getAuthHeader());

export const searchByType = (type) =>
  axios.get(`${BASE_URL}/type/${type}`, getAuthHeader());

export const searchByLocation = (location) =>
  axios.get(`${BASE_URL}/location/${location}`, getAuthHeader());

export const searchByCapacity = (capacity) =>
  axios.get(`${BASE_URL}/capacity/${capacity}`, getAuthHeader());