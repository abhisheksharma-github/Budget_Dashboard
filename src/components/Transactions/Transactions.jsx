import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatHumanDate, getCategoryMeta } from '../../utils/formatters';
import './Transactions.css';

const Transactions = () => {
  const { transactions, removeTransaction, openModal, setActiveView, profile } = useFinance();

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="grid-one-item grid-common grid-c2">
      <div className="grid-c-title">
        <h3 className="grid-c-title-text">
          <span>📋</span> Recent Activity
        </h3>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className="btn-ghost"
            style={{ fontSize: '12px', padding: '4px 8px' }}
            onClick={() => setActiveView('transactions')}
          >
            View All →
          </button>
          <button
            className="grid-c-title-icon"
            onClick={() => openModal('addTransaction')}
            title="Record Transaction"
            aria-label="Record Transaction"
          >
            <span>+</span>
          </button>
        </div>
      </div>

      <div className="tx-list-container">
        {recentTransactions.length === 0 ? (
          <div className="tx-empty">
            <span>🧾</span>
            <p>No transactions recorded yet.</p>
            <button
              className="btn-secondary"
              style={{ marginTop: '10px', fontSize: '12px' }}
              onClick={() => openModal('addTransaction')}
            >
              + Record Your First Expense
            </button>
          </div>
        ) : (
          <div className="tx-items">
            {recentTransactions.map((tx) => {
              const meta = getCategoryMeta(tx.category);
              const isIncome = tx.type === 'income';

              return (
                <div className="tx-item" key={tx.id}>
                  <div className="tx-left">
                    <div className="tx-icon" style={{ background: meta.bg, color: meta.color }}>
                      {meta.icon}
                    </div>
                    <div className="tx-info">
                      <div className="tx-name" title={tx.name}>{tx.name}</div>
                      <div className="tx-meta">
                        <span>{formatHumanDate(tx.date)}</span>
                        <span className="tx-dot">•</span>
                        <span className="tx-category">{tx.category}</span>
                        {tx.cardLast4 && (
                          <>
                            <span className="tx-dot">•</span>
                            <span className="font-mono">•••• {tx.cardLast4}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="tx-right">
                    <span
                      className={`tx-amount tabular-nums font-mono ${isIncome ? 'text-emerald' : 'text-rose'}`}
                    >
                      {isIncome ? '+' : '-'}{formatCurrency(tx.amount, profile.currency)}
                    </span>
                    <button
                      className="tx-delete-btn"
                      onClick={() => removeTransaction(tx.id)}
                      title="Delete Transaction"
                      aria-label="Delete Transaction"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
