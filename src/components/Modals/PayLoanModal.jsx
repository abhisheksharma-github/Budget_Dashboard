import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';
import Modal from './Modal';

const PayLoanModal = ({ isOpen, onClose, loan }) => {
  const { recordLoanPayment, profile } = useFinance();
  const [amount, setAmount] = useState(loan ? loan.monthlyPayment.toString() : '');

  if (!loan) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return;
    recordLoanPayment(loan.id, num);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Record Payment: ${loan.name}`}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            <span>Remaining Balance</span>
            <span className="tabular-nums font-mono" style={{ color: 'var(--accent-rose-light)', fontWeight: 600 }}>
              {formatCurrency(loan.remainingAmount, profile.currency)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span>Standard Monthly Due</span>
            <span className="tabular-nums font-mono">{formatCurrency(loan.monthlyPayment, profile.currency)}/mo</span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Payment Amount ({profile.currency}) *</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            max={loan.remainingAmount}
            className="form-input"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" style={{ background: 'var(--accent-indigo)' }}>
            Record Payment
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PayLoanModal;
