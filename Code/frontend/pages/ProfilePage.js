import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AvatarUpload from '../components/Profile/AvatarUpload';
import { userService } from '../services/userService';
import OIPImage from '../assets/R.png';
import Formula1Image from '../assets/formula_1.png';

const ProfilePage = () => {
    const { user, updateUser, isAuthenticated, loading } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [showAvatarUpload, setShowAvatarUpload] = useState(false);

    useEffect(() => {
        const loadProfileData = async () => {
            if (isAuthenticated && user) {
                try {
                    const userData = await userService.getProfile();
                    setProfileData(userData);
                    updateUser(userData);
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
        updateUser(updatedUser);
        setProfileData(updatedUser);
        setShowAvatarUpload(false);
    };

    const handleAvatarClick = () => {
        setShowAvatarUpload(!showAvatarUpload);
    };

    const displayUser = profileData || user;

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
                    {/* Левая часть - аватар и имя */}
                    <div className="profile-left">
                        <div className="avatar-section">
                            <div className="avatar-container" onClick={handleAvatarClick}>
                                <AvatarUpload
                                    currentAvatar={displayUser?.avatar}
                                    onAvatarChange={handleAvatarChange}
                                    showControls={showAvatarUpload}
                                />
                            </div>
                            <div className="username-under-avatar">
                                {displayUser?.username || 'User'}
                            </div>
                        </div>
                    </div>

                    {/* Центральная часть - три прямоугольника */}
                    <div className="profile-stats">
                        <div className="stat-box">
                            <div className="stat-label">Score</div>
                            <div className="stat-value">{displayUser?.totalScore || 0}</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-label">Victories</div>
                            <div className="stat-value">{displayUser?.predictionsWon || 0}</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-label">Total Participation</div>
                            <div className="stat-value">{displayUser?.predictionsMade || 0}</div>
                        </div>
                    </div>

                    {/* Правая часть - картинка Formula 1 */}
                    <div className="profile-image-section">
                        <img
                            src={Formula1Image}
                            alt="Formula 1"
                            className="formula1-image"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;