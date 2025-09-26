import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import OIPImage from '../assets/R.png';

const ProfilePage = () => {
    const { user, isAuthenticated, loading } = useAuth();

    // Дополнительная проверка на случай прямого доступа по URL
    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="profile-page">
            {/* Заголовок Profile с картинкой */}
            <div className="profile-header">
                <div className="profile-title-section">
                    <h2 className="profile-title">Profile</h2>
                </div>
                <img src={OIPImage} alt="Profile" className="profile-image" />
            </div>

            <div className="profile-content">
                <div className="profile-layout">
                    {/* Левая часть - аватар и имя */}
                    <div className="profile-left">
                        <div className="avatar-circle">
                            <div className="avatar-placeholder">
                                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                        </div>
                        <div className="username">{user?.username || 'User'}</div>
                    </div>

                    {/* Правая часть - статистика */}
                    <div className="profile-right">
                        <div className="stats-container">
                            <div className="stat-box">
                                <div className="stat-value">1,250</div>
                                <div className="stat-label">Score</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-value">42</div>
                                <div className="stat-label">Victories</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-value">156</div>
                                <div className="stat-label">Total Participation</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;