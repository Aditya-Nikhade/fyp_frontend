import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for saved token and user data on component mount
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    setIsAuthenticated(true);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Enhanced bypass auth function that always works
  const bypassAuth = () => {
    // Create dummy user data
    const demoUser = { 
      userId: 'demo_user_' + Math.floor(Math.random() * 1000),
      email: 'demo@example.com',
      role: 'admin',
      name: 'Demo User'
    };
    
    // Create dummy token
    const demoToken = 'demo-token-' + Date.now();
    
    // Use the login function to set everything up
    login(demoUser, demoToken);
    
    console.log('Authentication bypassed successfully!');
    return true;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isAuthenticated, 
      login, 
      logout, 
      bypassAuth 
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 