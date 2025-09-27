import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { useAuth } from '../../contexts/AuthContext';

const PredictionModal = ({ grandPrix, onClose, onSave }) => {
    const [prediction, setPrediction] = useState({
        polePositionDriver: '',
        p1Driver: '',
        p2Driver: '',
        p3Driver: '',
        fastestLapDriver: ''
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
                    polePositionDriver: existing.polePositionDriver,
                    p1Driver: existing.p1Driver,
                    p2Driver: existing.p2Driver,
                    p3Driver: existing.p3Driver,
                    fastestLapDriver: existing.fastestLapDriver
                });
                setExistingPrediction(existing);
            }
        } catch (error) {
            // Прогноз не найден - это нормально
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

    // Список пилотов F1 2024 (можно расширить)
    const drivers = [
        'VERSTAPPEN', 'PEREZ', 'HAMILTON', 'RUSSELL',
        'LECLERC', 'SAINZ', 'NORRIS', 'PIASTRI',
        'ALONSO', 'STROLL', 'GASLY', 'OCON',
        'ALBON', 'SARGEANT', 'BOTTAS', 'ZHOU',
        'MAGNUSSEN', 'HULKENBERG', 'TSUNODA', 'RICCIARDO'
    ];


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
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h3>Make Prediction - {grandPrix.name}</h3>
                    <button onClick={onClose} className="modal-close">×</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    {error && <div className="error-message">{error}</div>}

                    <div className="prediction-form">
                        <div className="form-group">
                            <label>Pole Position:</label>
                            <select
                                value={prediction.polePositionDriver}
                                onChange={(e) => handleInputChange('polePositionDriver', e.target.value)}
                                required
                            >
                                <option value="">Select Driver</option>
                                {drivers.map(driver => (
                                    <option key={driver} value={driver}>{driver}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>1st Place:</label>
                            <select
                                value={prediction.p1Driver}
                                onChange={(e) => handleInputChange('p1Driver', e.target.value)}
                                required
                            >
                                <option value="">Select Driver</option>
                                {drivers.map(driver => (
                                    <option key={driver} value={driver}>{driver}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>2nd Place:</label>
                            <select
                                value={prediction.p2Driver}
                                onChange={(e) => handleInputChange('p2Driver', e.target.value)}
                                required
                            >
                                <option value="">Select Driver</option>
                                {drivers.map(driver => (
                                    <option key={driver} value={driver}>{driver}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>3rd Place:</label>
                            <select
                                value={prediction.p3Driver}
                                onChange={(e) => handleInputChange('p3Driver', e.target.value)}
                                required
                            >
                                <option value="">Select Driver</option>
                                {drivers.map(driver => (
                                    <option key={driver} value={driver}>{driver}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Fastest Lap:</label>
                            <select
                                value={prediction.fastestLapDriver}
                                onChange={(e) => handleInputChange('fastestLapDriver', e.target.value)}
                                required
                            >
                                <option value="">Select Driver</option>
                                {drivers.map(driver => (
                                    <option key={driver} value={driver}>{driver}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? 'Saving...' : existingPrediction ? 'Update Prediction' : 'Save Prediction'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PredictionModal;