import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Yes", cancelText = "No" }) => {
    if (!isOpen) return null;

    return (
        <div className="fullscreen-modal-overlay">
            <div className="fullscreen-modal-content">
                <div className="modal-header">
                    <h2>{title}</h2>
                </div>
                <div className="modal-body">
                    <p className="modal-message">{message}</p>
                    <div className="modal-actions">
                        <button
                            onClick={onClose}
                            className="btn btn-cancel"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className="btn btn-confirm"
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;