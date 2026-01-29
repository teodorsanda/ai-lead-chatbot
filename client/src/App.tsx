import React, { useState } from 'react';
import { ChatPage } from './pages/ChatPage';
import { Dashboard } from './pages/Dashboard';
import { FineTuningPage } from './pages/FineTuning';
import { MessageSquare, BarChart3, Zap } from 'lucide-react';
import './styles/App.css';

type Page = 'chat' | 'dashboard' | 'fine-tuning';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('chat');

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>⛵ Pikasea</h1>
        </div>
        <div className="navbar-menu">
          <button
            className={currentPage === 'chat' ? 'active' : ''}
            onClick={() => setCurrentPage('chat')}
          >
            <MessageSquare size={20} />
            Chat
          </button>
          <button
            className={currentPage === 'dashboard' ? 'active' : ''}
            onClick={() => setCurrentPage('dashboard')}
          >
            <BarChart3 size={20} />
            Dashboard
          </button>
          <button
            className={currentPage === 'fine-tuning' ? 'active' : ''}
            onClick={() => setCurrentPage('fine-tuning')}
          >
            <Zap size={20} />
            Fine-Tuning
          </button>
        </div>
      </nav>

      <main className="main-content">
        {currentPage === 'chat' && <ChatPage />}
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'fine-tuning' && <FineTuningPage />}
      </main>
    </div>
  );
}

export default App;
