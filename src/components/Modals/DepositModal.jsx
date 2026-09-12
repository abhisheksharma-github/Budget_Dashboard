import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';
import Modal from './Modal';

const DepositModal = ({ isOpen, onClose, goal }) => {
  const { depositToSavings, profile } = useFinance();
  const [amount, setAmount] = useState('');

  if (!goal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return;
    depositToSavings(goal.id, num);
  };

  const quickAmounts = [50, 100, 250, 500];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Deposit to "${goal.title}"`}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
            <span>Current Progress</span>
            <span className="tabular-nums font-mono" style={{ color: 'var(--accent-emerald-light)', fontWeight: 600 }}>
              {formatCurrency(goal.currentAmount, profile.currency)} / {formatCurrency(goal.targetAmount, profile.currency)}
            </span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
            <div
              style={{
                width: `${Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))}%`,
                height: '100%',
                background: 'var(--accent-emerald)',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Deposit Amount ({profile.currency}) *</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            className="form-input"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {quickAmounts.map((q) => (
            <button
              key={q}
              type="button"
              className="btn-secondary"
              style={{ flex: 1, padding: '6px 0', fontSize: '12px' }}
              onClick={() => setAmount(q.toString())}
            >
              +{formatCurrency(q, profile.currency, true)}
            </button>
          ))}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" style={{ background: 'var(--accent-emerald)' }}>
            Confirm Deposit
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DepositModal;
