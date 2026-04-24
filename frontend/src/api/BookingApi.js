import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api/bookings";

const getAuthHeaders = (token) => ({
    headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
        'Content-Type': 'application/json'
    }
});

// 1. Create a new booking
export const createBooking = async (formData, token) => {
    return await axios.post(API_BASE_URL, formData, getAuthHeaders(token));
};

// 2. Get all bookings (admin) — with optional status filter
export const getAllBookings = async (token, status) => {
    const params = status && status !== 'ALL' ? `?status=${status}` : '';
    return await axios.get(`${API_BASE_URL}${params}`, getAuthHeaders(token));
};

// 3. Get current user's bookings
export const getMyBookings = async (token) => {
    return await axios.get(`${API_BASE_URL}/my`, getAuthHeaders(token));
};

// 4. Approve a booking (admin)
export const approveBooking = async (id, adminRemarks, token) => {
    return await axios.put(
        `${API_BASE_URL}/${id}/approve`,
        { adminRemarks },
        getAuthHeaders(token)
    );
};

// 5. Reject a booking (admin)
export const rejectBooking = async (id, adminRemarks, token) => {
    return await axios.put(
        `${API_BASE_URL}/${id}/reject`,
        { adminRemarks },
        getAuthHeaders(token)
    );
};

// 6. Cancel a booking (user — only approved bookings)
export const cancelBooking = async (id, token) => {
    return await axios.put(
        `${API_BASE_URL}/${id}/cancel`,
        {},
        getAuthHeaders(token)
    );
};

// 7. Delete a booking (admin)
export const deleteBooking = async (id, token) => {
    return await axios.delete(`${API_BASE_URL}/${id}`, getAuthHeaders(token));
};

// 8. Update booking status (legacy — kept for backward compat)
export const updateBookingStatus = async (id, status, note, token) => {
    return await axios.put(
        `${API_BASE_URL}/${id}`,
        { status, adminRemarks: note },
        getAuthHeaders(token)
    );
};