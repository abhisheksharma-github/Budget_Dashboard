import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import Modal from './Modal';

const AddSavingsModal = ({ isOpen, onClose }) => {
  const { addSavingsGoal, profile } = useFinance();
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '2026-12-31',
    category: 'General',
    icon: '🎯',
    monthlyDeposit: ''
  });

  const icons = ['🎯', '🛡️', '🌸', '🚗', '🏠', '💻', '💍', '👶', '✈️', '📈'];

  const handleSubmit = (e) => {
    e.preventDefault();
    const targetAmount = parseFloat(formData.targetAmount);
    if (isNaN(targetAmount) || targetAmount <= 0 || !formData.title.trim()) return;

    addSavingsGoal({
      ...formData,
      targetAmount,
      currentAmount: parseFloat(formData.currentAmount) || 0,
      monthlyDeposit: parseFloat(formData.monthlyDeposit) || 0
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Savings Goal">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Goal Title *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Dream Vacation, House Downpayment, Emergency Fund"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            autoFocus
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label className="form-label">Target Amount ({profile.currency}) *</label>
            <input
              type="number"
              min="10"
              step="10"
              className="form-input"
              placeholder="10000"
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Initial Balance ({profile.currency})</label>
            <input
              type="number"
              min="0"
              step="10"
              className="form-input"
              placeholder="0"
              value={formData.currentAmount}
              onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label className="form-label">Target Completion Date</label>
            <input
              type="date"
              className="form-input"
              value={formData.targetDate}
              onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Planned Monthly Deposit</label>
            <input
              type="number"
              min="0"
              step="10"
              className="form-input"
              placeholder="250"
              value={formData.monthlyDeposit}
              onChange={(e) => setFormData({ ...formData, monthlyDeposit: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Goal Icon</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
            {icons.map((ic) => (
              <button
                key={ic}
                type="button"
                onClick={() => setFormData({ ...formData, icon: ic })}
                style={{
                  width: '38px',
                  height: '38px',
                  fontSize: '20px',
                  borderRadius: 'var(--radius-sm)',
                  background: formData.icon === ic ? 'var(--accent-indigo-bg)' : 'var(--bg-input)',
                  border: formData.icon === ic ? '2px solid var(--accent-indigo)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Create Goal
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddSavingsModal;
