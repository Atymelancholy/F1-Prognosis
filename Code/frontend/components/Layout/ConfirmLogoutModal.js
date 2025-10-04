import React from 'react';
import './ConfirmLogoutModal.css';

const ConfirmLogoutModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Confirm Logout</h3>
                </div>
                <div className="modal-body">
                    <p>Are you sure you want to logout?</p>
                </div>
                <div className="modal-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={handleCancel}
                    >
                        No, Stay Logged In
                    </button>
                    <button
                        className="btn btn-danger confirm-btn"
                        onClick={handleConfirm}
                    >
                        Yes, Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmLogoutModal;