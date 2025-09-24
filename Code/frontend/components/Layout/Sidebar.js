import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="sidebar">
            <div className="sidebar-container">
                <Link to="/" className="sidebar-logo">
                    🏎️ F1 Prognosis
                </Link>

                <div className="sidebar-menu">
                    <Link to="/" className="sidebar-link">
                        📅 Calendar
                    </Link>
                    <Link to="/leaderboard" className="sidebar-link">
                        🏆 Leaderboard
                    </Link>
                </div>

                <div className="sidebar-auth">
                    {isAuthenticated ? (
                        <>
                            <div className="sidebar-user">
                                Welcome, {user?.username}
                            </div>
                            <button onClick={handleLogout} className="sidebar-logout">
                                🚪 Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="sidebar-link">
                                🔑 Login
                            </Link>
                            <Link to="/register" className="sidebar-link">
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