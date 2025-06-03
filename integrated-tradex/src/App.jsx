import { useContext, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import './App.css';

// Page imports
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import GraphsPage from './pages/GraphsPage';

// Modified protected route component that always allows access
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, bypassAuth } = useContext(AuthContext);
  
  // If not authenticated, automatically bypass auth instead of redirecting
  if (!isAuthenticated) {
    // Auto-bypass for demo purposes
    bypassAuth();
  }
  
  // Always render the children
  return children;
};

function App() {
  return (
    <div className="app-wrapper">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/graphs" element={
          <ProtectedRoute>
            <GraphsPage />
          </ProtectedRoute>
        } />
        {/* Catch-all route redirects to landing page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App; 