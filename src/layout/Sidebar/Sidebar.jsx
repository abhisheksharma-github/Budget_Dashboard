import React, { useContext } from 'react';
import { iconsImgs } from '../../utils/images';
import { SidebarContext } from '../../context/sidebarContext';
import { useFinance } from '../../context/FinanceContext';
import './Sidebar.css';

const navItems = [
  { id: 'overview', title: 'Dashboard', icon: iconsImgs.home, emoji: '🏠' },
  { id: 'transactions', title: 'Transactions', icon: iconsImgs.plane, emoji: '📋' },
  { id: 'budget', title: 'Budgets', icon: iconsImgs.budget, emoji: '📊' },
  { id: 'subscriptions', title: 'Subscriptions', icon: iconsImgs.wallet, emoji: '🔄' },
  { id: 'savings', title: 'Savings', icon: iconsImgs.wallet, emoji: '🎯' },
  { id: 'cards', title: 'Wallets & Cards', icon: iconsImgs.card, emoji: '💳' },
  { id: 'loans', title: 'Loans & Debt', icon: iconsImgs.bills, emoji: '📉' },
  { id: 'reports', title: 'Reports', icon: iconsImgs.report, emoji: '📈' },
  { id: 'settings', title: 'Settings', icon: iconsImgs.gears, emoji: '⚙️' }
];

const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext);
  const { activeView, setActiveView, profile, notifications, subscriptions } = useFinance();

  const handleNavClick = (viewId) => {
    setActiveView(viewId);
    if (window.innerWidth <= 768 && isSidebarOpen) {
      toggleSidebar();
    }
  };

  return (
    <aside className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-logo">
          <div className="brand-logo-mark">▲</div>
        </div>
        <div className="brand-text">
          <span className="brand-name">ApexFinance</span>
          <span className="brand-badge">PRO</span>
        </div>
      </div>

      {/* User Info Capsule */}
      <div className="sidebar-user" onClick={() => handleNavClick('settings')}>
        <div className="user-avatar img-fit-cover">
          <img src={profile.avatar} alt={profile.name} />
        </div>
        <div className="user-details">
          <div className="user-name">{profile.name}</div>
          <div className="user-title">{profile.title}</div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-navigation">
        <div className="nav-section-title">MAIN NAVIGATION</div>
        <ul className="nav-list">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            let badge = null;
            if (item.id === 'subscriptions') {
              const activeCount = subscriptions.filter((s) => s.status === 'active').length;
              if (activeCount > 0) badge = activeCount;
            } else if (item.id === 'overview' && notifications.length > 0) {
              badge = notifications.length;
            }

            return (
              <li className="nav-item" key={item.id}>
                <button
                  type="button"
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  <span className="nav-link-icon-wrap">
                    <img src={item.icon} className="nav-link-icon" alt={item.title} />
                  </span>
                  <span className="nav-link-text">{item.title}</span>
                  {badge !== null && (
                    <span className={`nav-link-badge ${item.id === 'overview' ? 'badge-notif' : ''}`}>
                      {badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Status */}
      <div className="sidebar-footer">
        <div className="sync-status">
          <span className="sync-pulse"></span>
          <span className="sync-text">Cloud Sync Live</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
