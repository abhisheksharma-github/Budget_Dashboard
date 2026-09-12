import { personsImgs } from '../utils/images';

export const initialProfile = {
  name: 'Jon Snow',
  title: 'Lead Software Architect',
  email: 'jon.snow@winterfell.dev',
  avatar: personsImgs.person_two,
  currency: 'USD',
  monthlyIncomeTarget: 9500,
  monthlySavingsTarget: 3000
};

export const initialCards = [
  {
    id: 'card-1',
    name: 'Sapphire Black',
    bank: 'Chase Bank',
    balance: 8420.50,
    creditLimit: 15000,
    last4: '4821',
    expiry: '08/28',
    holder: 'JON SNOW',
    brand: 'Visa',
    colorTheme: 'obsidian',
    isFrozen: false
  },
  {
    id: 'card-2',
    name: 'Gold Preferred',
    bank: 'American Express',
    balance: 3150.00,
    creditLimit: 10000,
    last4: '5290',
    expiry: '11/27',
    holder: 'JON SNOW',
    brand: 'Mastercard',
    colorTheme: 'amber',
    isFrozen: false
  },
  {
    id: 'card-3',
    name: 'Titanium Everyday',
    bank: 'Apple Card',
    balance: 1280.75,
    creditLimit: 7500,
    last4: '3712',
    expiry: '04/29',
    holder: 'JON SNOW',
    brand: 'Amex',
    colorTheme: 'indigo',
    isFrozen: false
  }
];

export const initialTransactions = [
  {
    id: 'tx-1',
    name: 'Whole Foods Market',
    category: 'Food',
    amount: 142.50,
    type: 'expense',
    date: new Date(Date.now() - 2 * 3600 * 1000).toISOString().split('T')[0],
    cardLast4: '4821',
    notes: 'Weekly organic groceries'
  },
  {
    id: 'tx-2',
    name: 'Stripe Payout - SaaS Retainer',
    category: 'Income',
    amount: 4850.00,
    type: 'income',
    date: new Date(Date.now() - 24 * 3600 * 1000).toISOString().split('T')[0],
    cardLast4: '4821',
    notes: 'Monthly consulting retainer'
  },
  {
    id: 'tx-3',
    name: 'Apple Store Regent St',
    category: 'Tech',
    amount: 329.00,
    type: 'expense',
    date: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString().split('T')[0],
    cardLast4: '3712',
    notes: 'AirPods Pro Gen 2'
  },
  {
    id: 'tx-4',
    name: 'Uber Premier',
    category: 'Transport',
    amount: 46.80,
    type: 'expense',
    date: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString().split('T')[0],
    cardLast4: '5290',
    notes: 'Airport transit'
  },
  {
    id: 'tx-5',
    name: 'Blue Bottle Coffee',
    category: 'Food',
    amount: 18.25,
    type: 'expense',
    date: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString().split('T')[0],
    cardLast4: '4821',
    notes: 'Team coffee sync'
  },
  {
    id: 'tx-6',
    name: 'Netflix 4K Ultra HD',
    category: 'Entertainment',
    amount: 22.99,
    type: 'expense',
    date: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString().split('T')[0],
    cardLast4: '4821',
    notes: 'Monthly recurring'
  },
  {
    id: 'tx-7',
    name: 'Equinox Gym Membership',
    category: 'Health',
    amount: 180.00,
    type: 'expense',
    date: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString().split('T')[0],
    cardLast4: '5290',
    notes: 'Monthly dues'
  },
  {
    id: 'tx-8',
    name: 'Dividend Yield - Vanguard VOO',
    category: 'Investment',
    amount: 385.40,
    type: 'income',
    date: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString().split('T')[0],
    cardLast4: '4821',
    notes: 'Quarterly index dividend'
  }
];

export const initialBudgets = [
  {
    id: 'bg-1',
    category: 'Housing',
    limit: 2200,
    icon: '🏠',
    period: 'monthly'
  },
  {
    id: 'bg-2',
    category: 'Food',
    limit: 750,
    icon: '🍔',
    period: 'monthly'
  },
  {
    id: 'bg-3',
    category: 'Transport',
    limit: 350,
    icon: '🚗',
    period: 'monthly'
  },
  {
    id: 'bg-4',
    category: 'Entertainment',
    limit: 300,
    icon: '🎬',
    period: 'monthly'
  },
  {
    id: 'bg-5',
    category: 'Tech',
    limit: 450,
    icon: '💻',
    period: 'monthly'
  },
  {
    id: 'bg-6',
    category: 'Health',
    limit: 250,
    icon: '💊',
    period: 'monthly'
  }
];

