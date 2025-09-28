// components/Leaderboard/Leaderboard.js
import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import OIPImage from '../../assets/R.png';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLeaderboard();
    }, []);

    const loadLeaderboard = async () => {
        try {
            const data = await dataService.getLeaderboard();
            console.log('Leaderboard with avatars:', data);
            setLeaderboard(data);
        } catch (error) {
            console.error('Error loading leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (username) => {
        return username ? username.charAt(0).toUpperCase() : 'U';
    };

    // Функция для отображения аватара
    const renderAvatar = (user) => {
        console.log(`Rendering avatar for ${user.username}:`, {
            hasAvatar: !!user.avatar,
            avatarLength: user.avatar ? user.avatar.length : 0
        });

        if (user.avatar) {
            // Создаем data URL - бэкенд возвращает чистый base64
            const avatarUrl = `data:image/jpeg;base64,${user.avatar}`;

            return (
                <img
                    src={avatarUrl}
                    alt={user.username}
                    className="avatar-small"
                    onError={(e) => {
                        console.error(`Failed to load avatar for ${user.username}`);
                        e.target.style.display = 'none';
                    }}
                    onLoad={(e) => {
                        console.log(`Successfully loaded avatar for ${user.username}`);
                    }}
                />
            );
        }

        // Если аватара нет, показываем placeholder
        return (
            <div className="avatar-placeholder-small">
                {getInitials(user.username)}
            </div>
        );
    };

    if (loading) {
        return <div className="loading">Loading leaderboard...</div>;
    }

    return (
        <div className="leaderboard">
            <div className="leaderboard-header">
                <div className="leaderboard-title-section">
                    <h2 className="leaderboard-title">Leaderboard</h2>
                </div>
                <img src={OIPImage} alt="Leaderboard" className="leaderboard-image" />
            </div>

            <div className="columns-header">
                <div className="column-avatar">Profile</div>
                <div className="column-name">Name</div>
                <div className="column-score">Score</div>
            </div>

            <div className="leaderboard-data">
                {leaderboard.map((user, index) => (
                    <div key={user.id || index} className="data-row">
                        <div className="data-avatar">
                            {renderAvatar(user)}
                        </div>
                        <div className="data-name">{user.username}</div>
                        <div className="data-score">{user.totalScore || 0}</div>
                    </div>
                ))}
            </div>

            {leaderboard.length === 0 && (
                <div className="no-data">
                    <p>No leaderboard data available</p>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;