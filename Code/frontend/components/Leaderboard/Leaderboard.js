import React, { useState, useEffect, useRef } from 'react';
import { dataService } from '../../services/dataService';
import OIPImage from '../../assets/R.png';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [sortedLeaderboard, setSortedLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('desc');
    const [showSortMenu, setShowSortMenu] = useState(false);
    const sortMenuRef = useRef(null);

    useEffect(() => {
        loadLeaderboard();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
                setShowSortMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        sortLeaderboardData();
    }, [leaderboard, sortOrder]);

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

    const sortLeaderboardData = () => {
        const sorted = [...leaderboard].sort((a, b) => {
            const scoreA = a.totalScore || 0;
            const scoreB = b.totalScore || 0;

            if (sortOrder === 'desc') {
                return scoreB - scoreA;
            } else {
                return scoreA - scoreB;
            }
        });
        setSortedLeaderboard(sorted);
    };

    const toggleSortMenu = () => {
        setShowSortMenu(!showSortMenu);
    };

    const handleSortChange = (order) => {
        setSortOrder(order);
        setShowSortMenu(false);
    };

    const getInitials = (username) => {
        return username ? username.charAt(0).toUpperCase() : 'U';
    };

    const renderAvatar = (user) => {
        console.log(`Rendering avatar for ${user.username}:`, {
            hasAvatar: !!user.avatar,
            avatarLength: user.avatar ? user.avatar.length : 0
        });

        if (user.avatar) {
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
                    <div className="sort-container" ref={sortMenuRef}>
                        <button
                            className="filter-btn"
                            onClick={toggleSortMenu}
                            title="Sort options"
                        >
                            <span className="filter-icon">⏷</span>
                            Filter
                        </button>

                        {showSortMenu && (
                            <div className="sort-menu">
                                <div
                                    className={`sort-option ${sortOrder === 'desc' ? 'active' : ''}`}
                                    onClick={() => handleSortChange('desc')}
                                >
                                    <span className="sort-icon">⏷</span>
                                    High to Low
                                </div>
                                <div
                                    className={`sort-option ${sortOrder === 'asc' ? 'active' : ''}`}
                                    onClick={() => handleSortChange('asc')}
                                >
                                    <span className="sort-icon">⏶</span>
                                    Low to High
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <img src={OIPImage} alt="Leaderboard" className="leaderboard-image" />
            </div>

            <div className="columns-header">
                <div className="column-avatar">Profile</div>
                <div className="column-name">Name</div>
                <div className="column-score">Score</div>
            </div>

            <div className="leaderboard-data">
                {sortedLeaderboard.map((user, index) => (
                    <div key={user.id || index} className="data-row">
                        <div className="data-avatar">
                            {renderAvatar(user)}
                        </div>
                        <div className="data-name">{user.username}</div>
                        <div className="data-score">{user.totalScore || 0}</div>
                    </div>
                ))}
            </div>

            {sortedLeaderboard.length === 0 && (
                <div className="no-data">
                    <p>No leaderboard data available</p>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;