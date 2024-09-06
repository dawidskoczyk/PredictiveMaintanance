import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Alert } from 'react-bootstrap';
import {toast } from 'react-toastify';
import validator from 'validator'; // Import validator

export const UserManagement = ({ selectedUser, onUpdateUser, onCreateUser, isCreatingUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');  // Nowe pole dla e-maila
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedUser && !isCreatingUser) {
      setUsername(selectedUser.username);
      setRole(selectedUser.role);
      setEmail(selectedUser.email);  // Pobieranie e-maila, jeśli aktualizujemy
    } else if (isCreatingUser) {
      setUsername('');
      setPassword('');
      setEmail('');  // Resetowanie e-maila
      setRole('user');
    }
  }, [selectedUser, isCreatingUser]);

  const handleSave = async () => {
    setLoading(true);

    // Validate fields
    if (!username || !email || (isCreatingUser && !password)) {
      toast.error('Please fill in all fields.');
      setLoading(false);
      return;
    }

    if (!validator.isEmail(email)) {
      toast.error('Invalid email format.');
      setLoading(false);
      return;
    }

    const passwordValidation = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (isCreatingUser && !passwordValidation.test(password)) {
      toast.error('Password must be at least 8 characters long, and include uppercase letters, lowercase letters, numbers, and special characters.');
      setLoading(false);
      return;
    }

    try {
      if (isCreatingUser) {
        const newUser = { username, password, email, role };
        await onCreateUser(newUser);
      } else {
        const updatedUser = { ...selectedUser, username, role };
        if (password) updatedUser.password = password;
        await onUpdateUser(updatedUser);
      }
    } catch (err) {
      toast.error('Failed to save user. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ width: '60%', float: 'right', padding: '10px' }}>
      <h3>{isCreatingUser ? 'Create user' : 'Manage users!'}</h3>  {/* Dynamiczny tytuł */}

      <Form>
        <Form.Group>
          <Form.Label>Nickname</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter nickname"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Email</Form.Label>  {/* Nowe pole dla email */}
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Password {isCreatingUser && '(Required)'}</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
<Form.Group>
  <Form.Label>Role</Form.Label>
  <Form.Control as="select" value={role} onChange={(e) => setRole(e.target.value)}>
    <option value="user">User</option>
    <option value="admin">Admin</option>
  </Form.Control>
</Form.Group>

        <Button
          variant="primary"
          onClick={handleSave}
          style={{ marginTop: '10px' }}
          disabled={loading}
        >
          {loading
            ? (isCreatingUser ? 'Creating...' : 'Updating...')
            : (isCreatingUser ? 'Create account' : 'Manage user')}
        </Button>
      </Form>
    </div>
  );
};

UserManagement.propTypes = {
  selectedUser: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    role: PropTypes.string
  }),
  onUpdateUser: PropTypes.func.isRequired,
  onCreateUser: PropTypes.func.isRequired,  // Nowy prop do tworzenia użytkownika
  isCreatingUser: PropTypes.bool.isRequired  // Nowy prop określający tryb
};
