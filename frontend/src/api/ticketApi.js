import axios from 'axios';
const API = "http://localhost:8080/api/tickets";

export const createTicket = (data) => axios.post(API, data);
export const getAllTickets = () => axios.get(API);
export const deleteTicket = (id) => axios.delete(`${API}/${id}`);

// Status, Assignment සහ Resolution Notes සඳහා
export const updateStatus = (id, status, note, techId) => 
    axios.put(`${API}/${id}`, null, { params: { status, note, techId } });

// Comment Operations
export const addComment = (id, authorId, text) => axios.post(`${API}/${id}/comments`, { authorId, text });
export const editComment = (id, commentId, authorId, text) => axios.put(`${API}/${id}/comments/${commentId}`, { authorId, text });
export const deleteComment = (id, commentId) => axios.delete(`${API}/${id}/comments/${commentId}`);