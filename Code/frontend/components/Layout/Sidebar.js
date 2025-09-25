import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSignIn = () => {
        navigate('/login');
    };

    // Функция для проверки активного пути
    const isActive = (path) => {
        return location.pathname === path;
    };

    // Основные навигационные элементы
    const navItems = [
        { path: '/leaderboard', label: 'Leaderboard' },
        { path: '/', label: 'Calendar' },
        { path: '/profile', label: 'Profile' }
    ];

    return (
        <nav className="sidebar">
            <div className="sidebar-container">
                <Link to="/" className="sidebar-logo">
                    🏎️ F1 Prognosis
                </Link>

                <div className="sidebar-menu">
                    {navItems.map((item) => (
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

                {/* Блок с приветствием (только для авторизованных) */}
                {isAuthenticated && (
                    <div className="sidebar-user">
                        <span className="link-icon">👋</span>
                        Welcome, {user?.username || user?.email}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Sidebar;