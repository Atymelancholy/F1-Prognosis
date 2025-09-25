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

    const handleFilterClick = () => {
        console.log('Filter button clicked');
    };

    if (loading) {
        return <div className="loading">Loading leaderboard...</div>;
    }

    return (
        <div className="leaderboard">
            <div className="leaderboard-header">
                <div className="leaderboard-title-section">
                    <h2 className="leaderboard-title">Leaderboard</h2>
                    <button className="filter-btn" onClick={handleFilterClick}>
                        <span className="filter-icon">⏷</span>
                        Filter
                    </button>
                </div>
                <img src={OIPImage} alt="Trophy" className="leaderboard-image" />
            </div>

            {/* Строка с заголовками колонок */}
            <div className="columns-header">
                <span className="column-profile">Profile</span>
                <span className="column-name">Name</span>
                <span className="column-score">Score</span>
            </div>

            <table className="leaderboard-table">
                <thead>
                <tr>
                    <th className="rank-header">RANK</th>
                    <th className="profile-header">PROFILE</th>
                    <th className="name-header">NAME</th>
                    <th className="score-header">SCORE</th>
                </tr>
                </thead>
                <tbody>
                {leaderboard.map((user, index) => (
                    <tr key={user.username}>
                        <td className="rank-cell">{index + 1}</td>
                        <td className="profile-cell">
                            <div className="avatar-placeholder">👤</div>
                        </td>
                        <td className="name-cell">{user.username}</td>
                        <td className="score-cell">{user.totalScore}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;