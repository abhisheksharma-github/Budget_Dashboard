import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import Modal from './Modal';

const AddTransactionModal = ({ isOpen, onClose, initialType = 'expense' }) => {
  const { addTransaction, cards, profile } = useFinance();
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    type: initialType,
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    cardLast4: cards[0]?.last4 || '4821',
    notes: ''
  });
  const [error, setError] = useState('');

  const categories = ['Food', 'Housing', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Shopping', 'Tech', 'Investment', 'Income', 'Other'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please provide a description or merchant name.');
      return;
    }
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }

    addTransaction({
      ...formData,
      amount
    });
    setFormData({
      name: '',
      amount: '',
      type: 'expense',
      category: 'Food',
      date: new Date().toISOString().split('T')[0],
      cardLast4: cards[0]?.last4 || '4821',
      notes: ''
    });
    setError('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Transaction">
      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{ padding: '8px 12px', background: 'var(--accent-rose-bg)', color: 'var(--accent-rose-light)', borderRadius: 'var(--radius-sm)', fontSize: '13px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button
            type="button"
            className={formData.type === 'expense' ? 'btn-danger' : 'btn-secondary'}
            style={{ flex: 1 }}
            onClick={() => setFormData((p) => ({ ...p, type: 'expense', category: p.category === 'Income' ? 'Food' : p.category }))}
          >
            📉 Expense
          </button>
          <button
            type="button"
            className={formData.type === 'income' ? 'btn-primary' : 'btn-secondary'}
            style={{ flex: 1, background: formData.type === 'income' ? 'var(--accent-emerald)' : undefined }}
            onClick={() => setFormData((p) => ({ ...p, type: 'income', category: 'Income' }))}
          >
            📈 Income / Deposit
          </button>
        </div>

        <div className="form-group">
          <label className="form-label">Merchant / Description *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Whole Foods, Client Payout, Uber"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            autoFocus
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label className="form-label">Amount ({profile.currency}) *</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              className="form-input"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-input"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Account / Card</label>
            <select
              className="form-select"
              value={formData.cardLast4}
              onChange={(e) => setFormData({ ...formData, cardLast4: e.target.value })}
            >
              {cards.map((c) => (
                <option key={c.id} value={c.last4}>
                  {c.brand} (•••• {c.last4})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Optional Notes / Tag</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Business lunch, tax deductible"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Save Transaction
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTransactionModal;
