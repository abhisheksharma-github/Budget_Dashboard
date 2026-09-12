import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';
import Cards from '../Cards/Cards';
import Transactions from '../Transactions/Transactions';
import Report from '../Report/Report';
import Budget from '../Budget/Budget';
import Subscriptions from '../Subscriptions/Subscriptions';
import Savings from '../Savings/Savings';
import Loans from '../Loans/Loans';
import Financial from '../Financial/Financial';
import './Views.css';
import '../ContentMain/ContentMain.css';

const OverviewView = () => {
  const {
    netWorth,
    totalCardBalance,
    totalSavings,
    totalDebt,
    monthlyIncome,
    monthlyExpenses,
    savingsRate,
    openModal,
    profile
  } = useFinance();

  return (
    <div className="view-container">
      {/* KPI Top Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-title">Net Wealth</span>
            <div className="kpi-icon" style={{ background: 'var(--accent-indigo-bg)', color: 'var(--accent-indigo-light)' }}>
              💎
            </div>
          </div>
          <div className="kpi-val text-indigo tabular-nums font-mono">
            {formatCurrency(netWorth, profile.currency)}
          </div>
          <div className="kpi-sub">
            <span style={{ color: 'var(--accent-emerald-light)' }}>
              +{formatCurrency(totalCardBalance + totalSavings, profile.currency, true)} assets
            </span>
            <span>•</span>
            <span style={{ color: 'var(--accent-rose-light)' }}>
              -{formatCurrency(totalDebt, profile.currency, true)} debt
            </span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-title">Monthly Income</span>
            <div className="kpi-icon" style={{ background: 'var(--accent-emerald-bg)', color: 'var(--accent-emerald)' }}>
              💰
            </div>
          </div>
          <div className="kpi-val text-emerald tabular-nums font-mono">
            +{formatCurrency(monthlyIncome, profile.currency)}
          </div>
          <div className="kpi-sub">
            <span>Target: {formatCurrency(profile.monthlyIncomeTarget || 9500, profile.currency, true)}/mo</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-title">Monthly Spending</span>
            <div className="kpi-icon" style={{ background: 'var(--accent-rose-bg)', color: 'var(--accent-rose)' }}>
              💳
            </div>
          </div>
          <div className="kpi-val text-rose tabular-nums font-mono">
            -{formatCurrency(monthlyExpenses, profile.currency)}
          </div>
          <div className="kpi-sub">
            <span>Across all linked payment cards</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-title">Savings Rate</span>
            <div className="kpi-icon" style={{ background: 'var(--accent-amber-bg)', color: 'var(--accent-amber)' }}>
              🚀
            </div>
          </div>
          <div className="kpi-val text-amber tabular-nums font-mono">
            {savingsRate}%
          </div>
          <div className="kpi-sub">
            <span className="badge badge-emerald" style={{ fontSize: '11px', padding: '1px 6px' }}>
              ✓ Benchmark (20%+) met
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Tray */}
      <div className="quick-action-tray">
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Quick Actions:
        </span>
        <button
          className="quick-action-btn"
          onClick={() => openModal('addTransaction', { type: 'expense' })}
        >
          <span>📉</span> Log Expense
        </button>
        <button
          className="quick-action-btn"
          onClick={() => openModal('addTransaction', { type: 'income' })}
        >
          <span>📈</span> Record Income
        </button>
        <button
          className="quick-action-btn"
          onClick={() => openModal('addCard')}
        >
          <span>💳</span> Link Card
        </button>
        <button
          className="quick-action-btn"
          onClick={() => openModal('addSavings')}
        >
          <span>🎯</span> New Goal
        </button>
        <button
          className="quick-action-btn"
          onClick={() => openModal('addSubscription')}
        >
          <span>🔄</span> Track Bill
        </button>
      </div>

      {/* Main Grid Widgets */}
      <div className="main-content-holder">
        <div className="content-grid-one">
          <Cards />
          <Transactions />
          <Report />
        </div>
        <div className="content-grid-two">
          <Budget />
          <div className="grid-two-item">
            <div className="subgrid-two">
              <Subscriptions />
              <Savings />
            </div>
          </div>
          <div className="grid-two-item">
            <div className="subgrid-two">
              <Loans />
              <Financial />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewView;
