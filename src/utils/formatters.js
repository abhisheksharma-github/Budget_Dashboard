// Currency Symbols and Formatting
export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥',
  CAD: 'CA$',
  AUD: 'AU$'
};

/**
 * Format a number as currency
 * @param {number} amount
 * @param {string} currencyCode
 * @param {boolean} compact
 */
export const formatCurrency = (amount, currencyCode = 'USD', compact = false) => {
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  const symbol = CURRENCY_SYMBOLS[currencyCode] || '$';

  if (compact && Math.abs(num) >= 1000) {
    const formatted = Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(num);
    return `${symbol}${formatted}`;
  }

  const parts = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Math.abs(num));

  return `${num < 0 ? '-' : ''}${symbol}${parts}`;
};

/**
 * Format relative date (e.g. "Today", "Yesterday", "Due in 3 days", "Oct 12, 2024")
 * @param {string|Date} dateStr
 */
export const formatHumanDate = (dateStr) => {
  if (!dateStr) return '';
  const target = new Date(dateStr);
  if (isNaN(target.getTime())) return dateStr;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const compareDate = new Date(target.getFullYear(), target.getMonth(), target.getDate());

  const diffDays = Math.round((compareDate - today) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;

  return target.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: target.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

/**
 * Format standard date
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Category styling & icon metadata
 */
export const CATEGORY_META = {
  Food: { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)', icon: '🍔' },
  Housing: { color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.12)', icon: '🏠' },
  Utilities: { color: '#06B6D4', bg: 'rgba(6, 182, 212, 0.12)', icon: '⚡' },
  Entertainment: { color: '#EC4899', bg: 'rgba(236, 72, 153, 0.12)', icon: '🎬' },
  Transport: { color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.12)', icon: '🚗' },
  Health: { color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)', icon: '💊' },
  Shopping: { color: '#F43F5E', bg: 'rgba(244, 63, 94, 0.12)', icon: '🛍️' },
  Income: { color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)', icon: '💰' },
  Tech: { color: '#6366F1', bg: 'rgba(99, 102, 241, 0.12)', icon: '💻' },
  Investment: { color: '#14B8A6', bg: 'rgba(20, 184, 166, 0.12)', icon: '📈' },
  Other: { color: '#94A3B8', bg: 'rgba(148, 163, 184, 0.12)', icon: '📦' }
};

export const getCategoryMeta = (category) => {
  return CATEGORY_META[category] || CATEGORY_META.Other;
};

/**
 * Export array of transaction objects to CSV file download
 */
export const exportToCSV = (items, filename = 'transactions.csv') => {
  if (!items || !items.length) return;

  const headers = ['ID', 'Date', 'Description', 'Category', 'Type', 'Amount', 'Card Last 4', 'Notes'];
  const rows = items.map(item => [
    item.id,
    item.date,
    `"${(item.name || item.description || '').replace(/"/g, '""')}"`,
    item.category || 'Other',
    item.type || 'expense',
    item.amount,
    item.cardLast4 || 'N/A',
    `"${(item.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
