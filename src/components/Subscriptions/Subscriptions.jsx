import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatHumanDate } from '../../utils/formatters';
import './Subscriptions.css';

const Subscriptions = () => {
  const {
    subscriptions,
    monthlySubscriptionsCost,
    openModal,
    toggleSubscriptionStatus,
    removeSubscription,
    setActiveView,
    profile
  } = useFinance();

  const previewSubs = subscriptions.slice(0, 3);

  return (
    <div className="subgrid-two-item grid-common grid-c5">
      <div className="grid-c-title">
        <h3 className="grid-c-title-text">
          <span>🔄</span> Subscriptions
        </h3>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className="btn-ghost"
            style={{ fontSize: '12px', padding: '4px 8px' }}
            onClick={() => setActiveView('subscriptions')}
          >
            All ({subscriptions.length}) →
          </button>
          <button
            className="grid-c-title-icon"
            onClick={() => openModal('addSubscription')}
            title="Add Subscription"
            aria-label="Add Subscription"
          >
            <span>+</span>
          </button>
        </div>
      </div>

      <div className="sub-cost-banner">
        <span className="text-muted" style={{ fontSize: '11px', textTransform: 'uppercase' }}>Monthly Burn</span>
        <span className="sub-cost-val font-mono tabular-nums text-indigo">
          {formatCurrency(monthlySubscriptionsCost, profile.currency)}/mo
        </span>
      </div>

      <div className="sub-list">
        {previewSubs.map((sub) => (
          <div className="sub-item" key={sub.id}>
            <div className="sub-left">
              <span className="sub-logo">{sub.logo}</span>
              <div>
                <div className="sub-title">{sub.title}</div>
                <div className="sub-due">
                  Due {formatHumanDate(sub.dueDate)}
                </div>
              </div>
            </div>

            <div className="sub-right">
              <span className="sub-price font-mono tabular-nums">
                {formatCurrency(sub.amount, profile.currency)}
              </span>
              <button
                className="sub-del-btn"
                onClick={() => removeSubscription(sub.id)}
                title="Remove Subscription"
              >
                &times;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscriptions;
