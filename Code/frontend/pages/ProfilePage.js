// pages/ProfilePage.js
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AvatarUpload from '../components/Profile/AvatarUpload';
import OIPImage from '../assets/R.png';

const ProfilePage = () => {
    const { user, setUser, isAuthenticated, loading } = useAuth(); // Добавьте setUser

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Функция для обновления пользователя после загрузки аватара
    const handleAvatarChange = (updatedUser) => {
        setUser(updatedUser); // Обновляем пользователя в контексте
    };

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
                    {/* Левая часть - аватар и загрузка */}
                    <div className="profile-left">
                        <div className="avatar-section">
                            <AvatarUpload
                                currentAvatar={user?.avatar}
                                onAvatarChange={handleAvatarChange} // Передаем функцию
                            />
                        </div>

                        <div className="user-info">
                            <div className="username">{user?.username || 'User'}</div>
                            <div className="email">{user?.email}</div>
                            <div className="role-badge">{user?.role}</div>
                        </div>
                    </div>

                    {/* Правая часть - статистика */}
                    <div className="profile-right">
                        <div className="stats-container">
                            <div className="stat-box">
                                <div className="stat-value">{user?.totalScore || 0}</div>
                                <div className="stat-label">Total Score</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-value">{user?.predictionsMade || 0}</div>
                                <div className="stat-label">Predictions Made</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-value">{user?.predictionsWon || 0}</div>
                                <div className="stat-label">Predictions Won</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-value">{user?.correctPodiums || 0}</div>
                                <div className="stat-label">Correct Podiums</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-value">{user?.correctPolePositions || 0}</div>
                                <div className="stat-label">Correct Pole Positions</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-value">{user?.correctFastestLaps || 0}</div>
                                <div className="stat-label">Correct Fastest Laps</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;