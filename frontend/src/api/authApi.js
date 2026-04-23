import axios from 'axios';

const API = "http://localhost:8080/api/auth";

export const login = (email, password) => 
    axios.post(`${API}/login`, { email, password });

export const getCurrentUser = (token) => 
    axios.get(`${API}/me`, {
        headers: { Authorization: `Bearer ${token}` }
    });