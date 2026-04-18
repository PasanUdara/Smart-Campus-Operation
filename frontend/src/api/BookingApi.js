import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api/bookings";

// 1. create a new booking
export const createBooking = async (formData) => {
    return await axios.post(API_BASE_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

// 2. get all bookings
export const getAllBookings = async () => {
    return await axios.get(API_BASE_URL);
};

// 3. update booking status (Accept/Reject)
export const updateBookingStatus = async (id, status, note) => {
    return await axios.put(`${API_BASE_URL}/${id}`, null, {
        params: { status, note }
    });
};

// 4. delete a booking (this was missing, hence the error)
export const deleteBooking = async (id) => {
    return await axios.delete(`${API_BASE_URL}/${id}`);
};