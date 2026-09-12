import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  initialProfile,
  initialCards,
  initialTransactions,
  initialBudgets,
  initialSubscriptions,
  initialSavings,
  initialLoans,
  initialFinancialTips
} from '../data/seedData';

const LOCAL_STORAGE_KEY = 'FINANCE_DASHBOARD_STATE_V2';

export const FinanceContext = createContext(null);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

export const FinanceProvider = ({ children }) => {
  // Load initial state from local storage or fallback to seed data
  const loadStoredData = () => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not load stored finance state:', e);
    }
    return {
      profile: initialProfile,
      cards: initialCards,
      transactions: initialTransactions,
      budgets: initialBudgets,
      subscriptions: initialSubscriptions,
      savings: initialSavings,
      loans: initialLoans,
      financialTips: initialFinancialTips
    };
  };

  const [data, setData] = useState(loadStoredData);
  const [activeView, setActiveView] = useState('overview');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // { name: 'addTransaction' | 'addCard' | ... , payload: {} }
  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Auto-persist state to localStorage on modification
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save finance state to localStorage:', e);
    }
  }, [data]);

  // Toast manager
  const addToast = useCallback((toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newToast = { id, type: 'info', duration: 4000, ...toast };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, newToast.duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Modal manager
  const openModal = useCallback((name, payload = {}) => {
    setActiveModal({ name, payload });
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  // Reset to default seed data
  const resetToDefaultData = useCallback(() => {
    const resetState = {
      profile: initialProfile,
      cards: initialCards,
      transactions: initialTransactions,
      budgets: initialBudgets,
      subscriptions: initialSubscriptions,
      savings: initialSavings,
      loans: initialLoans,
      financialTips: initialFinancialTips
    };
    setData(resetState);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    addToast({
      type: 'success',
      title: 'Data Reset',
      message: 'Restored all sample financial records to initial state.'
    });
  }, [addToast]);

  // Profile Actions
  const updateProfile = useCallback((updates) => {
    setData((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...updates }
    }));
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your settings and preferences have been saved.'
    });
  }, [addToast]);

  // Card Actions
  const addCard = useCallback((cardData) => {
    const newCard = {
      id: `card-${Date.now()}`,
      balance: parseFloat(cardData.balance) || 0,
      creditLimit: parseFloat(cardData.creditLimit) || 10000,
      last4: cardData.last4 || '1234',
      expiry: cardData.expiry || '12/28',
      holder: (cardData.holder || data.profile.name).toUpperCase(),
      brand: cardData.brand || 'Visa',
      bank: cardData.bank || 'National Bank',
      colorTheme: cardData.colorTheme || 'obsidian',
      isFrozen: false
    };

    setData((prev) => ({
      ...prev,
      cards: [newCard, ...prev.cards]
    }));

    addToast({
      type: 'success',
      title: 'Card Linked',
      message: `${newCard.brand} ending in •••• ${newCard.last4} added to your wallet.`
    });
    closeModal();
  }, [data.profile.name, addToast, closeModal]);

  const removeCard = useCallback((cardId) => {
    setData((prev) => {
      const card = prev.cards.find((c) => c.id === cardId);
      return {
        ...prev,
        cards: prev.cards.filter((c) => c.id !== cardId)
      };
    });
    addToast({
      type: 'info',
      title: 'Card Removed',
      message: 'The card has been unlinked from your account.'
    });
  }, [addToast]);

  const toggleFreezeCard = useCallback((cardId) => {
    setData((prev) => {
      const updated = prev.cards.map((c) => {
        if (c.id === cardId) {
          const isFrozen = !c.isFrozen;
          addToast({
            type: isFrozen ? 'warning' : 'success',
            title: isFrozen ? 'Card Frozen' : 'Card Unfrozen',
            message: `${c.brand} (•••• ${c.last4}) is now ${isFrozen ? 'locked for security' : 'active'}.`
          });
          return { ...c, isFrozen };
        }
        return c;
      });
      return { ...prev, cards: updated };
    });
  }, [addToast]);

  // Transaction Actions (with automatic card balance synchronization)
  const addTransaction = useCallback((tx) => {
    const amount = parseFloat(tx.amount);
    if (isNaN(amount) || amount <= 0) return;

    const newTx = {
      id: `tx-${Date.now()}`,
      name: tx.name.trim(),
      category: tx.category || 'Other',
      amount,
      type: tx.type || 'expense',
      date: tx.date || new Date().toISOString().split('T')[0],
      cardLast4: tx.cardLast4 || (data.cards[0] ? data.cards[0].last4 : '4821'),
      notes: tx.notes ? tx.notes.trim() : ''
    };

    setData((prev) => {
      // Synchronize matching card balance
      const updatedCards = prev.cards.map((card) => {
        if (card.last4 === newTx.cardLast4 || (!newTx.cardLast4 && card.id === prev.cards[0]?.id)) {
          const balanceDelta = newTx.type === 'income' ? newTx.amount : -newTx.amount;
          return {
            ...card,
            balance: Math.max(0, parseFloat((card.balance + balanceDelta).toFixed(2)))
          };
        }
        return card;
      });

      return {
        ...prev,
        transactions: [newTx, ...prev.transactions],
        cards: updatedCards
      };
    });

    addToast({
      type: newTx.type === 'income' ? 'success' : 'info',
      title: newTx.type === 'income' ? 'Income Recorded' : 'Expense Logged',
      message: `${newTx.name} for $${newTx.amount.toFixed(2)} recorded.`
    });
    closeModal();
  }, [data.cards, addToast, closeModal]);

  const removeTransaction = useCallback((txId) => {
    setData((prev) => {
      const tx = prev.transactions.find((t) => t.id === txId);
      if (!tx) return prev;

      // Reverse card balance impact
      const updatedCards = prev.cards.map((card) => {
        if (card.last4 === tx.cardLast4) {
          const balanceDelta = tx.type === 'income' ? -tx.amount : tx.amount;
          return {
            ...card,
            balance: Math.max(0, parseFloat((card.balance + balanceDelta).toFixed(2)))
          };
        }
        return card;
      });

      return {
        ...prev,
        transactions: prev.transactions.filter((t) => t.id !== txId),
        cards: updatedCards
      };
    });

    addToast({
      type: 'info',
      title: 'Transaction Removed',
      message: 'Ledger record deleted and card balances adjusted.'
    });
  }, [addToast]);

  // Budget Actions
  const addBudget = useCallback((budget) => {
    const newBudget = {
      id: `bg-${Date.now()}`,
      category: budget.category,
      limit: parseFloat(budget.limit) || 500,
      icon: budget.icon || '📦',
      period: 'monthly'
    };

    setData((prev) => {
      // If category exists, update limit instead
      const exists = prev.budgets.some((b) => b.category.toLowerCase() === newBudget.category.toLowerCase());
      if (exists) {
        return {
          ...prev,
          budgets: prev.budgets.map((b) =>
            b.category.toLowerCase() === newBudget.category.toLowerCase()
              ? { ...b, limit: newBudget.limit, icon: newBudget.icon }
              : b
          )
        };
      }
      return {
        ...prev,
        budgets: [...prev.budgets, newBudget]
      };
    });

    addToast({
      type: 'success',
      title: 'Budget Set',
      message: `Allocated $${newBudget.limit} for ${newBudget.category}.`
    });
    closeModal();
  }, [addToast, closeModal]);

  const removeBudget = useCallback((budgetId) => {
    setData((prev) => ({
      ...prev,
      budgets: prev.budgets.filter((b) => b.id !== budgetId)
    }));
    addToast({
      type: 'info',
      title: 'Budget Category Removed',
      message: 'Category envelope has been deleted.'
    });
  }, [addToast]);

  // Subscription Actions
  const addSubscription = useCallback((sub) => {
    const newSub = {
      id: `sub-${Date.now()}`,
      title: sub.title.trim(),
      category: sub.category || 'Tech',
      amount: parseFloat(sub.amount) || 0,
      dueDate: sub.dueDate || new Date().toISOString().split('T')[0],
      frequency: sub.frequency || 'Monthly',
      cardLast4: sub.cardLast4 || (data.cards[0]?.last4 || '4821'),
      status: 'active',
      logo: sub.logo || '⚡'
    };

    setData((prev) => ({
      ...prev,
      subscriptions: [newSub, ...prev.subscriptions]
    }));

    addToast({
      type: 'success',
      title: 'Subscription Added',
      message: `${newSub.title} ($${newSub.amount.toFixed(2)}/${newSub.frequency.toLowerCase()}) tracked.`
    });
    closeModal();
  }, [data.cards, addToast, closeModal]);

  const toggleSubscriptionStatus = useCallback((subId) => {
    setData((prev) => {
      const updated = prev.subscriptions.map((s) => {
        if (s.id === subId) {
          const nextStatus = s.status === 'active' ? 'paused' : 'active';
          addToast({
            type: 'info',
            title: `Subscription ${nextStatus === 'active' ? 'Resumed' : 'Paused'}`,
            message: `${s.title} is now marked as ${nextStatus}.`
          });
          return { ...s, status: nextStatus };
        }
        return s;
      });
      return { ...prev, subscriptions: updated };
    });
  }, [addToast]);

  const removeSubscription = useCallback((subId) => {
    setData((prev) => ({
      ...prev,
      subscriptions: prev.subscriptions.filter((s) => s.id !== subId)
    }));
    addToast({
      type: 'info',
      title: 'Subscription Deleted',
      message: 'Subscription has been removed from recurring billing.'
    });
  }, [addToast]);

  // Savings Goal Actions
  const addSavingsGoal = useCallback((goal) => {
    const newGoal = {
      id: `sav-${Date.now()}`,
      title: goal.title.trim(),
      targetAmount: parseFloat(goal.targetAmount) || 1000,
      currentAmount: parseFloat(goal.currentAmount) || 0,
      targetDate: goal.targetDate || '2026-12-31',
      category: goal.category || 'General',
      icon: goal.icon || '🎯',
      monthlyDeposit: parseFloat(goal.monthlyDeposit) || 100
    };

    setData((prev) => ({
      ...prev,
      savings: [...prev.savings, newGoal]
    }));

    addToast({
      type: 'success',
      title: 'Savings Goal Created',
      message: `Goal "${newGoal.title}" target of $${newGoal.targetAmount} established.`
    });
    closeModal();
  }, [addToast, closeModal]);

  const depositToSavings = useCallback((goalId, amount) => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return;

    setData((prev) => {
      const updated = prev.savings.map((g) => {
        if (g.id === goalId) {
          const nextAmount = g.currentAmount + num;
          const isCompleted = nextAmount >= g.targetAmount;
          addToast({
            type: isCompleted ? 'success' : 'info',
            title: isCompleted ? '🎉 Goal Achieved!' : 'Deposit Recorded',
            message: isCompleted
              ? `Congratulations! You reached your goal for "${g.title}"!`
              : `Added $${num.toFixed(2)} to "${g.title}". Total: $${nextAmount.toFixed(2)}`
          });
          return { ...g, currentAmount: nextAmount };
        }
        return g;
      });
      return { ...prev, savings: updated };
    });
    closeModal();
  }, [addToast, closeModal]);

  const removeSavingsGoal = useCallback((goalId) => {
    setData((prev) => ({
      ...prev,
      savings: prev.savings.filter((s) => s.id !== goalId)
    }));
    addToast({
      type: 'info',
      title: 'Savings Goal Removed',
      message: 'Goal deleted from your savings plan.'
    });
  }, [addToast]);

  // Loan & Debt Actions
  const recordLoanPayment = useCallback((loanId, paymentAmount) => {
    const num = parseFloat(paymentAmount);
    if (isNaN(num) || num <= 0) return;

    setData((prev) => {
      const updated = prev.loans.map((loan) => {
        if (loan.id === loanId) {
          const remaining = Math.max(0, loan.remainingAmount - num);
          const isPaidOff = remaining === 0;
          addToast({
            type: isPaidOff ? 'success' : 'info',
            title: isPaidOff ? '🎉 Loan Paid in Full!' : 'Payment Logged',
            message: isPaidOff
              ? `Congratulations! ${loan.name} has been completely paid off!`
              : `Paid $${num.toFixed(2)} toward ${loan.name}. Balance: $${remaining.toFixed(2)}`
          });
          return { ...loan, remainingAmount: remaining };
        }
        return loan;
      });
      return { ...prev, loans: updated };
    });
    closeModal();
  }, [addToast, closeModal]);

  // Real-time dynamic recalculations
  const calculations = useMemo(() => {
    const totalCardBalance = data.cards.reduce((sum, c) => sum + (c.balance || 0), 0);
    const totalSavings = data.savings.reduce((sum, s) => sum + (s.currentAmount || 0), 0);
    const totalDebt = data.loans.reduce((sum, l) => sum + (l.remainingAmount || 0), 0);
    const netWorth = (totalCardBalance + totalSavings) - totalDebt;

    // Monthly inflows and outflows
    let monthlyIncome = 0;
    let monthlyExpenses = 0;

    data.transactions.forEach((tx) => {
      if (tx.type === 'income') {
        monthlyIncome += tx.amount;
      } else {
        monthlyExpenses += tx.amount;
      }
    });

    const monthlyCashflow = monthlyIncome - monthlyExpenses;
    const savingsRate = monthlyIncome > 0 ? Math.max(0, Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100)) : 0;

    // Live budget spent sync per category
    const budgetAnalysis = data.budgets.map((b) => {
      const categorySpent = data.transactions
        .filter((tx) => tx.type === 'expense' && tx.category.toLowerCase() === b.category.toLowerCase())
        .reduce((acc, curr) => acc + curr.amount, 0);

      const percentage = b.limit > 0 ? Math.min(100, Math.round((categorySpent / b.limit) * 100)) : 0;
      const isOverBudget = categorySpent > b.limit;

      return {
        ...b,
        spent: categorySpent,
        percentage,
        isOverBudget,
        remaining: Math.max(0, b.limit - categorySpent)
      };
    });

    const totalBudgetLimit = data.budgets.reduce((sum, b) => sum + b.limit, 0);
    const totalBudgetSpent = budgetAnalysis.reduce((sum, b) => sum + b.spent, 0);

    const monthlySubscriptionsCost = data.subscriptions
      .filter((s) => s.status === 'active')
      .reduce((sum, s) => sum + s.amount, 0);

    return {
      totalCardBalance,
      totalSavings,
      totalDebt,
      netWorth,
      monthlyIncome,
      monthlyExpenses,
      monthlyCashflow,
      savingsRate,
      budgetAnalysis,
      totalBudgetLimit,
      totalBudgetSpent,
      monthlySubscriptionsCost
    };
  }, [data]);

  // Automated notification engine (runs whenever data changes)
  useEffect(() => {
    const alerts = [];

    // Check upcoming subscriptions due in <= 5 days
    const now = new Date();
    data.subscriptions.forEach((sub) => {
      if (sub.status === 'active' && sub.dueDate) {
        const due = new Date(sub.dueDate);
        const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays <= 5) {
          alerts.push({
            id: `alert-sub-${sub.id}`,
            title: `${sub.title} Renewal Due`,
            message: `Recurring payment of $${sub.amount.toFixed(2)} is due ${diffDays === 0 ? 'today' : `in ${diffDays} days`}.`,
            type: diffDays <= 1 ? 'urgent' : 'warning',
            category: 'Subscription',
            date: sub.dueDate
          });
        }
      }
    });

    // Check overbudget or 85%+ budget alerts
    calculations.budgetAnalysis.forEach((b) => {
      if (b.isOverBudget) {
        alerts.push({
          id: `alert-bg-over-${b.id}`,
          title: `Over Budget: ${b.category}`,
          message: `You have exceeded your $${b.limit} limit by $${(b.spent - b.limit).toFixed(2)}.`,
          type: 'danger',
          category: 'Budget',
          date: 'Immediate'
        });
      } else if (b.percentage >= 85) {
        alerts.push({
          id: `alert-bg-near-${b.id}`,
          title: `Budget Warning: ${b.category}`,
          message: `You have consumed ${b.percentage}% of your $${b.limit} monthly allowance.`,
          type: 'warning',
          category: 'Budget',
          date: 'Warning'
        });
      }
    });

    // Add financial tip alert
    alerts.push({
      id: 'alert-tip-daily',
      title: 'Smart Optimization',
      message: 'Your high-yield savings interest accrued +$62.40 this month.',
      type: 'info',
      category: 'Insights',
      date: 'Today'
    });

    setNotifications(alerts);
  }, [data.subscriptions, calculations.budgetAnalysis]);

  const value = {
    ...data,
    ...calculations,
    activeView,
    setActiveView,
    isSearchOpen,
    setIsSearchOpen,
    activeModal,
    openModal,
    closeModal,
    toasts,
    addToast,
    removeToast,
    notifications,
    updateProfile,
    addCard,
    removeCard,
    toggleFreezeCard,
    addTransaction,
    removeTransaction,
    addBudget,
    removeBudget,
    addSubscription,
    toggleSubscriptionStatus,
    removeSubscription,
    addSavingsGoal,
    depositToSavings,
    removeSavingsGoal,
    recordLoanPayment,
    resetToDefaultData
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};
