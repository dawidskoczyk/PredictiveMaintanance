import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import validator from 'validator'; // Import validator
import { useAuth } from '../login/AuthContext'; // Import AuthProvider for current user
import './UserManagement.css'; // Ensure this path is correct
import { useNavigate, useLocation } from 'react-router-dom';

export const UserManagement = ({ selectedUser, onUpdateUser, onCreateUser, isCreatingUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false); // Track if form is dirty
  const [showExitModal, setShowExitModal] = useState(false); // Show exit confirmation modal
  const navigate = useNavigate();
  const location = useLocation(); // Track location changes

  useEffect(() => {
    if (selectedUser && !isCreatingUser) {
      setUsername(selectedUser.username);
      setRole(selectedUser.role); // Check if role is coming through correctly
      setEmail(selectedUser.email);
    } else if (isCreatingUser) {
      setUsername('');
      setPassword('');
      setEmail('');
      setRole(''); // Reset role when creating a new user
    }
  }, [selectedUser, isCreatingUser]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = ''; // Chrome requires returnValue to be set
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setIsDirty(true); // Mark the form as dirty when any input changes
  };

  const handleSave = async () => {
    setLoading(true);
    setIsDirty(false); // Reset dirty flag on save
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
        const newUser = { username, password, email, role }; // Default role for new users
        await onCreateUser(newUser);
      } else {
        const updatedUser = { ...selectedUser, username, email };
        if (password) updatedUser.password = password;
        updatedUser.role = role;
        await onUpdateUser(updatedUser);
      }
    } catch (err) {
      toast.error('Failed to save user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (path) => {
    if (isDirty) {
      setShowExitModal(true);
    } else {
      navigate(path);
    }
  };

  const handleConfirmExit = () => {
    setShowExitModal(false);
    navigate(location.pathname); // Replace with desired navigation path if needed
  };

  const handleCloseExitModal = () => {
    setShowExitModal(false);
  };

  return (
    <div style={{ width: '60%', float: 'right', padding: '10px' }}>
      <h3>{isCreatingUser ? 'Create user' : 'Manage users!'}</h3>  {/* Dynamic title */}

      <Form>
        <Form.Group>
          <Form.Label>Nickname</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter nickname"
            value={username}
            onChange={handleInputChange(setUsername)}
            disabled={!isCreatingUser && !selectedUser}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={handleInputChange(setEmail)}
            disabled={!isCreatingUser && !selectedUser}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Password {isCreatingUser && '(Required)'}</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={handleInputChange(setPassword)}
            disabled={!isCreatingUser}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Role</Form.Label>
          <Form.Control as="select" value={role} onChange={handleInputChange(setRole)} disabled={!isCreatingUser && !selectedUser}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </Form.Control>
        </Form.Group>

        <Button
          variant="primary"
          onClick={handleSave}
          style={{ marginTop: '10px' }}
          disabled={loading || (!isCreatingUser && !selectedUser)}
        >
          {loading
            ? (isCreatingUser ? 'Creating...' : 'Updating...')
            : (isCreatingUser ? 'Create account' : 'Manage user')}
        </Button>
      </Form>

      {/* Exit Confirmation Modal */}
      <Modal show={showExitModal} onHide={handleCloseExitModal}>
        <Modal.Header closeButton>
          <Modal.Title>Unsaved Changes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You have unsaved changes. Are you sure you want to leave without saving?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseExitModal}>
            Stay
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirmExit}
          >
            Leave
          </Button>
        </Modal.Footer>
      </Modal>
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
  onCreateUser: PropTypes.func.isRequired,
  isCreatingUser: PropTypes.bool.isRequired  // Flag to indicate if creating user
};
