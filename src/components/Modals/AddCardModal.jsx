import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import Modal from './Modal';

const AddCardModal = ({ isOpen, onClose }) => {
  const { addCard, profile } = useFinance();
  const [formData, setFormData] = useState({
    name: 'Sapphire Reserve',
    bank: 'Chase Bank',
    balance: '',
    creditLimit: '',
    last4: '',
    expiry: '',
    holder: profile.name,
    brand: 'Visa',
    colorTheme: 'obsidian'
  });
  const [error, setError] = useState('');

  const themes = [
    { id: 'obsidian', name: 'Obsidian Slate', bg: 'linear-gradient(135deg, #1e293b, #0f172a)' },
    { id: 'indigo', name: 'Royal Indigo', bg: 'linear-gradient(135deg, #312e81, #1e1b4b)' },
    { id: 'amber', name: 'Champagne Gold', bg: 'linear-gradient(135deg, #78350f, #451a03)' },
    { id: 'emerald', name: 'Emerald Velvet', bg: 'linear-gradient(135deg, #064e3b, #022c22)' },
    { id: 'rose', name: 'Midnight Rose', bg: 'linear-gradient(135deg, #881337, #4c0519)' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(formData.last4)) {
      setError('Please enter exactly 4 digits for card number.');
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(formData.expiry)) {
      setError('Expiry date must follow MM/YY format (e.g. 09/28).');
      return;
    }

    addCard({
      ...formData,
      balance: parseFloat(formData.balance) || 0,
      creditLimit: parseFloat(formData.creditLimit) || 10000
    });
    setError('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Link New Payment Card">
      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{ padding: '8px 12px', background: 'var(--accent-rose-bg)', color: 'var(--accent-rose-light)', borderRadius: 'var(--radius-sm)', fontSize: '13px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Card Nickname</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Sapphire Reserve, Apple Card"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label className="form-label">Issuing Bank</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Chase, Amex, Apple"
              value={formData.bank}
              onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Card Network</label>
            <select
              className="form-select"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            >
              <option value="Visa">Visa</option>
              <option value="Mastercard">Mastercard</option>
              <option value="Amex">American Express</option>
              <option value="Discover">Discover</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label className="form-label">Current Balance ({profile.currency})</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="form-input"
              placeholder="0.00"
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Credit Limit / Available</label>
            <input
              type="number"
              step="1"
              min="100"
              className="form-input"
              placeholder="10000"
              value={formData.creditLimit}
              onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
              required
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label className="form-label">Last 4 Digits *</label>
            <input
              type="text"
              maxLength={4}
              className="form-input"
              placeholder="4821"
              value={formData.last4}
              onChange={(e) => setFormData({ ...formData, last4: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Expiry (MM/YY) *</label>
            <input
              type="text"
              maxLength={5}
              className="form-input"
              placeholder="08/28"
              value={formData.expiry}
              onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Card Design Sheen</label>
          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            {themes.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setFormData({ ...formData, colorTheme: t.id })}
                style={{
                  flex: 1,
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  background: t.bg,
                  border: formData.colorTheme === t.id ? '2px solid #FFFFFF' : '1px solid var(--border-medium)',
                  boxShadow: formData.colorTheme === t.id ? '0 0 10px rgba(255,255,255,0.4)' : 'none',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease'
                }}
                title={t.name}
              />
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Add to Wallet
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddCardModal;
