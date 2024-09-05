import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext.js'; 
import { toast } from 'react-toastify';

export const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [checkingAuth, setCheckingAuth] = useState(true); // Stan, aby śledzić, czy trwa sprawdzanie autoryzacji

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else if (!isAuthenticated) {
      toast.error('You must be logged in to access this page');
    }
    setCheckingAuth(false); // Ustawia flagę, że sprawdzanie się zakończyło
  }, [isAuthenticated, setIsAuthenticated]);

  // Gdy trwa sprawdzanie autoryzacji, nie renderuj niczego
  if (checkingAuth) {
    return null; // Możesz zwrócić np. spinner ładowania
  }

  return isAuthenticated ? element : <Navigate to="/login" />;
};
