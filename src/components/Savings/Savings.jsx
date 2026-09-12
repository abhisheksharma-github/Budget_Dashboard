import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatHumanDate } from '../../utils/formatters';
import './Savings.css';

const Savings = () => {
  const { savings, totalSavings, openModal, setActiveView, profile } = useFinance();

  const previewGoals = savings.slice(0, 2);

  return (
    <div className="subgrid-two-item grid-common grid-c6">
      <div className="grid-c-title">
        <h3 className="grid-c-title-text">
          <span>🎯</span> Savings Goals
        </h3>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className="btn-ghost"
            style={{ fontSize: '12px', padding: '4px 8px' }}
            onClick={() => setActiveView('savings')}
          >
            Goals ({savings.length}) →
          </button>
          <button
            className="grid-c-title-icon"
            onClick={() => openModal('addSavings')}
            title="Create Savings Goal"
            aria-label="Create Savings Goal"
          >
            <span>+</span>
          </button>
        </div>
      </div>

      <div className="savings-total-card">
        <span className="text-muted" style={{ fontSize: '11px', textTransform: 'uppercase' }}>Total Saved Cushion</span>
        <div className="lg-value text-emerald" style={{ fontSize: '20px' }}>
          {formatCurrency(totalSavings, profile.currency)}
        </div>
      </div>

      <div className="savings-list">
        {previewGoals.map((goal) => {
          const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));

          return (
            <div className="saving-card" key={goal.id}>
              <div className="saving-header">
                <div className="saving-title-group">
                  <span className="saving-icon">{goal.icon || '🎯'}</span>
                  <div>
                    <div className="saving-name">{goal.title}</div>
                    <div className="saving-target-date">Target: {formatHumanDate(goal.targetDate)}</div>
                  </div>
                </div>
                <button
                  className="btn-secondary"
                  style={{ fontSize: '11px', padding: '3px 8px' }}
                  onClick={() => openModal('deposit', { goal })}
                >
                  + Deposit
                </button>
              </div>

              <div className="saving-progress-track">
                <div
                  className="saving-progress-fill"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="saving-amounts">
                <span className="font-mono tabular-nums text-emerald" style={{ fontSize: '12px', fontWeight: 600 }}>
                  {formatCurrency(goal.currentAmount, profile.currency)}
                </span>
                <span className="font-mono tabular-nums text-muted" style={{ fontSize: '11px' }}>
                  {pct}% of {formatCurrency(goal.targetAmount, profile.currency)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Savings;
