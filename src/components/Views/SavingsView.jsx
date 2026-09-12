import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatHumanDate, formatDate } from '../../utils/formatters';
import './Views.css';

const SavingsView = () => {
  const { savings, totalSavings, openModal, removeSavingsGoal, profile } = useFinance();

  const totalTarget = savings.reduce((sum, g) => sum + g.targetAmount, 0);
  const overallPercentage = totalTarget > 0 ? Math.min(100, Math.round((totalSavings / totalTarget) * 100)) : 0;

  return (
    <div className="view-container">
      <div className="view-header">
        <div className="view-header-left">
          <h1>Savings & Wealth Milestones</h1>
          <p>Track progress toward life goals, emergency safety cushions, and capital investments.</p>
        </div>
        <div className="view-header-actions">
          <button className="btn-primary" onClick={() => openModal('addSavings')}>
            + Create New Goal
          </button>
        </div>
      </div>

      {/* Summary Banner */}
      <div className="ledger-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <span className="text-muted" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Combined Savings Capital</span>
            <div className="lg-value text-emerald" style={{ fontSize: '26px' }}>
              {formatCurrency(totalSavings, profile.currency)}
              <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                {' '}accumulated of {formatCurrency(totalTarget, profile.currency)} total target
              </span>
            </div>
          </div>
          <div className="badge badge-emerald" style={{ fontSize: '14px', padding: '6px 12px' }}>
            {overallPercentage}% Funded
          </div>
        </div>

        <div style={{ width: '100%', height: '8px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
          <div
            style={{
              width: `${overallPercentage}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--accent-indigo) 0%, var(--accent-emerald) 100%)',
              transition: 'width 0.4s ease'
            }}
          />
        </div>
      </div>

      {/* Goal Cards Grid */}
      <div className="cards-grid">
        {savings.map((goal) => {
          const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const isComplete = goal.currentAmount >= goal.targetAmount;
          const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

          return (
            <div className="view-card" key={goal.id}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '32px' }}>{goal.icon || '🎯'}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>{goal.title}</div>
                      <span className="badge badge-slate" style={{ marginTop: '2px' }}>{goal.category}</span>
                    </div>
                  </div>
                  <button
                    className="btn-ghost"
                    style={{ color: 'var(--text-muted)', padding: '4px' }}
                    onClick={() => removeSavingsGoal(goal.id)}
                    title="Delete Goal"
                  >
                    &times;
                  </button>
                </div>

                <div style={{ padding: '14px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className="tabular-nums font-mono text-emerald" style={{ fontWeight: 800, fontSize: '16px' }}>
                      {formatCurrency(goal.currentAmount, profile.currency)}
                    </span>
                    <span className="tabular-nums font-mono text-muted" style={{ fontSize: '13px' }}>
                      Target: {formatCurrency(goal.targetAmount, profile.currency)}
                    </span>
                  </div>

                  <div style={{ width: '100%', height: '6px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-pill)', overflow: 'hidden', marginBottom: '8px' }}>
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        background: isComplete ? 'var(--accent-emerald)' : 'linear-gradient(90deg, var(--accent-indigo) 0%, var(--accent-emerald) 100%)',
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <span>{isComplete ? '🎉 Target Achieved!' : `${formatCurrency(remaining, profile.currency)} left`}</span>
                    <span>{pct}%</span>
                  </div>
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                  <span>🎯 Target Date: <strong>{formatHumanDate(goal.targetDate)}</strong> ({formatDate(goal.targetDate)})</span>
                  {goal.monthlyDeposit > 0 && (
                    <div style={{ marginTop: '4px' }}>
                      ⚡ Auto-Deposit: <strong>{formatCurrency(goal.monthlyDeposit, profile.currency)}/mo</strong>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  className="btn-primary"
                  style={{ width: '100%', background: 'var(--accent-emerald)' }}
                  onClick={() => openModal('deposit', { goal })}
                >
                  + Add Funds
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavingsView;
