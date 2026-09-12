import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { SidebarProvider } from './context/sidebarContext.jsx';
import { FinanceProvider } from './context/FinanceContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SidebarProvider>
      <FinanceProvider>
        <App />
      </FinanceProvider>
    </SidebarProvider>
  </React.StrictMode>
);
