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
            setLeaderboard(data);
        } catch (error) {
            console.error('Error loading leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    // Функция для получения инициалов пользователя
    const getInitials = (username) => {
        return username ? username.charAt(0).toUpperCase() : 'U';
    };

    // Функция для получения цвета по умолчанию на основе имени
    const getAvatarColor = (username) => {
        const colors = [
            '#e10600', '#ff6b6b', '#4ecdc4', '#45b7d1',
            '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'
        ];
        const index = username ? username.charCodeAt(0) % colors.length : 0;
        return colors[index];
    };

    if (loading) {
        return <div className="loading">Loading leaderboard...</div>;
    }

    return (
        <div className="leaderboard">
            {/* Заголовок */}
            <div className="leaderboard-header">
                <div className="leaderboard-title-section">
                    <h2 className="leaderboard-title">Leaderboard</h2>
                </div>
                <img src={OIPImage} alt="Leaderboard" className="leaderboard-image" />
            </div>

            {/* Заголовки колонок */}
            <div className="columns-header">
                <div className="column-profile">Profile</div>
                <div className="column-name">Name</div>
                <div className="column-score">Score</div>
            </div>

            {/* Данные таблицы */}
            <div className="leaderboard-data">
                {leaderboard.map((user, index) => (
                    <div key={user.id || index} className="data-row">
                        <div className="data-profile">
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.username}
                                    className="avatar-small"
                                />
                            ) : (
                                <div
                                    className="avatar-placeholder-small"
                                    style={{ backgroundColor: getAvatarColor(user.username) }}
                                >
                                    {getInitials(user.username)}
                                </div>
                            )}
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