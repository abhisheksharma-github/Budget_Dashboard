import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import Modal from './Modal';

const AddSubscriptionModal = ({ isOpen, onClose }) => {
  const { addSubscription, cards, profile } = useFinance();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Entertainment',
    amount: '',
    dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0],
    frequency: 'Monthly',
    cardLast4: cards[0]?.last4 || '4821',
    logo: '🎬'
  });

  const categoryLogos = {
    Entertainment: '🎬',
    Tech: '💻',
    Productivity: '⚡',
    Health: '💪',
    Music: '🎵',
    Cloud: '☁️',
    News: '📰',
    Other: '📦'
  };

  const handleCategoryChange = (cat) => {
    setFormData({
      ...formData,
      category: cat,
      logo: categoryLogos[cat] || '⚡'
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0 || !formData.title.trim()) return;

    addSubscription({
      ...formData,
      amount
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Recurring Subscription">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Service / Subscription Name *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Netflix, Spotify, iCloud, ChatGPT Plus"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            autoFocus
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label className="form-label">Recurring Cost ({profile.currency}) *</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              className="form-input"
              placeholder="14.99"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Billing Cycle</label>
            <select
              className="form-select"
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
            >
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={formData.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              {Object.keys(categoryLogos).map((cat) => (
                <option key={cat} value={cat}>
                  {categoryLogos[cat]} {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Next Renewal Date *</label>
            <input
              type="date"
              className="form-input"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Payment Card</label>
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

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Track Subscription
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddSubscriptionModal;
