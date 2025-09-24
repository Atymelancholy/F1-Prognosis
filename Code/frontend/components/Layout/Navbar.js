import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    🏎️ F1 Prognosis
                </Link>

                <div className="nav-menu">
                    <Link to="/" className="nav-link">Calendar</Link>
                    <Link to="/leaderboard" className="nav-link">Leaderboard</Link>

                    {isAuthenticated ? (
                        <div className="nav-auth">
                            <span className="nav-user">Welcome, {user?.username}</span>
                            <button onClick={handleLogout} className="nav-logout">Logout</button>
                        </div>
                    ) : (
                        <div className="nav-auth">
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="nav-link">Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;