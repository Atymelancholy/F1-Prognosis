import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import OIPImage from '../../assets/R.png';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [filteredLeaderboard, setFilteredLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [sortOrder, setSortOrder] = useState('desc'); // 'desc' или 'asc'

    useEffect(() => {
        loadLeaderboard();
    }, []);

    useEffect(() => {
        // При изменении исходных данных или порядка сортировки - применяем фильтр
        sortLeaderboard();
    }, [leaderboard, sortOrder]);

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

    const sortLeaderboard = () => {
        const sorted = [...leaderboard].sort((a, b) => {
            if (sortOrder === 'desc') {
                return b.totalScore - a.totalScore; // По убыванию
            } else {
                return a.totalScore - b.totalScore; // По возрастанию
            }
        });
        setFilteredLeaderboard(sorted);
    };

    const handleFilterClick = () => {
        setShowFilterModal(true);
    };

    const handleSortOrderChange = (order) => {
        setSortOrder(order);
        setShowFilterModal(false);
    };

    const closeModal = () => {
        setShowFilterModal(false);
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

            {/* Данные таблицы */}
            <div className="leaderboard-data">
                {filteredLeaderboard.map((user, index) => (
                    <div key={user.username} className="data-row">
                        <div className="data-profile">
                            <div className="avatar-placeholder">👤</div>
                        </div>
                        <div className="data-name">{user.username}</div>
                        <div className="data-score">{user.totalScore}</div>
                    </div>
                ))}
            </div>

            {/* Модальное окно фильтра */}
            {showFilterModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Sort by Score</h3>
                            <button onClick={closeModal} className="modal-close">×</button>
                        </div>
                        <div className="modal-body">
                            <div className="filter-options">
                                <button
                                    className={`filter-option ${sortOrder === 'desc' ? 'active' : ''}`}
                                    onClick={() => handleSortOrderChange('desc')}
                                >
                                    <span className="option-icon">⬇️</span>
                                    <span className="option-text">
                                        <strong>Descending</strong>
                                        <span>Highest to Lowest</span>
                                    </span>
                                </button>
                                <button
                                    className={`filter-option ${sortOrder === 'asc' ? 'active' : ''}`}
                                    onClick={() => handleSortOrderChange('asc')}
                                >
                                    <span className="option-icon">⬆️</span>
                                    <span className="option-text">
                                        <strong>Ascending</strong>
                                        <span>Lowest to Highest</span>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;