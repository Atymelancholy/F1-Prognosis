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

    // Функция для проверки активного пути
    const isActive = (path) => {
        return location.pathname === path;
    };

    // Навигационные элементы
    const navItems = [
        { path: '/', icon: '📅', label: 'Calendar' },
        { path: '/leaderboard', icon: '🏆', label: 'Leaderboard' }
    ];

    // Auth элементы
    const authItems = [
        { path: '/login', icon: '🔑', label: 'Login' },
        { path: '/register', icon: '📝', label: 'Register' }
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
                </div>

                <div className="sidebar-auth">
                    {isAuthenticated ? (
                        <>
                            <div className="sidebar-user">
                                <span className="link-icon">👋</span>
                                Welcome, {user?.username}
                            </div>
                            <button onClick={handleLogout} className="sidebar-logout">
                                <span className="link-icon">🚪</span>
                                <span className="link-text">Logout</span>
                            </button>
                        </>
                    ) : (
                        authItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                            >
                                <span className="link-icon">{item.icon}</span>
                                <span className="link-text">{item.label}</span>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Sidebar;