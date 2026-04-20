import axios from 'axios';
const API = "http://localhost:8080/api/tickets";

export const createTicket = (data) => axios.post(API, data);
export const getAllTickets = () => axios.get(API);
export const updateStatus = (id, status, note, techId) => axios.put(`${API}/${id}`, null, { params: { status, note, techId } });
export const deleteTicket = (id) => axios.delete(`${API}/${id}`);

export const addComment = (id, authorId, text) => axios.post(`${API}/${id}/comments`, { authorId, text });

// ✅ FIXED: PUT request properly sending data
export const editComment = (id, commentId, authorId, text) => axios.put(`${API}/${id}/comments/${commentId}`, { authorId, text });

export const deleteComment = (id, commentId) => axios.delete(`${API}/${id}/comments/${commentId}`);