export const initialSubscriptions = [
  {
    id: 'sub-1',
    title: 'Netflix 4K UHD',
    category: 'Entertainment',
    amount: 22.99,
    dueDate: new Date(Date.now() + 4 * 24 * 3600 * 1000).toISOString().split('T')[0],
    frequency: 'Monthly',
    cardLast4: '4821',
    status: 'active',
    logo: '🎬'
  },
  {
    id: 'sub-2',
    title: 'Spotify Family',
    category: 'Entertainment',
    amount: 16.99,
    dueDate: new Date(Date.now() + 11 * 24 * 3600 * 1000).toISOString().split('T')[0],
    frequency: 'Monthly',
    cardLast4: '5290',
    status: 'active',
    logo: '🎵'
  },
  {
    id: 'sub-3',
    title: 'GitHub Copilot Pro',
    category: 'Tech',
    amount: 10.00,
    dueDate: new Date(Date.now() + 17 * 24 * 3600 * 1000).toISOString().split('T')[0],
    frequency: 'Monthly',
    cardLast4: '4821',
    status: 'active',
    logo: '🤖'
  },
  {
    id: 'sub-4',
    title: 'Figma Professional',
    category: 'Tech',
    amount: 15.00,
    dueDate: new Date(Date.now() + 23 * 24 * 3600 * 1000).toISOString().split('T')[0],
    frequency: 'Monthly',
    cardLast4: '3712',
    status: 'active',
    logo: '🎨'
  },
  {
    id: 'sub-5',
    title: 'AWS Cloud Infrastructure',
    category: 'Tech',
    amount: 54.20,
    dueDate: new Date(Date.now() + 28 * 24 * 3600 * 1000).toISOString().split('T')[0],
    frequency: 'Monthly',
    cardLast4: '4821',
    status: 'active',
    logo: '☁️'
  }
];

export const initialSavings = [
  {
    id: 'sav-1',
    title: 'High-Yield Emergency Fund',
    targetAmount: 25000,
    currentAmount: 18450,
    targetDate: '2026-12-31',
    category: 'Safety',
    icon: '🛡️',
    monthlyDeposit: 750
  },
  {
    id: 'sav-2',
    title: 'Tokyo & Kyoto Exploration',
    targetAmount: 6000,
    currentAmount: 4200,
    targetDate: '2027-04-20',
    category: 'Travel',
    icon: '🌸',
    monthlyDeposit: 300
  },
  {
    id: 'sav-3',
    title: 'EV Downpayment Reserve',
    targetAmount: 12000,
    currentAmount: 8900,
    targetDate: '2026-11-15',
    category: 'Vehicle',
    icon: '⚡',
    monthlyDeposit: 500
  }
];

export const initialLoans = [
  {
    id: 'loan-1',
    name: 'Tesla Model Y Auto Loan',
    lender: 'Chase Auto Finance',
    principal: 42000,
    remainingAmount: 16800,
    interestRate: 4.25,
    monthlyPayment: 620,
    nextDueDate: new Date(Date.now() + 15 * 24 * 3600 * 1000).toISOString().split('T')[0],
    type: 'Auto'
  },
  {
    id: 'loan-2',
    name: 'Undergrad Federal Student Loan',
    lender: 'Mohela Servicing',
    principal: 30000,
    remainingAmount: 12400,
    interestRate: 3.75,
    monthlyPayment: 380,
    nextDueDate: new Date(Date.now() + 22 * 24 * 3600 * 1000).toISOString().split('T')[0],
    type: 'Student'
  }
];

export const initialFinancialTips = [
  {
    id: 'tip-1',
    title: 'High Savings Rate Detected',
    message: 'You are currently saving 38% of your net monthly income, outperforming the recommended 20% benchmark.',
    type: 'positive',
    tag: 'Cashflow'
  },
  {
    id: 'tip-2',
    title: 'Upcoming Subscriptions Review',
    message: 'You have 5 active recurring subscriptions totaling $119.18/mo. Review unused cloud subscriptions to save ~$650/yr.',
    type: 'info',
    tag: 'Optimization'
  },
  {
    id: 'tip-3',
    title: 'Emergency Cushion Status',
    message: 'Your emergency fund now covers 5.2 months of fixed expenses. Target 6 months for complete financial resilience.',
    type: 'neutral',
    tag: 'Safety'
  },
  {
    id: 'tip-4',
    title: 'Debt Payoff Acceleration',
    message: 'Allocating an extra $150/mo towards your Tesla loan will save $1,120 in interest and shave 11 months off the term.',
    type: 'strategy',
    tag: 'Debt Payoff'
  }
];
