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

    // ✅ ДОБАВЛЯЕМ ФУНКЦИЮ ДЛЯ ОБНОВЛЕНИЯ ПОЛЬЗОВАТЕЛЯ
    const updateUser = (userData) => {
        console.log('🔄 AuthContext: updating user', {
            hasAvatar: !!userData.avatar,
            avatarLength: userData.avatar ? userData.avatar.length : 0
        });
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const value = {
        user,
        setUser, // ✅ Должен быть в value
        updateUser, // ✅ Добавляем в value
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