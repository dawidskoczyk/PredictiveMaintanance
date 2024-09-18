import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(''); // Dodaj stan na imię użytkownika
  const [role, setRole] = useState(''); // Dodaj stan na rolę użytkownika
  const [email, setEmail] = useState('');

  // Funkcja logowania, zapisuje token i nazwę użytkownika w localStorage

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    const roled = localStorage.getItem('role');
    const storedEmail = localStorage.getItem('email');

    // console.log('SR:', role, 'UR: ', username);
    if (token && storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
      setRole(roled);
      setEmail(storedEmail);
    }
  }, []);
  
  const login = (token, username, role, userEmail) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('role', role);
    localStorage.setItem('email', userEmail);

    setIsAuthenticated(true);
    setUsername(username);
    setRole(role);
    setEmail(userEmail);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role'); // Usuń rolę z localStorage
    localStorage.removeItem('email'); // Usuń rolę z localStorage

    setIsAuthenticated(false);
    setUsername('');
    setRole(''); // Zresetuj stan roli
    setEmail('');

  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, username, setUsername, email, setEmail, role, setRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

