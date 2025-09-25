// pages/ProfilePage.js
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
    const { user } = useAuth();

    return (
        <div className="profile-page">
            <h1>👤 User Profile</h1>
            <div className="profile-card">
                <div className="profile-info">
                    <p><strong>Username:</strong> {user?.username || 'N/A'}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Member since:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;