import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatHumanDate, getCategoryMeta } from '../../utils/formatters';
import './GlobalSearch.css';

const GlobalSearchModal = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    transactions,
    subscriptions,
    cards,
    setActiveView,
    openModal,
    profile
  } = useFinance();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isSearchOpen]);

  const quickNav = [
    { type: 'view', title: 'Dashboard Overview', icon: '🏠', action: () => setActiveView('overview') },
    { type: 'view', title: 'Transactions Ledger', icon: '📋', action: () => setActiveView('transactions') },
    { type: 'view', title: 'Budgets & Limits', icon: '📊', action: () => setActiveView('budget') },
    { type: 'view', title: 'Subscriptions & Bills', icon: '🔄', action: () => setActiveView('subscriptions') },
    { type: 'view', title: 'Savings Goals', icon: '🎯', action: () => setActiveView('savings') },
    { type: 'view', title: 'Cards & Wallets', icon: '💳', action: () => setActiveView('cards') },
    { type: 'view', title: 'Debt & Loans', icon: '📉', action: () => setActiveView('loans') },
    { type: 'view', title: 'Analytics & Reports', icon: '📈', action: () => setActiveView('reports') }
  ];

  const quickActions = [
    { type: 'action', title: 'Record Expense', icon: '📉', action: () => openModal('addTransaction', { type: 'expense' }) },
    { type: 'action', title: 'Record Income', icon: '📈', action: () => openModal('addTransaction', { type: 'income' }) },
    { type: 'action', title: 'Link Payment Card', icon: '💳', action: () => openModal('addCard') },
    { type: 'action', title: 'New Savings Goal', icon: '🎯', action: () => openModal('addSavings') }
  ];

  const searchResults = useMemo(() => {
    if (!query.trim()) {
      return {
        actions: quickActions,
        navigation: quickNav,
        transactions: [],
        subscriptions: []
      };
    }

    const q = query.toLowerCase().trim();

    const matchedTx = transactions.filter(
      (tx) =>
        tx.name.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q) ||
        (tx.notes && tx.notes.toLowerCase().includes(q)) ||
        tx.amount.toString().includes(q)
    ).slice(0, 5);

    const matchedSubs = subscriptions.filter(
      (s) => s.title.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedNav = quickNav.filter((n) => n.title.toLowerCase().includes(q));
    const matchedActions = quickActions.filter((a) => a.title.toLowerCase().includes(q));

    return {
      actions: matchedActions,
      navigation: matchedNav,
      transactions: matchedTx,
      subscriptions: matchedSubs
    };
  }, [query, transactions, subscriptions]);

  const handleSelect = (item) => {
    if (item.action) {
      item.action();
    } else if (item.category) {
      setActiveView('transactions');
    }
    setIsSearchOpen(false);
  };

  if (!isSearchOpen) return null;

  return (
    <div className="search-backdrop" onClick={() => setIsSearchOpen(false)}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search transactions, subscriptions, views, or commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="search-kbd-badge">ESC to close</span>
        </div>

        <div className="search-results-container">
          {searchResults.actions.length > 0 && (
            <div className="search-section">
              <div className="search-section-header">Quick Actions</div>
              {searchResults.actions.map((item, idx) => (
                <div
                  key={`act-${idx}`}
                  className="search-item"
                  onClick={() => handleSelect(item)}
                >
                  <span className="search-item-icon">{item.icon}</span>
                  <span className="search-item-title">{item.title}</span>
                  <span className="search-item-badge">Action</span>
                </div>
              ))}
            </div>
          )}

          {searchResults.transactions.length > 0 && (
            <div className="search-section">
              <div className="search-section-header">Transactions</div>
              {searchResults.transactions.map((tx) => {
                const meta = getCategoryMeta(tx.category);
                return (
                  <div
                    key={tx.id}
                    className="search-item"
                    onClick={() => handleSelect(tx)}
                  >
                    <span className="search-item-icon">{meta.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div className="search-item-title">{tx.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {formatHumanDate(tx.date)} • {tx.category}
                      </div>
                    </div>
                    <span
                      className="tabular-nums font-mono"
                      style={{
                        fontWeight: 600,
                        fontSize: '13px',
                        color: tx.type === 'income' ? 'var(--accent-emerald)' : 'var(--accent-rose)'
                      }}
                    >
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, profile.currency)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {searchResults.subscriptions.length > 0 && (
            <div className="search-section">
              <div className="search-section-header">Subscriptions</div>
              {searchResults.subscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="search-item"
                  onClick={() => {
                    setActiveView('subscriptions');
                    setIsSearchOpen(false);
                  }}
                >
                  <span className="search-item-icon">{sub.logo}</span>
                  <div style={{ flex: 1 }}>
                    <div className="search-item-title">{sub.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Due {formatHumanDate(sub.dueDate)} • {sub.frequency}
                    </div>
                  </div>
                  <span className="tabular-nums font-mono" style={{ fontWeight: 600, fontSize: '13px' }}>
                    {formatCurrency(sub.amount, profile.currency)}/mo
                  </span>
                </div>
              ))}
            </div>
          )}

          {searchResults.navigation.length > 0 && (
            <div className="search-section">
              <div className="search-section-header">Navigation</div>
              {searchResults.navigation.map((item, idx) => (
                <div
                  key={`nav-${idx}`}
                  className="search-item"
                  onClick={() => handleSelect(item)}
                >
                  <span className="search-item-icon">{item.icon}</span>
                  <span className="search-item-title">{item.title}</span>
                  <span className="search-item-badge">Jump</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;
