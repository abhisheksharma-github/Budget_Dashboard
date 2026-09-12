import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, getCategoryMeta } from '../../utils/formatters';
import './Views.css';

const BudgetsView = () => {
  const {
    budgetAnalysis,
    totalBudgetLimit,
    totalBudgetSpent,
    openModal,
    removeBudget,
    profile
  } = useFinance();

  const totalPercentage = totalBudgetLimit > 0 ? Math.min(100, Math.round((totalBudgetSpent / totalBudgetLimit) * 100)) : 0;

  const chartData = {
    labels: budgetAnalysis.map((b) => b.category),
    datasets: [
      {
        data: budgetAnalysis.map((b) => b.spent || 1),
        backgroundColor: budgetAnalysis.map((b) => getCategoryMeta(b.category).color),
        borderColor: '#171B26',
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94A3B8',
          font: { family: 'Plus Jakarta Sans', size: 12 },
          boxWidth: 12,
          padding: 14
        }
      }
    },
    cutout: '72%'
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <div className="view-header-left">
          <h1>Budget Envelopes</h1>
          <p>Set spending ceilings per category and monitor real-time burn against your monthly targets.</p>
        </div>
        <div className="view-header-actions">
          <button className="btn-primary" onClick={() => openModal('addBudget')}>
            + New Budget Envelope
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Category Budget Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="ledger-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <span className="text-muted" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Monthly Cap Usage</span>
                <div className="lg-value" style={{ fontSize: '24px' }}>
                  {formatCurrency(totalBudgetSpent, profile.currency)}
                  <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                    {' '}/ {formatCurrency(totalBudgetLimit, profile.currency)}
                  </span>
                </div>
              </div>
              <div className="badge badge-indigo" style={{ fontSize: '14px', padding: '6px 12px' }}>
                {totalPercentage}% of allowance
              </div>
            </div>

            <div style={{ width: '100%', height: '8px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${totalPercentage}%`,
                  height: '100%',
                  background: totalPercentage > 90 ? 'var(--accent-rose)' : totalPercentage > 75 ? 'var(--accent-amber)' : 'var(--accent-emerald)',
                  transition: 'width 0.4s ease'
                }}
              />
            </div>
          </div>

          <div className="cards-grid">
            {budgetAnalysis.map((b) => {
              const meta = getCategoryMeta(b.category);
              const isOver = b.isOverBudget;

              return (
                <div className="view-card" key={b.id}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '24px' }}>{b.icon || meta.icon}</span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '15px' }}>{b.category}</div>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Monthly Allocation</span>
                        </div>
                      </div>
                      <button
                        className="btn-ghost"
                        style={{ color: 'var(--text-muted)', padding: '4px' }}
                        onClick={() => removeBudget(b.id)}
                        title="Delete Envelope"
                      >
                        &times;
                      </button>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                        <span className="tabular-nums font-mono" style={{ fontWeight: 700 }}>
                          {formatCurrency(b.spent, profile.currency)}
                        </span>
                        <span className="text-muted tabular-nums font-mono">
                          Limit: {formatCurrency(b.limit, profile.currency)}
                        </span>
                      </div>

                      <div style={{ width: '100%', height: '6px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${b.percentage}%`,
                            height: '100%',
                            background: isOver ? 'var(--accent-rose)' : b.percentage >= 85 ? 'var(--accent-amber)' : meta.color,
                            transition: 'width 0.4s ease'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', fontSize: '12px' }}>
                    <span style={{ color: isOver ? 'var(--accent-rose-light)' : 'var(--text-secondary)' }}>
                      {isOver ? `⚠️ Exceeded by ${formatCurrency(b.spent - b.limit, profile.currency)}` : `${formatCurrency(b.remaining, profile.currency)} remaining`}
                    </span>
                    <span className="font-mono tabular-nums" style={{ fontWeight: 600 }}>{b.percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expense Distribution Doughnut */}
        <div className="ledger-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
            Category Allocation
          </h3>
          <div style={{ flex: 1, minHeight: '260px', position: 'relative' }}>
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetsView;
