import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import AddTransactionModal from './AddTransactionModal';
import AddCardModal from './AddCardModal';
import AddBudgetModal from './AddBudgetModal';
import AddSubscriptionModal from './AddSubscriptionModal';
import AddSavingsModal from './AddSavingsModal';
import DepositModal from './DepositModal';
import PayLoanModal from './PayLoanModal';

const ModalManager = () => {
  const { activeModal, closeModal } = useFinance();

  if (!activeModal) return null;

  const { name, payload } = activeModal;

  switch (name) {
    case 'addTransaction':
      return <AddTransactionModal isOpen={true} onClose={closeModal} initialType={payload?.type || 'expense'} />;
    case 'addCard':
      return <AddCardModal isOpen={true} onClose={closeModal} />;
    case 'addBudget':
      return <AddBudgetModal isOpen={true} onClose={closeModal} />;
    case 'addSubscription':
      return <AddSubscriptionModal isOpen={true} onClose={closeModal} />;
    case 'addSavings':
      return <AddSavingsModal isOpen={true} onClose={closeModal} />;
    case 'deposit':
      return <DepositModal isOpen={true} onClose={closeModal} goal={payload?.goal} />;
    case 'payLoan':
      return <PayLoanModal isOpen={true} onClose={closeModal} loan={payload?.loan} />;
    default:
      return null;
  }
};

export default ModalManager;
