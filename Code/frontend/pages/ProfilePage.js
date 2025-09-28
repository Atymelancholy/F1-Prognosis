// pages/ProfilePage.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AvatarUpload from '../components/Profile/AvatarUpload';
import { userService } from '../services/userService';
import OIPImage from '../assets/R.png';

const ProfilePage = () => {
    const { user, updateUser, isAuthenticated, loading } = useAuth(); // Используем updateUser вместо setUser
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        console.log('👤 ProfilePage: user context changed', {
            hasUser: !!user,
            userAvatar: user?.avatar ? 'has avatar' : 'no avatar'
        });
    }, [user]);

    // Загружаем полные данные профиля при входе
    useEffect(() => {
        const loadProfileData = async () => {
            if (isAuthenticated && user) {
                try {
                    console.log('📥 Loading profile data...');
                    const userData = await userService.getProfile();
                    console.log('✅ Profile data loaded:', {
                        hasAvatar: !!userData.avatar,
                        avatarLength: userData.avatar ? userData.avatar.length : 0
                    });
                    setProfileData(userData);
                    updateUser(userData); // Обновляем контекст
                } catch (error) {
                    console.error('❌ Error loading profile:', error);
                    setProfileData(user);
                }
            }
        };

        loadProfileData();
    }, [isAuthenticated, user, updateUser]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const handleAvatarChange = (updatedUser) => {
        console.log('🔄 ProfilePage: handleAvatarChange called', {
            hasUpdatedAvatar: !!updatedUser.avatar,
            updatedAvatarLength: updatedUser.avatar ? updatedUser.avatar.length : 0
        });
        updateUser(updatedUser); // Используем updateUser
        setProfileData(updatedUser);
    };

    // Используем profileData если есть, иначе user из контекста
    const displayUser = profileData || user;

    console.log('🎨 ProfilePage render:', {
        displayUserAvatar: displayUser?.avatar ? 'has avatar' : 'no avatar',
        displayUser: displayUser?.username
    });

    return (
        <div className="profile-page">
            <div className="profile-header">
                <div className="profile-title-section">
                    <h2 className="profile-title">Profile</h2>
                </div>
                <img src={OIPImage} alt="Profile" className="profile-image" />
            </div>

            <div className="profile-content">
                <div className="profile-layout">
                    <div className="profile-left">
                        <div className="avatar-section">
                            <AvatarUpload
                                currentAvatar={displayUser?.avatar}
                                onAvatarChange={handleAvatarChange}
                            />
                        </div>

                        <div className="user-info">
                            <div className="username">{displayUser?.username || 'User'}</div>
                            <div className="email">{displayUser?.email}</div>
                            <div className="role-badge">{displayUser?.role}</div>
                        </div>
                    </div>

                    <div className="profile-right">
                        <div className="stats-container">
                            <div className="stat-box">
                                <div className="stat-value">{displayUser?.totalScore || 0}</div>
                                <div className="stat-label">Total Score</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-value">{displayUser?.predictionsMade || 0}</div>
                                <div className="stat-label">Predictions Made</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-value">{displayUser?.predictionsWon || 0}</div>
                                <div className="stat-label">Predictions Won</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-value">{displayUser?.correctPodiums || 0}</div>
                                <div className="stat-label">Correct Podiums</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-value">{displayUser?.correctPolePositions || 0}</div>
                                <div className="stat-label">Correct Pole Positions</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-value">{displayUser?.correctFastestLaps || 0}</div>
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