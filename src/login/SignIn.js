import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css'; // Importuj plik CSS

export const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Placeholder logic for authentication
    // Replace with actual API call when backend is ready
    if (username && password) {
      localStorage.setItem('token', 'dummy-jwt-token');
      setIsAuthenticated(true);
      navigate('/');
    } else {
      alert('Please enter username and password');
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <div className="form-footer">
        <p>Don't have an account? <a href="/register">Sign Up</a></p>
      </div>
    </div>
  );
}

