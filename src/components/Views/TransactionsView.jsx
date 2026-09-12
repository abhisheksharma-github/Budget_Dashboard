import React, { useState, useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatHumanDate, formatDate, getCategoryMeta, exportToCSV } from '../../utils/formatters';
import './Views.css';

const TransactionsView = () => {
  const { transactions, removeTransaction, openModal, addToast, profile } = useFinance();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [sortBy, setSortBy] = useState('date-desc');

  const categories = ['ALL', 'Food', 'Housing', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Shopping', 'Tech', 'Investment', 'Income', 'Other'];

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (tx) =>
          tx.name.toLowerCase().includes(q) ||
          tx.category.toLowerCase().includes(q) ||
          (tx.notes && tx.notes.toLowerCase().includes(q)) ||
          tx.amount.toString().includes(q)
      );
    }

    if (selectedCategory !== 'ALL') {
      result = result.filter((tx) => tx.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (selectedType !== 'ALL') {
      result = result.filter((tx) => tx.type === selectedType);
    }

    result.sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'amount-asc') return a.amount - b.amount;
      return 0;
    });

    return result;
  }, [transactions, search, selectedCategory, selectedType, sortBy]);

  const handleExport = () => {
    exportToCSV(filteredTransactions, `transactions-${new Date().toISOString().split('T')[0]}.csv`);
    addToast({
      type: 'success',
      title: 'CSV Exported',
      message: `Downloaded ${filteredTransactions.length} transaction records.`
    });
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <div className="view-header-left">
          <h1>Transactions Ledger</h1>
          <p>Real-time audit log of all account inflows, expenses, and automated card syncs.</p>
        </div>
        <div className="view-header-actions">
          <button className="btn-secondary" onClick={handleExport}>
            📥 Export CSV
          </button>
          <button className="btn-primary" onClick={() => openModal('addTransaction')}>
            + Record Transaction
          </button>
        </div>
      </div>

      <div className="ledger-card">
        {/* Filters Bar */}
        <div className="ledger-filters-bar">
          <div className="ledger-search-box">
            <span>🔍</span>
            <input
              type="text"
              className="ledger-search-input"
              placeholder="Filter by merchant, notes, or amount..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                style={{ color: 'var(--text-muted)', fontSize: '14px' }}
                onClick={() => setSearch('')}
              >
                &times;
              </button>
            )}
          </div>

          <div className="ledger-filter-group">
            <select
              className="ledger-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'ALL' ? 'All Categories' : c}
                </option>
              ))}
            </select>

            <select
              className="ledger-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="ALL">All Types</option>
              <option value="expense">Expenses Only</option>
              <option value="income">Income Only</option>
            </select>

            <select
              className="ledger-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Amount: High to Low</option>
              <option value="amount-asc">Amount: Low to High</option>
            </select>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="ledger-table-wrapper">
          {filteredTransactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '36px', display: 'block', marginBottom: '8px' }}>🔍</span>
              <p>No matching transactions found.</p>
            </div>
          ) : (
            <table className="ledger-table">
              <thead>
                <tr>
                  <th>Description / Merchant</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Payment Method</th>
                  <th>Type</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => {
                  const meta = getCategoryMeta(tx.category);
                  const isIncome = tx.type === 'income';

                  return (
                    <tr key={tx.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '18px' }}>{meta.icon}</span>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{tx.name}</div>
                            {tx.notes && <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{tx.notes}</div>}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className="badge"
                          style={{ background: meta.bg, color: meta.color }}
                        >
                          {tx.category}
                        </span>
                      </td>
                      <td>
                        <div>
                          <div style={{ color: 'var(--text-primary)' }}>{formatHumanDate(tx.date)}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{formatDate(tx.date)}</div>
                        </div>
                      </td>
                      <td>
                        <span className="font-mono" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          •••• {tx.cardLast4 || 'Card'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${isIncome ? 'badge-emerald' : 'badge-rose'}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span
                          className={`tabular-nums font-mono ${isIncome ? 'text-emerald' : 'text-rose'}`}
                          style={{ fontWeight: 700, fontSize: '14px' }}
                        >
                          {isIncome ? '+' : '-'}{formatCurrency(tx.amount, profile.currency)}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          className="btn-ghost"
                          style={{ color: 'var(--text-muted)', padding: '4px 8px' }}
                          onClick={() => removeTransaction(tx.id)}
                          title="Delete Record"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsView;
