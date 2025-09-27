// contexts/AuthContext.js
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
            console.log('User loaded from storage:', userData);
        }
        setLoading(false);
    }, []);

    // Исправляем проверку роли - должна быть функцией
    const isAdmin = () => {
        return user?.role === 'ADMIN';
    };

    const login = async (email, password) => {
        try {
            const response = await authService.login(email, password);
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response));
            setUser(response);
            console.log('Login successful, user role:', response.role);
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
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

    // Функция для обновления пользователя
    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const value = {
        user,
        setUser, // ✅ Добавляем setUser
        updateUser, // ✅ И алиас для удобства
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: isAdmin(), // Вызываем функцию
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};