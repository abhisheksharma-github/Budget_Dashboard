import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';
import './Cards.css';

const Cards = () => {
  const { cards, openModal, toggleFreezeCard, removeCard, addToast, profile } = useFinance();
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const activeCard = cards[activeCardIndex] || cards[0];

  const handleCopyCard = (card) => {
    navigator.clipboard?.writeText(`**** **** **** ${card.last4}`);
    addToast({
      type: 'info',
      title: 'Card Copied',
      message: `Card ending in ${card.last4} copied to clipboard.`
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
    <div className="grid-one-item grid-common grid-c1">
      <div className="grid-c-title">
        <h3 className="grid-c-title-text">
          <span>💳</span> Wallets & Cards
        </h3>
        <button
          className="grid-c-title-icon"
          onClick={() => openModal('addCard')}
          title="Add New Card"
          aria-label="Add New Card"
        >
          <span>+</span>
        </button>
      </div>

      {cards.length === 0 ? (
        <div className="cards-empty" onClick={() => openModal('addCard')}>
          <span>💳</span>
          <p>No cards linked yet.</p>
          <button className="btn-primary" style={{ marginTop: '8px' }}>+ Link Your First Card</button>
        </div>
      ) : (
        <div className="cards-content">
          {/* Virtual Card Front */}
          <div className={`virtual-card ${getThemeClass(activeCard.colorTheme)} ${activeCard.isFrozen ? 'card-frozen' : ''}`}>
            {activeCard.isFrozen && (
              <div className="frozen-overlay">
                <span>❄️ CARD FROZEN</span>
              </div>
            )}

            <div className="vcard-top">
              <div>
                <div className="vcard-bank">{activeCard.bank || 'National Bank'}</div>
                <div className="vcard-name">{activeCard.name}</div>
              </div>
              <div className="vcard-brand">{activeCard.brand}</div>
            </div>

            <div className="vcard-chip-row">
              <div className="vcard-chip"></div>
              <div className="vcard-contactless">)))</div>
            </div>

            <div className="vcard-number-row">
              <span className="vcard-dots">•••• •••• •••• </span>
              <span className="vcard-last4 font-mono">{activeCard.last4}</span>
            </div>

            <div className="vcard-bottom">
              <div>
                <div className="vcard-label">CARDHOLDER</div>
                <div className="vcard-val">{activeCard.holder || profile.name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="vcard-label">EXPIRES</div>
                <div className="vcard-val font-mono">{activeCard.expiry}</div>
              </div>
            </div>
          </div>

          {/* Quick Card Stats & Switcher */}
          <div className="card-stats-row">
            <div>
              <span className="text-muted" style={{ fontSize: '12px' }}>Available Balance</span>
              <div className="lg-value text-emerald" style={{ fontSize: '22px' }}>
                {formatCurrency(activeCard.balance, profile.currency)}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="text-muted" style={{ fontSize: '12px' }}>Credit Limit</span>
              <div className="tabular-nums font-mono" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {formatCurrency(activeCard.creditLimit, profile.currency)}
              </div>
            </div>
          </div>

          {/* Card Selectors */}
          {cards.length > 1 && (
            <div className="card-dots-selector">
              {cards.map((c, idx) => (
                <button
                  key={c.id}
                  className={`card-dot ${idx === activeCardIndex ? 'active' : ''}`}
                  onClick={() => setActiveCardIndex(idx)}
                  title={`${c.name} (•••• ${c.last4})`}
                />
              ))}
            </div>
          )}

          {/* Actions Bar */}
          <div className="card-actions-bar">
            <button
              className="btn-ghost"
              onClick={() => handleCopyCard(activeCard)}
              title="Copy Card Number"
            >
              📋 Copy
            </button>
            <button
              className="btn-ghost"
              onClick={() => toggleFreezeCard(activeCard.id)}
              style={{ color: activeCard.isFrozen ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}
            >
              {activeCard.isFrozen ? '🔓 Unfreeze' : '❄️ Freeze'}
            </button>
            {cards.length > 1 && (
              <button
                className="btn-ghost"
                onClick={() => removeCard(activeCard.id)}
                style={{ color: 'var(--accent-rose-light)' }}
                title="Remove Card"
              >
                ✕ Unlink
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cards;
