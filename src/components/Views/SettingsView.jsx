import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { CURRENCY_SYMBOLS } from '../../utils/formatters';
import './Views.css';

const SettingsView = () => {
  const { profile, updateProfile, resetToDefaultData } = useFinance();
  const [formData, setFormData] = useState({
    name: profile.name,
    title: profile.title,
    email: profile.email,
    currency: profile.currency || 'USD',
    monthlyIncomeTarget: profile.monthlyIncomeTarget || 9500,
    monthlySavingsTarget: profile.monthlySavingsTarget || 3000
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <div className="view-header-left">
          <h1>Account Preferences & Configuration</h1>
          <p>Customize system currencies, monthly financial goals, profile information, and cache states.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Profile and Preferences Form */}
        <div className="ledger-card">
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
            User Profile & Targets
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Professional Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Primary Display Currency</label>
                <select
                  className="form-select"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                >
                  {Object.keys(CURRENCY_SYMBOLS).map((code) => (
                    <option key={code} value={code}>
                      {code} ({CURRENCY_SYMBOLS[code]})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Monthly Target Income</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.monthlyIncomeTarget}
                  onChange={(e) => setFormData({ ...formData, monthlyIncomeTarget: Number(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button type="submit" className="btn-primary">
                Save Preferences
              </button>
            </div>
          </form>
        </div>

        {/* Data Persistence & Danger Zone */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="ledger-card">
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)' }}>
              Local Cache Sync
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Your financial state is automatically encrypted and saved to your browser’s localStorage cache.
            </p>
            <div className="badge badge-emerald">
              ✓ Local Storage Active
            </div>
          </div>

          <div className="ledger-card" style={{ borderColor: 'rgba(244, 63, 94, 0.3)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px', color: 'var(--accent-rose-light)' }}>
              Restore Sample Data
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Reset all transaction ledgers, card balances, budgets, and goals back to the initial sample state.
            </p>
            <button
              type="button"
              className="btn-danger"
              style={{ width: '100%' }}
              onClick={resetToDefaultData}
            >
              🔄 Reset to Demo Records
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
