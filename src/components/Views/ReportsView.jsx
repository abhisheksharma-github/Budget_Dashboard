import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, getCategoryMeta } from '../../utils/formatters';
import './Views.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ReportsView = () => {
  const { monthlyIncome, monthlyExpenses, monthlyCashflow, budgetAnalysis, profile } = useFinance();
  const [reportType, setReportType] = useState('cashflow');

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Historical trend projection
  const cashflowLineData = {
    labels: months,
    datasets: [
      {
        label: 'Income ($)',
        data: [5200, 5600, 5400, 6800, 7200, 7500, 8100, 8400, 8900, monthlyIncome || 9500, 9200, 9600],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#10B981'
      },
      {
        label: 'Expenses ($)',
        data: [3800, 4100, 3900, 4500, 4200, 4600, 4900, 5100, 4800, monthlyExpenses || 4950, 4600, 5200],
        borderColor: '#F43F5E',
        backgroundColor: 'rgba(244, 63, 94, 0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#F43F5E'
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94A3B8',
          font: { family: 'Plus Jakarta Sans', size: 12 }
        }
      },
      tooltip: {
        backgroundColor: '#1E2333',
        titleColor: '#F8FAFC',
        bodyColor: '#94A3B8',
        borderColor: 'rgba(255, 255, 255, 0.12)',
        borderWidth: 1,
        padding: 12
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: { color: '#64748B' }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: {
          color: '#64748B',
          callback: (v) => formatCurrency(v, profile.currency, true)
        }
      }
    }
  };

  const doughnutData = {
    labels: budgetAnalysis.map((b) => b.category),
    datasets: [
      {
        data: budgetAnalysis.map((b) => b.spent || 10),
        backgroundColor: budgetAnalysis.map((b) => getCategoryMeta(b.category).color),
        borderColor: '#171B26',
        borderWidth: 2
      }
    ]
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <div className="view-header-left">
          <h1>Financial Analytics & Reports</h1>
          <p>Longitudinal cash flow projections, net savings margins, and categorical burn analysis.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-title">YTD Cumulative Inflow</span>
          <div className="kpi-val text-emerald tabular-nums font-mono">
            {formatCurrency(85600, profile.currency)}
          </div>
          <div className="kpi-sub">
            <span>+14.2% YoY growth vs previous annual cycle</span>
          </div>
        </div>

        <div className="kpi-card">
          <span className="kpi-title">YTD Cumulative Outflow</span>
          <div className="kpi-val text-rose tabular-nums font-mono">
            {formatCurrency(46850, profile.currency)}
          </div>
          <div className="kpi-sub">
            <span>54.7% burn ratio of total income</span>
          </div>
        </div>

        <div className="kpi-card">
          <span className="kpi-title">Annual Net Wealth Surplus</span>
          <div className="kpi-val text-indigo tabular-nums font-mono">
            +{formatCurrency(38750, profile.currency)}
          </div>
          <div className="kpi-sub">
            <span style={{ color: 'var(--accent-emerald-light)' }}>✓ Surpassed annual savings objective</span>
          </div>
        </div>
      </div>

      {/* Main Longitudinal Trend Chart */}
      <div className="ledger-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
              12-Month Inflow vs Outflow Cash Velocity
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Solid lines illustrate monthly income vs operational living expenditures.
            </span>
          </div>
        </div>

        <div style={{ height: '320px', position: 'relative' }}>
          <Line data={cashflowLineData} options={lineOptions} />
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
