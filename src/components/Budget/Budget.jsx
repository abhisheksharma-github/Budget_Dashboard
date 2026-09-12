import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, getCategoryMeta } from '../../utils/formatters';
import './Budget.css';

const Budget = () => {
  const {
    budgetAnalysis,
    totalBudgetLimit,
    totalBudgetSpent,
    openModal,
    removeBudget,
    setActiveView,
    profile
  } = useFinance();

  const totalPercentage = totalBudgetLimit > 0 ? Math.min(100, Math.round((totalBudgetSpent / totalBudgetLimit) * 100)) : 0;

  return (
    <div className="grid-two-item grid-common grid-c4">
      <div className="grid-c-title">
        <h3 className="grid-c-title-text">
          <span>📊</span> Monthly Budgets
        </h3>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className="btn-ghost"
            style={{ fontSize: '12px', padding: '4px 8px' }}
            onClick={() => setActiveView('budget')}
          >
            Manage →
          </button>
          <button
            className="grid-c-title-icon"
            onClick={() => openModal('addBudget')}
            title="Add Budget Category"
            aria-label="Add Budget Category"
          >
            <span>+</span>
          </button>
        </div>
      </div>

      {/* Overall Budget Header Card */}
      <div className="budget-top-card">
        <div className="budget-top-labels">
          <div>
            <span className="text-muted" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Envelope
            </span>
            <div className="lg-value" style={{ fontSize: '20px' }}>
              {formatCurrency(totalBudgetSpent, profile.currency)}
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
                {' '}/ {formatCurrency(totalBudgetLimit, profile.currency)}
              </span>
            </div>
          </div>
          <div className="budget-pct-badge" style={{ color: totalPercentage > 85 ? 'var(--accent-rose-light)' : 'var(--accent-emerald-light)' }}>
            {totalPercentage}% Spent
          </div>
        </div>

        <div className="budget-progress-track">
          <div
            className="budget-progress-fill"
            style={{
              width: `${totalPercentage}%`,
              background: totalPercentage > 90 ? 'var(--accent-rose)' : totalPercentage > 75 ? 'var(--accent-amber)' : 'var(--accent-emerald)'
            }}
          />
        </div>
      </div>

      {/* Category Envelopes List */}
      <div className="budget-list">
        {budgetAnalysis.map((b) => {
          const meta = getCategoryMeta(b.category);
          const isWarning = b.percentage >= 85;
          const isOver = b.isOverBudget;

          return (
            <div className="budget-item" key={b.id}>
              <div className="budget-item-header">
                <div className="budget-item-title-group">
                  <span className="budget-icon">{b.icon || meta.icon}</span>
                  <span className="budget-cat-name">{b.category}</span>
                </div>
                <div className="budget-item-nums">
                  <span className="tabular-nums font-mono" style={{ fontWeight: 600 }}>
                    {formatCurrency(b.spent, profile.currency)}
                  </span>
                  <span className="text-muted tabular-nums font-mono" style={{ fontSize: '12px' }}>
                    {' '}/ {formatCurrency(b.limit, profile.currency)}
                  </span>
                  <button
                    className="budget-del-btn"
                    onClick={() => removeBudget(b.id)}
                    title="Delete Category"
                  >
                    &times;
                  </button>
                </div>
              </div>

              <div className="budget-bar-track">
                <div
                  className="budget-bar-fill"
                  style={{
                    width: `${b.percentage}%`,
                    background: isOver ? 'var(--accent-rose)' : isWarning ? 'var(--accent-amber)' : 'var(--accent-indigo)'
                  }}
                />
              </div>

              <div className="budget-item-footer">
                <span style={{ fontSize: '11px', color: isOver ? 'var(--accent-rose)' : 'var(--text-muted)' }}>
                  {isOver ? `⚠️ Over by ${formatCurrency(b.spent - b.limit, profile.currency)}` : `${formatCurrency(b.remaining, profile.currency)} left`}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  {b.percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Budget;
