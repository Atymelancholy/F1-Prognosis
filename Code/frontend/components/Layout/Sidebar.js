// components/Layout/Sidebar.js
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSignIn = () => {
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    // Основные навигационные элементы для всех пользователей
    const publicNavItems = [
        { path: '/', label: 'Calendar', icon: '📅' },
        { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' }
    ];

    // Навигационные элементы только для обычных пользователей
    const userNavItems = [
        { path: '/profile', label: 'Profile', icon: '👤' }
    ];

    // Навигационные элементы для администратора
    const adminNavItems = [
        { path: '/admin/results', label: 'Manage Results', icon: '🏁' }
    ];

    return (
        <nav className="sidebar">
            <div className="sidebar-container">
                <div className="sidebar-logo">
                    Menu
                </div>

                <div className="sidebar-menu">
                    {/* Публичные пункты меню */}
                    {publicNavItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                        >
                            <span className="link-icon">{item.icon}</span>
                            <span className="link-text">{item.label}</span>
                        </Link>
                    ))}

                    {/* Пункты меню для обычных пользователей */}
                    {isAuthenticated && !isAdmin && userNavItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                        >
                            <span className="link-icon">{item.icon}</span>
                            <span className="link-text">{item.label}</span>
                        </Link>
                    ))}

                    {/* Пункты меню для администратора */}
                    {isAuthenticated && isAdmin && adminNavItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                        >
                            <span className="link-icon">{item.icon}</span>
                            <span className="link-text">{item.label}</span>
                        </Link>
                    ))}

                    {/* Динамическая кнопка Sign Out / Sign In */}
                    {isAuthenticated ? (
                        <button
                            onClick={handleLogout}
                            className="sidebar-link sidebar-signout"
                        >
                            <span className="link-icon">🚪</span>
                            <span className="link-text">Sign Out</span>
                        </button>
                    ) : (
                        <button
                            onClick={handleSignIn}
                            className="sidebar-link sidebar-signin"
                        >
                            <span className="link-icon">🔑</span>
                            <span className="link-text">Sign In</span>
                        </button>
                    )}
                </div>

                {/* Блок с приветствием */}
                {isAuthenticated && (
                    <div className="sidebar-user">
                        <span className="link-icon">👋</span>
                        Welcome, {user?.username || user?.email}
                        {isAdmin && <span style={{color: '#e10600', marginLeft: '5px'}}>(Admin)</span>}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Sidebar;