import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext.js'; // Importuj kontekst autoryzacji
import { ToastContainer, toast } from 'react-toastify';

export const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuth(); // Użyj kontekstu autoryzacji
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to access this page');
    }
  }, [isAuthenticated]);

  return isAuthenticated ? element : <Navigate to="/login" />;
};