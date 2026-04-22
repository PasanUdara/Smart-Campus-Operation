import axios from 'axios';

const API = "http://localhost:8080/api/notifications";

export const getNotifications = (token) => 
    axios.get(API, {
        headers: { Authorization: `Bearer ${token}` }
    });

export const markAsRead = (token, notificationId) => 
    axios.patch(`${API}/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });