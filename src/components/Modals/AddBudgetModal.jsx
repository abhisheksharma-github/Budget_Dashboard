import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import Modal from './Modal';

const AddBudgetModal = ({ isOpen, onClose }) => {
  const { addBudget, profile } = useFinance();
  const [formData, setFormData] = useState({
    category: 'Food',
    limit: '',
    icon: '🍔'
  });

  const categoryIcons = {
    Food: '🍔',
    Housing: '🏠',
    Transport: '🚗',
    Utilities: '⚡',
    Entertainment: '🎬',
    Health: '💊',
    Shopping: '🛍️',
    Tech: '💻',
    Travel: '✈️',
    Education: '📚',
    Other: '📦'
  };

  const handleCategoryChange = (cat) => {
    setFormData({
      ...formData,
      category: cat,
      icon: categoryIcons[cat] || '📦'
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const limit = parseFloat(formData.limit);
    if (isNaN(limit) || limit <= 0) return;

    addBudget({
      ...formData,
      limit
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Set Category Budget Limit">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={formData.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            {Object.keys(categoryIcons).map((cat) => (
              <option key={cat} value={cat}>
                {categoryIcons[cat]} {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Monthly Allowance Limit ({profile.currency}) *</label>
          <input
            type="number"
            min="10"
            step="10"
            className="form-input"
            placeholder="e.g. 500"
            value={formData.limit}
            onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
            required
            autoFocus
          />
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Save Budget
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddBudgetModal;
