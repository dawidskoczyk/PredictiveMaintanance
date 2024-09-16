import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './login.css'; // Importuj plik CSS


export const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setMail] = useState('');
  const navigate = useNavigate();

  const isStrongPassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password || !confirmPassword || !email) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!isStrongPassword(password)) {
      toast.error('Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
      return;
    }

    try {
      const checkResponse = await fetch('http://localhost:5001/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username })
      });
  
      const { emailExists, usernameExists } = await checkResponse.json();
      if (emailExists) {
        toast.error('E-mail already registered');
        return;
      }
      if (usernameExists) {
        toast.error('Username already taken');
        return;
      }
    } catch (err) {
      toast.error('Error checking email or username');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email })
      });
      if (response.ok) {
        toast.success('Registered successfully! You could login now');
        navigate('/login');
      } else {
        toast.error(Error.name);
      }
    } catch (err) {
      toast.error('An error occurred');
    }
  };

  return (
    <div className="signup-form">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setMail(e.target.value)}
        />
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
        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
      <div className="form-footer">
        <p>Already have an account? <a href="/login">Log In</a></p>
      </div>
    </div>
  );
};
