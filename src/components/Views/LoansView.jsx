import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatHumanDate, formatDate } from '../../utils/formatters';
import './Views.css';

const LoansView = () => {
  const { loans, totalDebt, openModal, profile } = useFinance();

  const totalPrincipal = loans.reduce((sum, l) => sum + l.principal, 0);
  const totalPaid = Math.max(0, totalPrincipal - totalDebt);
  const percentPaid = totalPrincipal > 0 ? Math.min(100, Math.round((totalPaid / totalPrincipal) * 100)) : 100;

  return (
    <div className="view-container">
      <div className="view-header">
        <div className="view-header-left">
          <h1>Debt & Liability Management</h1>
          <p>Accelerate your debt-free timeline by tracking principal reduction, interest rates, and monthly amortizations.</p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-title">Outstanding Liability</span>
          <div className="kpi-val text-rose tabular-nums font-mono">
            {formatCurrency(totalDebt, profile.currency)}
          </div>
          <div className="kpi-sub">
            <span>Remaining across {loans.length} active loan accounts</span>
          </div>
        </div>

        <div className="kpi-card">
          <span className="kpi-title">Principal Paid Off</span>
          <div className="kpi-val text-emerald tabular-nums font-mono">
            {formatCurrency(totalPaid, profile.currency)}
          </div>
          <div className="kpi-sub">
            <span>{percentPaid}% of initial {formatCurrency(totalPrincipal, profile.currency, true)} balance cleared</span>
          </div>
        </div>

        <div className="kpi-card">
          <span className="kpi-title">Monthly Debt Service</span>
          <div className="kpi-val tabular-nums font-mono">
            {formatCurrency(loans.reduce((s, l) => s + l.monthlyPayment, 0), profile.currency)}/mo
          </div>
          <div className="kpi-sub">
            <span>Required fixed monthly amortizations</span>
          </div>
        </div>
      </div>

      {/* Loan Cards Grid */}
      <div className="cards-grid">
        {loans.map((loan) => {
          const paid = loan.principal - loan.remainingAmount;
          const pct = Math.min(100, Math.round((paid / loan.principal) * 100));

          return (
            <div className="view-card" key={loan.id}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>{loan.name}</div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{loan.lender} • {loan.type}</span>
                  </div>
                  <span className="badge badge-indigo">
                    {loan.interestRate}% APR
                  </span>
                </div>

                <div style={{ padding: '14px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div>
                      <span className="text-muted" style={{ fontSize: '11px' }}>Remaining Balance</span>
                      <div className="tabular-nums font-mono text-rose" style={{ fontWeight: 800, fontSize: '16px' }}>
                        {formatCurrency(loan.remainingAmount, profile.currency)}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="text-muted" style={{ fontSize: '11px' }}>Original Loan</span>
                      <div className="tabular-nums font-mono text-muted" style={{ fontSize: '13px' }}>
                        {formatCurrency(loan.principal, profile.currency)}
                      </div>
                    </div>
                  </div>

                  <div style={{ width: '100%', height: '6px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-pill)', overflow: 'hidden', marginBottom: '8px' }}>
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        background: 'var(--accent-emerald)',
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <span>{pct}% Paid</span>
                    <span>Monthly: <strong>{formatCurrency(loan.monthlyPayment, profile.currency)}</strong></span>
                  </div>
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                  <span>📅 Next Amortization Due: <strong>{formatHumanDate(loan.nextDueDate)}</strong> ({formatDate(loan.nextDueDate)})</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  className="btn-primary"
                  style={{ width: '100%', background: 'var(--accent-indigo)' }}
                  onClick={() => openModal('payLoan', { loan })}
                >
                  Record Loan Payment
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LoansView;
