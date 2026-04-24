import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginApi, getCurrentUser } from '../api/authApi';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (token) {
            loadUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    const loadUser = async () => {
        console.log("loadUser called - token exists:", !!token); 
        try {
            const response = await getCurrentUser(token);
            console.log("getCurrentUser response:", response.data); 

            if (response.data.authenticated) {
                setUser(response.data);
                localStorage.setItem(
                 "user",
                 JSON.stringify(response.data)
                );
                console.log("User set successfully:", response.data); 

            } else {
                console.log("Not authenticated, logging out"); 
                logout();
            }
        } catch (err) {
            console.error('Failed to load user:', err);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            setError(null);
            const response = await loginApi(email, password);
            
            if (response.data.success) {
                const { token: newToken, ...userData } = response.data;
                localStorage.setItem('token', newToken);
                setToken(newToken);
                setUser(userData);
                return { success: true };
            } else {
                setError(response.data.message);
                return { success: false, message: response.data.message };
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed';
            setError(message);
            return { success: false, message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
    };

    const isAdmin = () => {
        return user?.roles?.includes('ROLE_ADMIN') || false;
    };
    
    const value = {
        user,
        token,
        loading,
        error,
        login,
        logout,
        isAdmin,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};