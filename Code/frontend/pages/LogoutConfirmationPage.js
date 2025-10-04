
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import F1Background from '../assets/f1.webp';
import '../styles/pages/logout-confirmation.css';

const LogoutConfirmationPage = () => {
    const [isConfirmed, setIsConfirmed] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleConfirmation = (confirmed) => {
        setIsConfirmed(confirmed);
    };

    const handleLogout = async () => {
        if (!isConfirmed) return;

        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="logout-confirmation-page">
            {/* Фоновые изображения */}
            <div
                className="background-image background-top-left"
                style={{ backgroundImage: `url(${F1Background})` }}
            />
            <div
                className="background-image background-bottom-right"
                style={{ backgroundImage: `url(${F1Background})` }}
            />

            <div className="logout-confirmation-content">
                <div className="logout-confirmation-simple">
                    <div className="logout-confirmation-message">
                        <h3>Are you sure you want to log out?</h3>
                    </div>

                    <div className="logout-confirmation-options">
                        <button
                            onClick={() => handleConfirmation(true)}
                            className={`logout-confirmation-option ${isConfirmed ? 'active' : ''}`}
                        >
                            <span className="logout-option-circle"></span>
                            <span className="logout-option-text">Yes</span>
                        </button>

                        <button
                            onClick={() => handleConfirmation(false)}
                            className={`logout-confirmation-option ${!isConfirmed && isConfirmed !== null ? 'active' : ''}`}
                        >
                            <span className="logout-option-circle"></span>
                            <span className="logout-option-text">No</span>
                        </button>
                    </div>

                    <div className="logout-confirmation-actions">
                        <button
                            onClick={handleLogout}
                            disabled={!isConfirmed}
                            className={`logout-btn-logout ${isConfirmed ? 'enabled' : 'disabled'}`}
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogoutConfirmationPage;