import React, { useContext, useState } from 'react';
import { iconsImgs } from '../../utils/images';
import { SidebarContext } from '../../context/sidebarContext';
import { useFinance } from '../../context/FinanceContext';
import NotificationDrawer from '../Notifications/NotificationDrawer';
import './ContentTop.css';

const viewTitles = {
  overview: 'Dashboard Overview',
  transactions: 'Transactions Ledger',
  budget: 'Budget Envelopes',
  subscriptions: 'Recurring Subscriptions',
  savings: 'Savings Goals',
  cards: 'Wallets & Cards',
  loans: 'Debt & Liabilities',
  reports: 'Analytics & Reports',
  settings: 'Account Settings'
};

const ContentTop = () => {
  const { toggleSidebar } = useContext(SidebarContext);
  const { activeView, setActiveView, notifications, setIsSearchOpen, openModal, profile } = useFinance();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <>
      <header className="main-content-top">
        {/* Left Side: Mobile Menu Toggler & Breadcrumbs */}
        <div className="content-top-left">
          <button
            type="button"
            className="sidebar-toggler"
            onClick={toggleSidebar}
            aria-label="Toggle navigation drawer"
          >
            <img src={iconsImgs.menu} alt="Menu" />
          </button>
          <div>
            <div className="content-top-date">{today}</div>
            <h2 className="content-top-title">
              {viewTitles[activeView] || 'Dashboard'}
            </h2>
          </div>
        </div>

        {/* Right Side: Search, Quick Add, Notifications, Profile */}
        <div className="content-top-right">
          {/* Quick Search Bar Trigger */}
          <button
            type="button"
            className="top-search-trigger"
            onClick={() => setIsSearchOpen(true)}
            title="Search (Cmd+K)"
          >
            <span>🔍</span>
            <span className="search-placeholder-text">Search records...</span>
            <kbd className="search-kbd">⌘K</kbd>
          </button>

          {/* Quick Action Button */}
          <button
            type="button"
            className="btn-primary top-add-btn"
            onClick={() => openModal('addTransaction')}
          >
            <span>+</span>
            <span className="add-btn-text">Transaction</span>
          </button>

          {/* Notifications Button */}
          <button
            type="button"
            className={`top-icon-btn ${isNotifOpen ? 'active' : ''}`}
            onClick={() => setIsNotifOpen((prev) => !prev)}
            title="Activity & Notifications"
            aria-label="Activity & Notifications"
          >
            <img src={iconsImgs.bell} alt="Notifications" />
            {notifications.length > 0 && (
              <span className="notif-dot-pulse">{notifications.length}</span>
            )}
          </button>

          {/* User Mini Avatar */}
          <div
            className="top-user-avatar img-fit-cover"
            onClick={() => setActiveView('settings')}
            title="Account Settings"
          >
            <img src={profile.avatar} alt={profile.name} />
          </div>
        </div>
      </header>

      {/* Notification Drawer Modal */}
      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
};

export default ContentTop;
