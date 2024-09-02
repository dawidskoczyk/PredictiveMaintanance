import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext.js'; // Importuj kontekst autoryzacji

export const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuth(); // Użyj kontekstu autoryzacji
  return isAuthenticated ? element : <Navigate to="/login" />;
};