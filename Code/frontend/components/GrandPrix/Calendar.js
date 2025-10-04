import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import PredictionModal from './PredictionModal';
import ResultsModal from './ResultsModal';
import GrandPrixCard from './GrandPrixCard';
import OIPImage from '../../assets/R.png';

const Calendar = () => {
    const [grandPrix, setGrandPrix] = useState([]);
    const [filteredGp, setFilteredGp] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGp, setSelectedGp] = useState(null);
    const [showPredictionModal, setShowPredictionModal] = useState(false);
    const [showResultsModal, setShowResultsModal] = useState(false);
    const [activeFilter, setActiveFilter] = useState('ALL');

    useEffect(() => {
        loadGrandPrix();
    }, []);

    useEffect(() => {
        filterGrandPrix();
    }, [grandPrix, activeFilter]);

    const loadGrandPrix = async () => {
        try {
            const data = await dataService.getGrandPrix();
            setGrandPrix(data);
        } catch (error) {
            console.error('Error loading grand prix:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterGrandPrix = () => {
        if (activeFilter === 'ALL') {
            setFilteredGp(grandPrix);
        } else if (activeFilter === 'OPEN') {
            setFilteredGp(grandPrix.filter(gp => gp.status === 'OPEN'));
        } else if (activeFilter === 'COMPLETED') {
            setFilteredGp(grandPrix.filter(gp => gp.status === 'COMPLETED' || gp.status === 'CLOSED'));
        }
    };

    const handleCardAction = (gp) => {
        if (gp.status === 'OPEN') {
            setSelectedGp(gp);
            setShowPredictionModal(true);
        } else if (gp.status === 'CLOSED' || gp.status === 'COMPLETED') {
            setSelectedGp(gp);
            setShowResultsModal(true);
        }
    };

    const handleSavePrediction = () => {
        loadGrandPrix();
    };

    if (loading) {
        return <div className="loading">Loading calendar...</div>;
    }

    return (
        <div className="calendar-page">
            {/* Заголовок Calendar с картинкой */}
            <div className="calendar-header">
                <div className="calendar-title-section">
                    <h2 className="calendar-title">Calendar</h2>
                </div>
                <img src={OIPImage} alt="Calendar" className="calendar-image" />
            </div>

            {/* Секция с подзаголовком и кнопками фильтра */}
            <div className="calendar-filter-section">
                <div className="calendar-subtitle">
                    2025 Formula 1 World Championship - 24 Rounds
                </div>

                <div className="filter-buttons">
                    <button
                        className={`filter-btn ${activeFilter === 'ALL' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('ALL')}
                    >
                        All
                    </button>
                    <button
                        className={`filter-btn ${activeFilter === 'OPEN' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('OPEN')}
                    >
                        Open
                    </button>
                    <button
                        className={`filter-btn ${activeFilter === 'COMPLETED' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('COMPLETED')}
                    >
                        Completed
                    </button>
                </div>
            </div>

            {/* Сетка карточек */}
            <div className="calendar-grid">
                {filteredGp.length === 0 ? (
                    <div className="no-data">
                        <p>No Grand Prix events available.</p>
                        <p>Check back later or contact administrator.</p>
                    </div>
                ) : (
                    filteredGp.map((gp) => (
                        <GrandPrixCard
                            key={gp.id}
                            gp={gp}
                            onActionClick={handleCardAction}
                        />
                    ))
                )}
            </div>

            {/* Модальное окно для прогнозов */}
            {showPredictionModal && selectedGp && (
                <PredictionModal
                    grandPrix={selectedGp}
                    onClose={() => setShowPredictionModal(false)}
                    onSave={handleSavePrediction}
                />
            )}

            {/* Модальное окно для результатов */}
            {showResultsModal && selectedGp && (
                <ResultsModal
                    grandPrix={selectedGp}
                    onClose={() => setShowResultsModal(false)}
                />
            )}
        </div>
    );
};

export default Calendar;