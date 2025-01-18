import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FriendsPage from './pages/FriendsPage';
import TasksPage from './pages/TasksPage';
import WalletPage from './pages/WalletPage';
import ProfilePage from './pages/ProfilePage';
import { initTelegramWebApp } from './lib/telegram';
import { BalanceProvider } from './lib/BalanceContext';

function App() {
  useEffect(() => {
    const { userId, username } = initTelegramWebApp();
    console.log('Telegram Web App initialized for user:', { userId, username });
  }, []);

  return (
    <BalanceProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </BalanceProvider>
  );
}

export default App;