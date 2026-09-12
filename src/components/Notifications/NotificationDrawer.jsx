import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import './NotificationDrawer.css';

const NotificationDrawer = ({ isOpen, onClose }) => {
  const { notifications, setActiveView } = useFinance();

  if (!isOpen) return null;

  const handleAlertClick = (alert) => {
    if (alert.category === 'Subscription') {
      setActiveView('subscriptions');
    } else if (alert.category === 'Budget') {
      setActiveView('budget');
    } else {
      setActiveView('overview');
    }
    onClose();
  };

  return (
    <div className="notif-backdrop" onClick={onClose}>
      <div className="notif-popover" onClick={(e) => e.stopPropagation()}>
        <div className="notif-header">
          <div className="notif-title">
            <span>Activity & Alerts</span>
            <span className="notif-badge">{notifications.length} Active</span>
          </div>
          <button className="notif-close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="notif-list">
          {notifications.length === 0 ? (
            <div className="notif-empty">
              <span>🎉</span>
              <p>All caught up! No critical alerts right now.</p>
            </div>
          ) : (
            notifications.map((n) => {
              let tagClass = 'tag-info';
              if (n.type === 'danger' || n.type === 'urgent') tagClass = 'tag-danger';
              if (n.type === 'warning') tagClass = 'tag-warning';

              return (
                <div key={n.id} className="notif-item" onClick={() => handleAlertClick(n)}>
                  <div className="notif-item-top">
                    <span className={`notif-tag ${tagClass}`}>{n.category}</span>
                    <span className="notif-date">{n.date}</span>
                  </div>
                  <div className="notif-item-title">{n.title}</div>
                  <div className="notif-item-msg">{n.message}</div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDrawer;
