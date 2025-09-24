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

    return (
        <nav className="sidebar">
            <div className="sidebar-container">
                <Link to="/" className="sidebar-logo">
                    🏎️ F1 Prognosis
                </Link>

                <div className="sidebar-menu">
                    <Link
                        to="/"
                        className={`sidebar-link ${isActive('/') ? 'active' : ''}`}
                    >
                        📅 Calendar
                    </Link>
                    <Link
                        to="/leaderboard"
                        className={`sidebar-link ${isActive('/leaderboard') ? 'active' : ''}`}
                    >
                        🏆 Leaderboard
                    </Link>
                </div>

                <div className="sidebar-auth">
                    {isAuthenticated ? (
                        <>
                            <div className="sidebar-user">
                                👋 Welcome, {user?.username}
                            </div>
                            <button onClick={handleLogout} className="sidebar-logout">
                                🚪 Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className={`sidebar-link ${isActive('/login') ? 'active' : ''}`}
                            >
                                🔑 Login
                            </Link>
                            <Link
                                to="/register"
                                className={`sidebar-link ${isActive('/register') ? 'active' : ''}`}
                            >
                                📝 Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Sidebar;