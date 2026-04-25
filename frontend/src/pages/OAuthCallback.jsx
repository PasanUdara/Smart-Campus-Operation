import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OAuthCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            localStorage.setItem('token', token);
            navigate('/');
        } else {
            navigate('/login?error=Authentication failed');
        }
    }, [location, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950">
            <div className="text-white">Completing login...</div>
        </div>
    );
};

export default OAuthCallback;