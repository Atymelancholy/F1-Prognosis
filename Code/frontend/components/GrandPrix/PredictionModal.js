import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { useAuth } from '../../contexts/AuthContext';
import './PredictionModal.css'; // Создадим отдельный CSS файл

const PredictionModal = ({ grandPrix, onClose, onSave }) => {
    const [prediction, setPrediction] = useState({
        polePositionDriver: '',
        fastestLapDriver: '',
        tenthPlaceDriver: '',
        dnfDriver: '',
        p1Driver: '',
        p2Driver: '',
        p3Driver: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [existingPrediction, setExistingPrediction] = useState(null);

    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            loadExistingPrediction();
        }
    }, [grandPrix.id, isAuthenticated]);

    const loadExistingPrediction = async () => {
        try {
            const existing = await dataService.getPrediction(grandPrix.id);
            if (existing) {
                setPrediction({
                    polePositionDriver: existing.polePositionDriver || '',
                    fastestLapDriver: existing.fastestLapDriver || '',
                    tenthPlaceDriver: existing.tenthPlaceDriver || '',
                    dnfDriver: existing.dnfDriver || '',
                    p1Driver: existing.p1Driver || '',
                    p2Driver: existing.p2Driver || '',
                    p3Driver: existing.p3Driver || ''
                });
                setExistingPrediction(existing);
            }
        } catch (error) {
            console.log('No existing prediction found');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await dataService.savePrediction({
                grandPrixId: grandPrix.id,
                ...prediction
            });
            onSave();
            onClose();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to save prediction');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setPrediction(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const drivers = [
        'VERSTAPPEN', 'PEREZ', 'HAMILTON', 'RUSSELL',
        'LECLERC', 'SAINZ', 'NORRIS', 'PIASTRI',
        'ALONSO', 'STROLL', 'GASLY', 'OCON',
        'ALBON', 'SARGEANT', 'BOTTAS', 'ZHOU',
        'MAGNUSSEN', 'HULKENBERG', 'TSUNODA', 'RICCIARDO'
    ];

    const formatRaceDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (!isAuthenticated) {
        return (
            <div className="modal-overlay">
                <div className="modal">
                    <div className="modal-header">
                        <h3>Login Required</h3>
                        <button onClick={onClose} className="modal-close">×</button>
                    </div>
                    <div className="modal-body">
                        <p>Please log in to make predictions.</p>
                        <button onClick={onClose} className="btn">Close</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="prediction-modal-overlay">
            <div className="prediction-modal">
                {/* Хедер с заголовком и кнопками */}
                <div className="prediction-modal-header">
                    <h2 className="prediction-modal-title">Make Your Predictions</h2>
                    <div className="prediction-modal-actions">
                        <button
                            onClick={onClose}
                            className="btn-back"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="btn-confirm"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Confirm'}
                        </button>
                    </div>
                </div>

                {/* Информация о гонке */}
                <div className="gp-info-section">
                    <div className="gp-main-info">
                        <span className="gp-name">{grandPrix.name}</span>
                        <span className="gp-details">
                            Round {grandPrix.roundNumber} · {formatRaceDate(grandPrix.raceTime)}
                        </span>
                    </div>
                    <div className="gp-circuit">{grandPrix.circuit}</div>
                </div>

                {/* Бейдж с временем окончания */}
                <div className="deadline-badge">
                    Predictions close: {formatRaceDate(grandPrix.raceTime)}
                </div>

                {/* Основной контент с двумя колонками */}
                <div className="prediction-content">
                    <form onSubmit={handleSubmit} className="prediction-form-two-column">

                        {/* Левая колонка */}
                        <div className="prediction-column">
                            {/* Pole Position */}
                            <div className="prediction-category">
                                <h3 className="category-title"># Pole Position</h3>
                                <p className="category-description">
                                    Who will set the fastest time in Qualifying?
                                </p>
                                <select
                                    value={prediction.polePositionDriver}
                                    onChange={(e) => handleInputChange('polePositionDriver', e.target.value)}
                                    className="prediction-select"
                                >
                                    <option value="">Select Driver</option>
                                    {drivers.map(driver => (
                                        <option key={driver} value={driver}>{driver}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Fastest Lap */}
                            <div className="prediction-category">
                                <h3 className="category-title">Fastest Lap</h3>
                                <p className="category-description">
                                    Who will set the fastest lap during the Race?
                                </p>
                                <select
                                    value={prediction.fastestLapDriver}
                                    onChange={(e) => handleInputChange('fastestLapDriver', e.target.value)}
                                    className="prediction-select"
                                >
                                    <option value="">Select Driver</option>
                                    {drivers.map(driver => (
                                        <option key={driver} value={driver}>{driver}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Top 10 Finisher */}
                            <div className="prediction-category">
                                <h3 className="category-title">Top 10 Finisher</h3>
                                <p className="category-description">
                                    Who will finish exactly in 10th place?
                                </p>
                                <select
                                    value={prediction.tenthPlaceDriver}
                                    onChange={(e) => handleInputChange('tenthPlaceDriver', e.target.value)}
                                    className="prediction-select"
                                >
                                    <option value="">Select Driver</option>
                                    {drivers.map(driver => (
                                        <option key={driver} value={driver}>{driver}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Правая колонка */}
                        <div className="prediction-column">
                            {/* DNF */}
                            <div className="prediction-category">
                                <h3 className="category-title">DNF (Did Not Finish)</h3>
                                <p className="category-description">
                                    Which top driver will NOT finish the race?
                                </p>
                                <select
                                    value={prediction.dnfDriver}
                                    onChange={(e) => handleInputChange('dnfDriver', e.target.value)}
                                    className="prediction-select"
                                >
                                    <option value="">Select Driver</option>
                                    {drivers.map(driver => (
                                        <option key={driver} value={driver}>{driver}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Podium Finish */}
                            <div className="prediction-category">
                                <h3 className="category-title">Podium Finish</h3>
                                <p className="category-description">
                                    Predict the drivers who will finish 1st, 2nd, and 3rd.
                                </p>

                                <div className="podium-predictions">
                                    <div className="podium-item">
                                        <label>1st Place</label>
                                        <select
                                            value={prediction.p1Driver}
                                            onChange={(e) => handleInputChange('p1Driver', e.target.value)}
                                            className="prediction-select"
                                        >
                                            <option value="">Select Driver</option>
                                            {drivers.map(driver => (
                                                <option key={driver} value={driver}>{driver}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="podium-item">
                                        <label>2nd Place</label>
                                        <select
                                            value={prediction.p2Driver}
                                            onChange={(e) => handleInputChange('p2Driver', e.target.value)}
                                            className="prediction-select"
                                        >
                                            <option value="">Select Driver</option>
                                            {drivers.map(driver => (
                                                <option key={driver} value={driver}>{driver}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="podium-item">
                                        <label>3rd Place</label>
                                        <select
                                            value={prediction.p3Driver}
                                            onChange={(e) => handleInputChange('p3Driver', e.target.value)}
                                            className="prediction-select"
                                        >
                                            <option value="">Select Driver</option>
                                            {drivers.map(driver => (
                                                <option key={driver} value={driver}>{driver}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {error && <div className="error-message">{error}</div>}
            </div>
        </div>
    );
};

export default PredictionModal;