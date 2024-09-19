import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserList } from './UserList';
import { UserManagement } from './UserManagement';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button, Spinner } from 'react-bootstrap';
import './UserManagementPage.css'; // Ensure this path is correct
import { useAuth } from '../login/AuthContext'; // Import your useAuth hook

export const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Declare state for the modal
  const { isAuthenticated, role, email, username } = useAuth(); // Access role and email directly from context
  const [isFormDirty, setIsFormDirty] = useState(false); // To track unsaved changes
  const navigate = useNavigate(); // To handle navigation

  // Function to handle browser refresh or tab close
  function handleBeforeUnload(event) {
    event.preventDefault();
    event.returnValue = ''; // Required for showing the confirmation dialog in some browsers
  }

  // Add event listener for beforeunload and fetch users
  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload, { capture: true });

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5001/api/users');
        setUsers(response.data);
      } catch (error) {
        toast.error('Error fetching users');
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setIsCreatingUser(false);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsCreatingUser(true);
  };

  const handleCreateUser = async (newUser) => {
    setLoading(true);
    try {
      const checkResponse = await fetch('http://localhost:5001/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newUser.email, username: newUser.username })
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
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        toast.success('Registered successfully!');
        setIsCreatingUser(false); // Exit creation mode on success
        const updatedUsers = await axios.get('http://localhost:5001/api/users');
        setUsers(updatedUsers.data);
      } else {
        toast.error('Error registering user');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleShowDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true); // Correctly set modal visibility
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false); // Correctly set modal visibility
    setSelectedUser(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedUser.username === username) {
      toast.error("You can't delete yourself Admin!");
      handleCloseDeleteModal();
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`http://localhost:5001/api/users/${selectedUser._id}`);
      const response = await axios.get('http://localhost:5001/api/users');
      setUsers(response.data);
      toast.success("User has been deleted!");
    } catch (error) {
      toast.error("Cannot delete user");
      console.error('Error removing user:', error);
    } finally {
      setLoading(false);
      handleCloseDeleteModal();
    }
  };

  const handleUpdateUser = async (updatedUser) => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:5001/api/users/${updatedUser._id}`, updatedUser);
      const response = await axios.get('http://localhost:5001/api/users');
      setUsers(response.data);
      toast.success("User has been updated!");
      setSelectedUser(updatedUser);
    } catch (error) {
      toast.error("Cannot edit user");
      console.error('Error updating user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!email) {
      toast.error('No user email available');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: selectedUser.email, // Ensure this matches the backend expected field
          subject: 'Notification',
          text: 'This is a test email from your React app!'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      toast.success("Testing mail has been sent to " + selectedUser.email);
    } catch (error) {
      toast.error("Choose user to send email!");
      console.error('Error sending email:', error);
    }
  };

  return (
    <div>
      {loading && (
        <div className="d-flex justify-content-center" style={{ padding: '20px' }}>
          <Spinner animation="border" role="status" />
        </div>
      )}
      <UserList
        users={users}
        selectedUser={selectedUser}
        onSelectUser={handleSelectUser}
        onAddUser={handleAddUser}
        onRemoveUser={handleShowDeleteModal} // Use modal for delete confirmation
      />
      <UserManagement
        selectedUser={selectedUser}
        onUpdateUser={handleUpdateUser}
        onCreateUser={handleCreateUser}
        isCreatingUser={isCreatingUser}
      />
      <button
        style={{ marginTop: '20px', backgroundColor: 'yellowgreen', color: 'white' }}
        onClick={handleSendEmail}
      >
        Send Test Email
      </button>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this user?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
