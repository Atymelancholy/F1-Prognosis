import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import PredictionModal from './PredictionModal';
import OIPImage from '../../assets/R.png'; // Импортируем ту же картинку

const Calendar = () => {
    const [grandPrix, setGrandPrix] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGp, setSelectedGp] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadGrandPrix();
    }, []);

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

    const handleMakePrediction = (gp) => {
        setSelectedGp(gp);
        setShowModal(true);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            AWAITING: { class: 'status-awaiting', text: 'Awaiting' },
            OPEN: { class: 'status-open', text: 'Predictions Open' },
            CLOSED: { class: 'status-closed', text: 'Predictions Closed' },
            COMPLETED: { class: 'status-completed', text: 'Completed' }
        };

        const config = statusConfig[status] || statusConfig.AWAITING;
        return <span className={`status-badge ${config.class}`}>{config.text}</span>;
    };

    if (loading) {
        return <div className="loading">Loading calendar...</div>;
    }

    return (
        <div className="calendar">
            {/* Заголовок Calendar с картинкой - такой же как в Leaderboard */}
            <div className="calendar-header">
                <div className="calendar-title-section">
                    <h2 className="calendar-title">Calendar</h2>
                </div>
                <img src={OIPImage} alt="Calendar" className="calendar-image" />
            </div>

            {grandPrix.length === 0 ? (
                <div className="no-data">
                    <p>No Grand Prix events available.</p>
                    <p>Check back later or contact administrator.</p>
                </div>
            ) : (
                grandPrix.map((gp) => (
                    <div key={gp.id} className="grand-prix-card">
                        <div className="gp-header">
                            <h3>{gp.name}</h3>
                            {getStatusBadge(gp.status)}
                        </div>
                        <div className="gp-details">
                            <p><strong>Round:</strong> {gp.roundNumber}</p>
                            <p><strong>Circuit:</strong> {gp.circuit}</p>
                            <p><strong>Race:</strong> {new Date(gp.raceTime).toLocaleDateString()}</p>
                            <p><strong>Qualifying:</strong> {new Date(gp.qualifyingTime).toLocaleDateString()}</p>
                        </div>
                        <div className="gp-actions">
                            <button
                                onClick={() => handleMakePrediction(gp)}
                                disabled={gp.status !== 'OPEN'}
                                className="btn-predict"
                            >
                                {gp.status === 'OPEN' ? 'Make Prediction' : 'Predictions Closed'}
                            </button>
                        </div>
                    </div>
                ))
            )}

            {showModal && selectedGp && (
                <PredictionModal
                    grandPrix={selectedGp}
                    onClose={() => setShowModal(false)}
                    onSave={loadGrandPrix}
                />
            )}
        </div>
    );
};

export default Calendar;