import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css'; // Importuj plik CSS
import { useAuth } from './AuthContext';
import { ToastContainer, toast } from 'react-toastify';


export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Używamy funkcji login z AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Please enter username and password');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (response.ok) {
        toast.success("Logged in sucesfully");
        const data = await response.json();
        login(data.token, data.username, data.role, data.email); // Zapisujemy token i nazwę użytkownika
        navigate('/home');
      } else {
        toast.error("Bad login or password");
      }
    } catch (err) {
      toast.error('Sites problems, try again later');
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

    </div>
  );
}

