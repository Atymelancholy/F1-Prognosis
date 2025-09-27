import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { adminService } from '../services/adminService';
import OIPImage from '../assets/R.png';

const AdminResultsPage = () => {
    const { isAuthenticated, isAdmin, loading, user } = useAuth();
    const [grandPrixList, setGrandPrixList] = useState([]);
    const [selectedGp, setSelectedGp] = useState(null);
    const [existingResults, setExistingResults] = useState(null);
    const [loadingGp, setLoadingGp] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const [results, setResults] = useState({
        polePositionDriver: '',
        p1Driver: '',
        p2Driver: '',
        p3Driver: '',
        fastestLapDriver: ''
    });

    const drivers = [
        'VERSTAPPEN', 'PEREZ', 'HAMILTON', 'RUSSELL',
        'LECLERC', 'SAINZ', 'NORRIS', 'PIASTRI',
        'ALONSO', 'STROLL', 'GASLY', 'OCON',
        'ALBON', 'SARGEANT', 'BOTTAS', 'ZHOU',
        'MAGNUSSEN', 'HULKENBERG', 'TSUNODA', 'RICCIARDO'
    ];

    // Функции в правильном порядке
    const loadGrandPrix = async () => {
        try {
            setLoadingGp(true);
            setMessage('Loading Grand Prix data...');
            const data = await adminService.getAvailableGrandPrix();
            setGrandPrixList(data);
            setMessage('');
        } catch (error) {
            setMessage('Error loading grand prix data');
        } finally {
            setLoadingGp(false);
        }
    };

    const handleGpSelect = async (gp) => {
        setSelectedGp(gp);
        setMessage(`Loading results for ${gp.name}...`);

        try {
            const hasResults = await adminService.hasResults(gp.id);

            if (hasResults) {
                const existing = await adminService.getResults(gp.id);
                setExistingResults(existing);
                setResults({
                    polePositionDriver: existing.polePositionDriver || '',
                    p1Driver: existing.p1Driver || '',
                    p2Driver: existing.p2Driver || '',
                    p3Driver: existing.p3Driver || '',
                    fastestLapDriver: existing.fastestLapDriver || ''
                });
                setMessage('Existing results loaded');
            } else {
                setExistingResults(null);
                setResults({
                    polePositionDriver: '',
                    p1Driver: '',
                    p2Driver: '',
                    p3Driver: '',
                    fastestLapDriver: ''
                });
                setMessage('No existing results found');
            }
        } catch (error) {
            setMessage('Error loading results data');
        }
    };

    const handleInputChange = (field, value) => {
        setResults(prev => ({
            ...prev,
            [field]: value.toUpperCase().trim()
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('Saving results...');

        const requiredFields = ['polePositionDriver', 'p1Driver', 'p2Driver', 'p3Driver', 'fastestLapDriver'];
        const emptyFields = requiredFields.filter(field => !results[field].trim());

        if (emptyFields.length > 0) {
            setMessage('Please fill in all driver fields');
            setSaving(false);
            return;
        }

        try {
            const resultData = {
                grandPrixId: selectedGp.id,
                ...results
            };

            const response = await adminService.submitResults(resultData);
            setMessage(response);
            await handleGpSelect(selectedGp);
        } catch (error) {
            setMessage('Error saving results: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteResults = async () => {
        if (window.confirm('Are you sure you want to delete these results? This will reset all scores for this Grand Prix.')) {
            setSaving(true);
            setMessage('Deleting results...');

            try {
                const response = await adminService.deleteResults(selectedGp.id);
                setMessage(response);
                setExistingResults(null);
                setResults({
                    polePositionDriver: '',
                    p1Driver: '',
                    p2Driver: '',
                    p3Driver: '',
                    fastestLapDriver: ''
                });
            } catch (error) {
                setMessage('Error deleting results: ' + error.message);
            } finally {
                setSaving(false);
            }
        }
    };

    const handleRecalculateScores = async (grandPrixId) => {
        if (window.confirm('Recalculate scores for this Grand Prix?')) {
            setSaving(true);
            setMessage('Recalculating scores...');

            try {
                const response = await adminService.recalculateScores(grandPrixId);
                setMessage(response);
            } catch (error) {
                setMessage('Error recalculating scores: ' + error.message);
            } finally {
                setSaving(false);
            }
        }
    };

    const handleTestScoring = async (grandPrixId) => {
        setSaving(true);
        setMessage('Testing scoring...');

        try {
            const response = await adminService.testScoring(grandPrixId);
            setMessage(response);
        } catch (error) {
            setMessage('Test failed: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleCreateTestPredictions = async (grandPrixId) => {
        if (window.confirm('Create test predictions for this Grand Prix?')) {
            setSaving(true);
            setMessage('Creating test predictions...');

            try {
                const response = await adminService.createTestPredictions(grandPrixId);
                setMessage(response);
            } catch (error) {
                setMessage('Error creating test predictions: ' + error.message);
            } finally {
                setSaving(false);
            }
        }
    };

    const handleRecalculateAllScores = async () => {
        if (window.confirm('Recalculate scores for ALL completed Grand Prix events?')) {
            setSaving(true);
            setMessage('Recalculating all scores...');

            try {
                const response = await adminService.recalculateAllScores();
                setMessage(response);
            } catch (error) {
                setMessage('Error recalculating scores: ' + error.message);
            } finally {
                setSaving(false);
            }
        }
    };

    useEffect(() => {
        if (isAuthenticated && isAdmin) {
            loadGrandPrix();
        }
    }, [isAuthenticated, isAdmin]);

    if (loading) {
        return <div className="loading">Loading authentication...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        return (
            <div className="admin-error">
                <h2>Access Denied</h2>
                <p>You need administrator privileges to access this page.</p>
                <p>Current user role: {user?.role || 'USER'}</p>
            </div>
        );
    }

    return (
        <div className="admin-results-page">
            <div className="admin-results-header">
                <div className="admin-results-title-section">
                    <h2 className="admin-results-title">Manage Race Results</h2>
                    <span className="user-info">(Admin: {user?.username || user?.email})</span>
                </div>
                <img src={OIPImage} alt="Admin Results" className="admin-results-image" />
            </div>

            <div className="admin-results-content">
                {message && (
                    <div className={`message ${message.includes('Error') ? 'error' : message.includes('Success') ? 'success' : 'info'}`}>
                        {message}
                    </div>
                )}

                <div className="admin-global-actions">
                    <button
                        type="button"
                        className="btn btn-warning"
                        onClick={handleRecalculateAllScores}
                        disabled={saving}
                    >
                        Recalculate All Scores
                    </button>
                </div>

                <div className="admin-layout">
                    <div className="gp-list-section">
                        <h3>Select Grand Prix</h3>
                        <button onClick={loadGrandPrix} className="btn-refresh" disabled={loadingGp}>
                            Refresh List
                        </button>

                        {loadingGp ? (
                            <div className="loading">Loading Grand Prix...</div>
                        ) : grandPrixList.length === 0 ? (
                            <div className="no-data">
                                <p>No Grand Prix available</p>
                            </div>
                        ) : (
                            <div className="gp-list">
                                {grandPrixList.map((gp) => (
                                    <div
                                        key={gp.id}
                                        className={`gp-item ${selectedGp?.id === gp.id ? 'active' : ''}`}
                                        onClick={() => handleGpSelect(gp)}
                                    >
                                        <div className="gp-name">{gp.name}</div>
                                        <div className="gp-details">
                                            <span>Round {gp.roundNumber}</span>
                                            <span className={`gp-status ${gp.status.toLowerCase()}`}>
                                                {gp.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="results-form-section">
                        {selectedGp ? (
                            <form onSubmit={handleSubmit} className="results-form">
                                <h3>Results for {selectedGp.name}</h3>

                                {[
                                    { field: 'polePositionDriver', label: 'Pole Position Driver' },
                                    { field: 'p1Driver', label: '1st Place (P1)' },
                                    { field: 'p2Driver', label: '2nd Place (P2)' },
                                    { field: 'p3Driver', label: '3rd Place (P3)' },
                                    { field: 'fastestLapDriver', label: 'Fastest Lap Driver' }
                                ].map(({ field, label }) => (
                                    <div key={field} className="form-group">
                                        <label>{label}:</label>
                                        <select
                                            value={results[field]}
                                            onChange={(e) => handleInputChange(field, e.target.value)}
                                            required
                                        >
                                            <option value="">Select Driver</option>
                                            {drivers.map(driver => (
                                                <option key={driver} value={driver}>{driver}</option>
                                            ))}
                                        </select>
                                    </div>
                                ))}

                                <div className="form-actions">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={saving}
                                    >
                                        {saving ? 'Saving...' : existingResults ? 'Update Results' : 'Save Results'}
                                    </button>

                                    {existingResults && (
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={handleDeleteResults}
                                            disabled={saving}
                                        >
                                            Delete Results
                                        </button>
                                    )}
                                </div>

                                <div className="admin-actions">
                                    <button
                                        type="button"
                                        className="btn btn-test"
                                        onClick={() => handleCreateTestPredictions(selectedGp.id)}
                                        disabled={saving}
                                    >
                                        Create Test Predictions
                                    </button>

                                    {existingResults && (
                                        <>
                                            <button
                                                type="button"
                                                className="btn btn-warning"
                                                onClick={() => handleRecalculateScores(selectedGp.id)}
                                                disabled={saving}
                                            >
                                                Recalculate Scores
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-info"
                                                onClick={() => handleTestScoring(selectedGp.id)}
                                                disabled={saving}
                                            >
                                                Test Scoring
                                            </button>
                                        </>
                                    )}
                                </div>
                            </form>
                        ) : (
                            <div className="no-selection">
                                <p>Select a Grand Prix to manage results</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminResultsPage;