import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatHumanDate, formatDate } from '../../utils/formatters';
import './Views.css';

const SubscriptionsView = () => {
  const {
    subscriptions,
    monthlySubscriptionsCost,
    openModal,
    toggleSubscriptionStatus,
    removeSubscription,
    profile
  } = useFinance();

  const annualProjectedCost = monthlySubscriptionsCost * 12;

  return (
    <div className="view-container">
      <div className="view-header">
        <div className="view-header-left">
          <h1>Subscriptions & Recurring Bills</h1>
          <p>Audit active software subscriptions, streaming services, and utility bills to avoid unexpected renewals.</p>
        </div>
        <div className="view-header-actions">
          <button className="btn-primary" onClick={() => openModal('addSubscription')}>
            + Track New Subscription
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-title">Monthly Recurring Burn</span>
          <div className="kpi-val text-indigo tabular-nums font-mono">
            {formatCurrency(monthlySubscriptionsCost, profile.currency)}/mo
          </div>
          <div className="kpi-sub">
            <span>Across {subscriptions.filter((s) => s.status === 'active').length} active services</span>
          </div>
        </div>

        <div className="kpi-card">
          <span className="kpi-title">Annualized Commitment</span>
          <div className="kpi-val text-amber tabular-nums font-mono">
            {formatCurrency(annualProjectedCost, profile.currency)}/yr
          </div>
          <div className="kpi-sub">
            <span>Projected 12-month recurring expenditure</span>
          </div>
        </div>

        <div className="kpi-card">
          <span className="kpi-title">Next Imminent Renewal</span>
          <div className="kpi-val text-emerald tabular-nums font-mono" style={{ fontSize: '18px' }}>
            {subscriptions[0] ? subscriptions[0].title : 'None'}
          </div>
          <div className="kpi-sub">
            <span>{subscriptions[0] ? `Due ${formatHumanDate(subscriptions[0].dueDate)}` : 'All clear'}</span>
          </div>
        </div>
      </div>

      {/* Subscriptions Grid */}
      <div className="cards-grid">
        {subscriptions.map((sub) => {
          const isActive = sub.status === 'active';

          return (
            <div className="view-card" key={sub.id} style={{ opacity: isActive ? 1 : 0.65 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '28px' }}>{sub.logo}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>{sub.title}</div>
                      <span className="badge badge-slate" style={{ marginTop: '2px' }}>{sub.category}</span>
                    </div>
                  </div>
                  <span className={`badge ${isActive ? 'badge-emerald' : 'badge-amber'}`}>
                    {sub.status}
                  </span>
                </div>

                <div style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                    <span className="text-muted">Renewal Amount:</span>
                    <span className="tabular-nums font-mono text-primary" style={{ fontWeight: 700 }}>
                      {formatCurrency(sub.amount, profile.currency)} / {sub.frequency.toLowerCase()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span className="text-muted">Next Charge:</span>
                    <span style={{ color: 'var(--accent-indigo-light)' }}>
                      {formatHumanDate(sub.dueDate)} ({formatDate(sub.dueDate)})
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  className="btn-ghost"
                  style={{ fontSize: '12px' }}
                  onClick={() => toggleSubscriptionStatus(sub.id)}
                >
                  {isActive ? '⏸️ Pause' : '▶️ Resume'}
                </button>
                <button
                  className="btn-ghost"
                  style={{ color: 'var(--accent-rose-light)', fontSize: '12px' }}
                  onClick={() => removeSubscription(sub.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubscriptionsView;
