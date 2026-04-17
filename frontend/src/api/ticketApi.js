import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api/tickets";

// 1. ටිකට් එකක් සෑදීම
export const createTicket = async (formData) => {
    return await axios.post(API_BASE_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

// 2. සියලුම ටිකට් ලබාගැනීම
export const getAllTickets = async () => {
    return await axios.get(API_BASE_URL);
};

// 3. ටිකට් එකක Status එක (Reject/Resolve) Update කිරීම
export const updateTicketStatus = async (id, status, note, technicianId = "") => {
    return await axios.put(`${API_BASE_URL}/${id}`, null, {
        params: { status, note, technicianId }
    });
};

// 4. ටිකට් එකක් මැකීම (මෙය අමතක වූ නිසා තමයි Error එක ආවේ)
export const deleteTicket = async (id) => {
    return await axios.delete(`${API_BASE_URL}/${id}`);
};