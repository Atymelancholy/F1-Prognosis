import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
    const { user, isAuthenticated, isAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSignOutClick = () => {
        navigate('/logout-confirm');
    };

    const handleSignIn = () => {
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    const isSignOutActive = location.pathname === '/logout-confirm';
    const isSignInActive = location.pathname === '/login';

    const publicNavItems = [
        { path: '/', label: 'Calendar' },
        { path: '/leaderboard', label: 'Leaderboard' }
    ];

    const userNavItems = [
        { path: '/profile', label: 'Profile'}
    ];

    const adminNavItems = [
        { path: '/admin/results', label: 'Manage Results' }
    ];

    return (
        <nav className="sidebar">
            <div className="sidebar-container">
                <div className="sidebar-logo">Menu</div>

                <div className="sidebar-menu">
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

                    {isAuthenticated ? (
                        <button
                            onClick={handleSignOutClick}
                            className={`sidebar-link sidebar-signout ${isSignOutActive ? 'active' : ''}`}
                        >
                            <span className="link-icon"></span>
                            <span className="link-text">Sign Out</span>
                        </button>
                    ) : (
                        <button
                            onClick={handleSignIn}
                            className={`sidebar-link sidebar-signin ${isSignInActive ? 'active' : ''}`}
                        >
                            <span className="link-icon"></span>
                            <span className="link-text">Sign In</span>
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Sidebar;