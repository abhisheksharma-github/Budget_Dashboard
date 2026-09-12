import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';
import './Report.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Report = () => {
  const { monthlyIncome, monthlyExpenses, monthlyCashflow, profile, setActiveView } = useFinance();
  const [timeframe, setTimeframe] = useState('6M');

  const months6 = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  const months3 = ['Aug', 'Sep', 'Oct'];
  const activeMonths = timeframe === '3M' ? months3 : months6;

  const chartData = useMemo(() => {
    // Generate realistic historical series ending with current live month
    const baseIncome = monthlyIncome || 6400;
    const baseExpense = monthlyExpenses || 3200;

    const incomeSeries = activeMonths.map((_, i) => {
      if (i === activeMonths.length - 1) return baseIncome;
      return Math.round(baseIncome * (0.85 + Math.sin(i * 1.5) * 0.15));
    });

    const expenseSeries = activeMonths.map((_, i) => {
      if (i === activeMonths.length - 1) return baseExpense;
      return Math.round(baseExpense * (0.9 + Math.cos(i * 1.2) * 0.12));
    });

    return {
      labels: activeMonths,
      datasets: [
        {
          label: 'Income',
          data: incomeSeries,
          backgroundColor: 'rgba(16, 185, 129, 0.85)',
          hoverBackgroundColor: '#10B981',
          borderRadius: 6,
          barThickness: activeMonths.length === 3 ? 20 : 12
        },
        {
          label: 'Expenses',
          data: expenseSeries,
          backgroundColor: 'rgba(244, 63, 94, 0.85)',
          hoverBackgroundColor: '#F43F5E',
          borderRadius: 6,
          barThickness: activeMonths.length === 3 ? 20 : 12
        }
      ]
    };
  }, [activeMonths, monthlyIncome, monthlyExpenses]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#1E2333',
        titleColor: '#F8FAFC',
        bodyColor: '#94A3B8',
        borderColor: 'rgba(255, 255, 255, 0.12)',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            return ` ${label}: ${formatCurrency(context.raw, profile.currency)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#64748B',
          font: {
            family: 'Plus Jakarta Sans',
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: '#64748B',
          font: {
            family: 'JetBrains Mono',
            size: 10
          },
          callback: (value) => formatCurrency(value, profile.currency, true)
        }
      }
    }
  };

  return (
    <div className="grid-one-item grid-common grid-c3">
      <div className="grid-c-title">
        <h3 className="grid-c-title-text">
          <span>📈</span> Cash Flow Trend
        </h3>
        <div className="chart-controls">
          <div className="timeframe-pills">
            <button
              className={`pill ${timeframe === '3M' ? 'active' : ''}`}
              onClick={() => setTimeframe('3M')}
            >
              3M
            </button>
            <button
              className={`pill ${timeframe === '6M' ? 'active' : ''}`}
              onClick={() => setTimeframe('6M')}
            >
              6M
            </button>
          </div>
          <button
            className="btn-ghost"
            style={{ fontSize: '11px', padding: '3px 6px' }}
            onClick={() => setActiveView('reports')}
          >
            Analytics →
          </button>
        </div>
      </div>

      <div className="report-summary-chips">
        <div className="chip">
          <span className="chip-dot dot-emerald"></span>
          <span className="chip-label">Inflow:</span>
          <span className="chip-val text-emerald font-mono tabular-nums">
            {formatCurrency(monthlyIncome, profile.currency, true)}
          </span>
        </div>
        <div className="chip">
          <span className="chip-dot dot-rose"></span>
          <span className="chip-label">Outflow:</span>
          <span className="chip-val text-rose font-mono tabular-nums">
            {formatCurrency(monthlyExpenses, profile.currency, true)}
          </span>
        </div>
        <div className="chip">
          <span className="chip-label">Net:</span>
          <span className={`chip-val font-mono tabular-nums ${monthlyCashflow >= 0 ? 'text-emerald' : 'text-rose'}`}>
            {monthlyCashflow >= 0 ? '+' : ''}{formatCurrency(monthlyCashflow, profile.currency, true)}
          </span>
        </div>
      </div>

      <div className="chart-canvas-wrapper">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default Report;
