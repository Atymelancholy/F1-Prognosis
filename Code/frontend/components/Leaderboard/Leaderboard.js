import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';

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

    if (loading) {
        return <div className="loading">Loading leaderboard...</div>;
    }

    return (
        <div className="leaderboard">
            <h2>Leaderboard</h2>
            <table className="leaderboard-table">
                <thead>
                <tr>
                    <th>Rank</th>
                    <th>Username</th>
                    <th>Score</th>
                </tr>
                </thead>
                <tbody>
                {leaderboard.map((user, index) => (
                    <tr key={user.username}>
                        <td>{index + 1}</td>
                        <td>{user.username}</td>
                        <td>{user.totalScore}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;