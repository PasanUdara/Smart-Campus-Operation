import axios from 'axios';
const API = "http://localhost:8080/api/tickets";

// Helper to get token from localStorage
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createTicket = (data) => axios.post(API, data, { headers: getAuthHeader() });
export const getAllTickets = () => axios.get(API, { headers: getAuthHeader() });
export const deleteTicket = (id) => axios.delete(`${API}/${id}`, { headers: getAuthHeader() });

// Status, Assignment and Resolution Notes 
export const updateStatus = (id, status, note, techId) => 
    axios.put(`${API}/${id}`, null, { 
        params: { status, note, techId },
        headers: getAuthHeader()
    });

// Comment Operations
export const addComment = (id, authorId, text) => axios.post(`${API}/${id}/comments`, 
    { authorId, text }, 
    { headers: getAuthHeader() }
);
export const editComment = (id, commentId, authorId, text) => axios.put(`${API}/${id}/comments/${commentId}`, 
    { authorId, text }, 
    { headers: getAuthHeader() }
);
export const deleteComment = (id, commentId) => axios.delete(`${API}/${id}/comments/${commentId}`, 
    { headers: getAuthHeader() }
);