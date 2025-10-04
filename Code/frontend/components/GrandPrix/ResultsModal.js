import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import './ResultsModal.css';

const ResultsModal = ({ grandPrix, onClose }) => {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadResults();
    }, [grandPrix.id]);

    const loadResults = async () => {
        try {
            setLoading(true);
            const response = await dataService.getGrandPrixResults(grandPrix.id);
            setResults(response);
        } catch (error) {
            console.error('Error loading results:', error);
            setError('Failed to load race results');
        } finally {
            setLoading(false);
        }
    };

    const formatDriverName = (driver) => {
        if (!driver) return '-';
        return driver.charAt(0) + driver.slice(1).toLowerCase();
    };

    if (loading) {
        return (
            <div className="modal-overlay">
                <div className="results-modal">
                    <div className="modal-header">
                        <h3>Race Results</h3>
                        <button onClick={onClose} className="modal-close">×</button>
                    </div>
                    <div className="modal-body">
                        <div className="loading">Loading results...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay">
            <div className="results-modal">
                {/* Хедер */}
                <div className="modal-header">
                    <h3>Race Results - {grandPrix.name}</h3>
                    <button onClick={onClose} className="modal-close">×</button>
                </div>

                <div className="modal-body">
                    {error ? (
                        <div className="error-message">{error}</div>
                    ) : results ? (
                        <div className="results-content">
                            {/* Информация о гонке */}
                            <div className="gp-info">
                                <div className="gp-circuit">{grandPrix.circuit}</div>
                                <div className="gp-round">Round {grandPrix.roundNumber}</div>
                            </div>

                            {/* Результаты */}
                            <div className="results-grid">
                                {/* Поул-позиция */}
                                <div className="result-category">
                                    <h4>Pole Position</h4>
                                    <div className="driver-result">
                                        <span className="position-badge pole">P</span>
                                        <span className="driver-name">
                                            {formatDriverName(results.polePositionDriver)}
                                        </span>
                                    </div>
                                </div>

                                {/* Подиум */}
                                <div className="result-category">
                                    <h4>Podium</h4>
                                    <div className="podium-results">
                                        <div className="podium-item first">
                                            <span className="position-badge">1</span>
                                            <span className="driver-name">
                                                {formatDriverName(results.p1Driver)}
                                            </span>
                                        </div>
                                        <div className="podium-item second">
                                            <span className="position-badge">2</span>
                                            <span className="driver-name">
                                                {formatDriverName(results.p2Driver)}
                                            </span>
                                        </div>
                                        <div className="podium-item third">
                                            <span className="position-badge">3</span>
                                            <span className="driver-name">
                                                {formatDriverName(results.p3Driver)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Fastest Lap */}
                                <div className="result-category">
                                    <h4>Fastest Lap</h4>
                                    <div className="driver-result">
                                        <span className="position-badge fastest">FL</span>
                                        <span className="driver-name">
                                            {formatDriverName(results.fastestLapDriver)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="no-results">
                            <p>No results available for this race yet.</p>
                            <p>Check back later after the race is completed.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResultsModal;