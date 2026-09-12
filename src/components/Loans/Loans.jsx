import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';
import './Loans.css';

const Loans = () => {
  const { loans, totalDebt, openModal, setActiveView, profile } = useFinance();

  // Compute total initial debt principal and total paid
  const totalPrincipal = loans.reduce((sum, l) => sum + l.principal, 0);
  const totalPaid = Math.max(0, totalPrincipal - totalDebt);
  const percentPaid = totalPrincipal > 0 ? Math.min(100, Math.round((totalPaid / totalPrincipal) * 100)) : 100;

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentPaid / 100) * circumference;

  const primaryLoan = loans[0];

  return (
    <div className="subgrid-two-item grid-common grid-c7">
      <div className="grid-c-title">
        <h3 className="grid-c-title-text">
          <span>📉</span> Debt & Liabilities
        </h3>
        <button
          className="btn-ghost"
          style={{ fontSize: '12px', padding: '4px 8px' }}
          onClick={() => setActiveView('loans')}
        >
          Liabilities →
        </button>
      </div>

      <div className="loans-content-wrapper">
        {/* SVG Progress Ring */}
        <div className="debt-ring-container">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="var(--bg-elevated)"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="var(--accent-emerald)"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: 'rotate(-90deg)',
                transformOrigin: '50% 50%'
              }}
            />
          </svg>
          <div className="debt-ring-label">
            <span className="font-mono tabular-nums">{percentPaid}%</span>
            <small>PAID</small>
          </div>
        </div>

        {/* Debt Data Breakdown */}
        <div className="debt-info-col">
          <div className="debt-row">
            <span className="text-muted">Total Remaining</span>
            <span className="font-mono tabular-nums text-rose" style={{ fontWeight: 700, fontSize: '14px' }}>
              {formatCurrency(totalDebt, profile.currency)}
            </span>
          </div>
          <div className="debt-row">
            <span className="text-muted">Original Principal</span>
            <span className="font-mono tabular-nums" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {formatCurrency(totalPrincipal, profile.currency)}
            </span>
          </div>

          {primaryLoan && (
            <button
              className="btn-secondary"
              style={{ marginTop: '8px', width: '100%', fontSize: '12px', padding: '6px' }}
              onClick={() => openModal('payLoan', { loan: primaryLoan })}
            >
              Pay ${primaryLoan.monthlyPayment} Due
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Loans;
