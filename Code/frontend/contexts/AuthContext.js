import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = authService.getCurrentUser();

        if (token && userData) {
            setUser(userData);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authService.login(email, password);
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response));
            setUser(response);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.response?.data?.error || 'Login failed'
            };
        }
    };

    const register = async (email, password) => {
        try {
            const response = await authService.register(email, password);
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response));
            setUser(response);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.response?.data?.error || 'Registration failed'
            };
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};