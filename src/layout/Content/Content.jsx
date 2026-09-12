import React from 'react';
import ContentTop from '../../components/ContentTop/ContentTop';
import OverviewView from '../../components/Views/OverviewView';
import TransactionsView from '../../components/Views/TransactionsView';
import BudgetsView from '../../components/Views/BudgetsView';
import SubscriptionsView from '../../components/Views/SubscriptionsView';
import SavingsView from '../../components/Views/SavingsView';
import CardsView from '../../components/Views/CardsView';
import LoansView from '../../components/Views/LoansView';
import ReportsView from '../../components/Views/ReportsView';
import SettingsView from '../../components/Views/SettingsView';
import { useFinance } from '../../context/FinanceContext';
import './Content.css';

const Content = () => {
  const { activeView } = useFinance();

  const renderActiveView = () => {
    switch (activeView) {
      case 'transactions':
        return <TransactionsView />;
      case 'budget':
        return <BudgetsView />;
      case 'subscriptions':
        return <SubscriptionsView />;
      case 'savings':
        return <SavingsView />;
      case 'cards':
        return <CardsView />;
      case 'loans':
        return <LoansView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      case 'overview':
      default:
        return <OverviewView />;
    }
  };

  return (
    <main className="main-content">
      <ContentTop />
      <div className="view-wrapper">
        {renderActiveView()}
      </div>
    </main>
  );
};

export default Content;
