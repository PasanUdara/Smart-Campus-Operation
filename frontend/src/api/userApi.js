import axios from 'axios';

const API = "http://localhost:8080/api/users";

export const getAllUsers = (token) => 
    axios.get(API, {
        headers: { Authorization: `Bearer ${token}` }
    });

export const deleteUser = (token, userId) => 
    axios.delete(`${API}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });