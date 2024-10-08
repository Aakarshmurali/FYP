import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import AuthPage from './components/AuthPage';
import PortfolioDetail from './components/PortfolioDetail';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './hooks/useAuth';
import PortfolioHub from './components/PortfolioHub';
import PortfolioOptimization from './components/PortfolioOptimization';
import Navbar from './components/Navbar';

const AppContent = () => {
  const location = useLocation();
  const isPublicPage = location.pathname === '/' || location.pathname === '/auth';

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {!isPublicPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/portfolio-hub"
          element={
            <PrivateRoute>
              <PortfolioHub />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/portfolio/:id"
          element={
            <PrivateRoute>
              <PortfolioDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/optimize"
          element={
            <PrivateRoute>
              <PortfolioOptimization />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;