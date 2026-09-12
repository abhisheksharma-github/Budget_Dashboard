import React from 'react';
import Sidebar from './layout/Sidebar/Sidebar';
import Content from './layout/Content/Content';
import GlobalSearchModal from './components/Search/GlobalSearchModal';
import ModalManager from './components/Modals/ModalManager';
import ToastContainer from './components/Toast/ToastContainer';
import './App.css';

function App() {
  return (
    <div className="app">
      <Sidebar />
      <Content />
      <GlobalSearchModal />
      <ModalManager />
      <ToastContainer />
    </div>
  );
}

export default App;
