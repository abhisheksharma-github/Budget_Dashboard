import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import './Financial.css';

const Financial = () => {
  const { financialTips } = useFinance();
  const [activeTipIdx, setActiveTipIdx] = useState(0);

  const tips = financialTips || [];
  const currentTip = tips[activeTipIdx] || tips[0];

  const handleNext = () => {
    setActiveTipIdx((prev) => (prev + 1) % tips.length);
  };

  const handlePrev = () => {
    setActiveTipIdx((prev) => (prev - 1 + tips.length) % tips.length);
  };

  if (!currentTip) return null;

  return (
    <div className="subgrid-two-item grid-common grid-c8">
      <div className="grid-c-title">
        <h3 className="grid-c-title-text">
          <span>💡</span> Smart Advisor
        </h3>
        <div className="tip-nav-buttons">
          <button className="tip-nav-btn" onClick={handlePrev} title="Previous Tip">‹</button>
          <span className="tip-counter">{activeTipIdx + 1}/{tips.length}</span>
          <button className="tip-nav-btn" onClick={handleNext} title="Next Tip">›</button>
        </div>
      </div>

      <div className="financial-tip-card">
        <div className="tip-badge-row">
          <span className="badge badge-indigo">{currentTip.tag}</span>
        </div>
        <div className="tip-title">{currentTip.title}</div>
        <p className="tip-message">{currentTip.message}</p>
      </div>
    </div>
  );
};

export default Financial;
