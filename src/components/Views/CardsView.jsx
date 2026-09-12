import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';
import './Views.css';
import '../Cards/Cards.css';

const CardsView = () => {
  const { cards, totalCardBalance, openModal, toggleFreezeCard, removeCard, addToast, profile } = useFinance();

  const totalCreditLimit = cards.reduce((sum, c) => sum + (c.creditLimit || 0), 0);
  const utilizationRate = totalCreditLimit > 0 ? Math.round((totalCardBalance / totalCreditLimit) * 100) : 0;

  const handleCopyCard = (card) => {
    navigator.clipboard?.writeText(`**** **** **** ${card.last4}`);
    addToast({
      type: 'info',
      title: 'Card Number Copied',
      message: `${card.brand} (•••• ${card.last4}) copied to clipboard.`
    });
  };

  const getThemeClass = (theme) => {
    switch (theme) {
      case 'amber': return 'theme-amber';
      case 'indigo': return 'theme-indigo';
      case 'emerald': return 'theme-emerald';
      case 'rose': return 'theme-rose';
      default: return 'theme-obsidian';
    }
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <div className="view-header-left">
          <h1>Wallets & Payment Cards</h1>
          <p>Manage physical and virtual credit/debit cards, security freeze locks, and credit utilization rates.</p>
        </div>
        <div className="view-header-actions">
          <button className="btn-primary" onClick={() => openModal('addCard')}>
            + Link New Card
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-title">Total Card Balances</span>
          <div className="kpi-val text-emerald tabular-nums font-mono">
            {formatCurrency(totalCardBalance, profile.currency)}
          </div>
          <div className="kpi-sub">
            <span>Cumulative liquidity across {cards.length} cards</span>
          </div>
        </div>

        <div className="kpi-card">
          <span className="kpi-title">Total Credit Line</span>
          <div className="kpi-val text-indigo tabular-nums font-mono">
            {formatCurrency(totalCreditLimit, profile.currency)}
          </div>
          <div className="kpi-sub">
            <span>Combined revolving credit capacity</span>
          </div>
        </div>

        <div className="kpi-card">
          <span className="kpi-title">Credit Utilization</span>
          <div className="kpi-val text-amber tabular-nums font-mono">
            {utilizationRate}%
          </div>
          <div className="kpi-sub">
            <span className="badge badge-emerald">✓ Optimal (&lt;30% recommended)</span>
          </div>
        </div>
      </div>

      {/* Cards Showcase Grid */}
      <div className="cards-grid">
        {cards.map((card) => (
          <div className="view-card" key={card.id} style={{ gap: '16px' }}>
            <div className={`virtual-card ${getThemeClass(card.colorTheme)} ${card.isFrozen ? 'card-frozen' : ''}`}>
              {card.isFrozen && (
                <div className="frozen-overlay">
                  <span>❄️ CARD FROZEN</span>
                </div>
              )}

              <div className="vcard-top">
                <div>
                  <div className="vcard-bank">{card.bank || 'National Bank'}</div>
                  <div className="vcard-name">{card.name}</div>
                </div>
                <div className="vcard-brand">{card.brand}</div>
              </div>

              <div className="vcard-chip-row">
                <div className="vcard-chip"></div>
                <div className="vcard-contactless">)))</div>
              </div>

              <div className="vcard-number-row">
                <span className="vcard-dots">•••• •••• •••• </span>
                <span className="vcard-last4 font-mono">{card.last4}</span>
              </div>

              <div className="vcard-bottom">
                <div>
                  <div className="vcard-label">CARDHOLDER</div>
                  <div className="vcard-val">{card.holder || profile.name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="vcard-label">EXPIRES</div>
                  <div className="vcard-val font-mono">{card.expiry}</div>
                </div>
              </div>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span className="text-muted" style={{ fontSize: '12px' }}>Current Balance:</span>
                <span className="font-mono tabular-nums text-emerald" style={{ fontWeight: 700 }}>
                  {formatCurrency(card.balance, profile.currency)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span className="text-muted">Credit Limit:</span>
                <span className="font-mono tabular-nums text-secondary">
                  {formatCurrency(card.creditLimit, profile.currency)}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
              <button
                className="btn-ghost"
                onClick={() => handleCopyCard(card)}
              >
                📋 Copy Number
              </button>
              <button
                className="btn-ghost"
                onClick={() => toggleFreezeCard(card.id)}
                style={{ color: card.isFrozen ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}
              >
                {card.isFrozen ? '🔓 Unfreeze' : '❄️ Freeze'}
              </button>
              {cards.length > 1 && (
                <button
                  className="btn-ghost"
                  style={{ color: 'var(--accent-rose-light)' }}
                  onClick={() => removeCard(card.id)}
                >
                  Unlink
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardsView;
