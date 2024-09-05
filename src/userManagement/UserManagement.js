import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Alert } from 'react-bootstrap';

export const UserManagement = ({ selectedUser, onUpdateUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedUser) {
      setUsername(selectedUser.username);
      setRole(selectedUser.role);
    } else {
      setUsername('');
      setRole('user');
    }
  }, [selectedUser]);

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = { ...selectedUser, username, role };
      if (password) {
        updatedUser.password = password;
      }
      await onUpdateUser(updatedUser); // Assuming this is a promise
      setUsername('');
      setPassword('');
      setRole('user');
    } catch (err) {
      setError('Failed to update user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '60%', float: 'right', padding: '10px' }}>
      <h3>User Management</h3>
      {selectedUser ? (
        <Form>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form.Group>
            <Form.Label>Password Reset</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

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
            <Form.Label>Role</Form.Label>
            <Form.Control as="select" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </Form.Control>
          </Form.Group>

          <Button
            variant="primary"
            onClick={handleUpdate}
            style={{ marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update User'}
          </Button>
        </Form>
      ) : (
        <p>Select a user to manage their details</p>
      )}
    </div>
  );
};

// Adding PropTypes for validation
UserManagement.propTypes = {
  selectedUser: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    role: PropTypes.string
  }),
  onUpdateUser: PropTypes.func.isRequired
};
