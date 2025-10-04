import React from 'react';

const GrandPrixCard = ({ gp, onActionClick }) => {
    const getStatusBadge = (status) => {
        const statusConfig = {
            AWAITING: { class: 'status-awaiting', text: 'Awaiting' },
            OPEN: { class: 'status-open', text: 'Predictions Open' },
            CLOSED: { class: 'status-closed', text: 'Predictions Closed' },
            COMPLETED: { class: 'status-completed', text: 'Completed' }
        };

        const config = statusConfig[status] || statusConfig.AWAITING;
        return <div className={`status-badge ${config.class}`}>{config.text}</div>;
    };

    const getActionButton = (status) => {
        switch (status) {
            case 'OPEN':
                return {
                    text: 'Make Prediction',
                    enabled: true
                };
            case 'CLOSED':
                return {
                    text: 'View Results',
                    enabled: true
                };
            case 'COMPLETED':
                return {
                    text: 'View Results',
                    enabled: true
                };
            case 'AWAITING':
            default:
                return {
                    text: 'Make Prediction',
                    enabled: false
                };
        }
    };

    const actionConfig = getActionButton(gp.status);

    return (
        <div className="grand-prix-card">
            {/* Верхняя кнопка - статус прогноза */}
            <div className="card-status-section">
                {getStatusBadge(gp.status)}
            </div>

            {/* Информация о событии */}
            <div className="gp-card-content">
                <div className="gp-info-line">
                    <span className="gp-info-main">{gp.name}</span>
                </div>
                <div className="gp-info-line">
                    <span className="gp-info-secondary">
                        Round {gp.roundNumber} · {new Date(gp.raceTime).toLocaleDateString()}
                    </span>
                </div>
                <div className="gp-info-line">
                    <span className="gp-info-tertiary">{gp.circuit}</span>
                </div>
            </div>

            {/* Нижняя кнопка - действие */}
            <div className="card-action-section">
                <button
                    className={`btn-action ${!actionConfig.enabled ? 'btn-disabled' : ''}`}
                    onClick={() => onActionClick(gp)}
                    disabled={!actionConfig.enabled}
                >
                    {actionConfig.text}
                </button>
            </div>
        </div>
    );
};

export default GrandPrixCard;