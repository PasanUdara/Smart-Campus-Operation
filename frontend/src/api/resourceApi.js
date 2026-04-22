import axios from "axios";

const BASE_URL = "http://localhost:8081/api/resources";

export const getAllResources = () => axios.get(BASE_URL);

export const getResourceById = (id) => axios.get(`${BASE_URL}/${id}`);

export const createResource = (resourceData) => axios.post(BASE_URL, resourceData);

export const updateResource = (id, resourceData) =>
  axios.put(`${BASE_URL}/${id}`, resourceData);

export const deleteResource = (id) => axios.delete(`${BASE_URL}/${id}`);