import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import './Toast.css';

const ToastContainer = () => {
  const { toasts, removeToast } = useFinance();

  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let icon = 'ℹ️';
        if (toast.type === 'success') icon = '✓';
        if (toast.type === 'warning') icon = '⚠️';
        if (toast.type === 'danger') icon = '✕';

        return (
          <div key={toast.id} className={`toast-item toast-${toast.type}`}>
            <div className="toast-icon-wrapper">
              <span className="toast-icon">{icon}</span>
            </div>
            <div className="toast-content">
              {toast.title && <div className="toast-title">{toast.title}</div>}
              <div className="toast-message">{toast.message}</div>
            </div>
            <button
              className="toast-close-btn"
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss notification"
            >
              &times;
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
