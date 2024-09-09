import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserList } from './UserList';
import { UserManagement } from './UserManagement';
import {toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';  // Import Spinnera z React Bootstrap
import './UserManagementPage.css'; // Upewnij się, że ścieżka jest poprawna

export const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch users from the server when the component mounts
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
  }, []);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setIsCreatingUser(false);  // Nie tworzymy nowego użytkownika, gdy wybieramy istniejącego
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsCreatingUser(true);  // Przełącz na tryb tworzenia użytkownika
  };

  const handleCreateUser = async (newUser) => {
    setLoading(true);
    setIsCreatingUser(true);
    try {
      await axios.post('http://localhost:5001/register', newUser);
      const response = await axios.get('http://localhost:5001/api/users');
      setUsers(response.data);
      toast.success("New user has been created!");
      setIsCreatingUser(false);  // Powrót do normalnego trybu po dodaniu
    } catch (error) {
      toast.error('Error creating user');
      console.error('Error creating user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUser = async () => {
    if (selectedUser) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:5001/api/users/${selectedUser._id}`);
        // Refresh the user list
        const response = await axios.get('http://localhost:5001/api/users');
        setUsers(response.data);
        toast.success("User has been deleted!");

        setSelectedUser(null);
      } catch (error) {
        toast.error("Cannot delete user");
        console.error('Error removing user:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdateUser = async (updatedUser) => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:5001/api/users/${updatedUser._id}`, updatedUser);
      // Refresh the user list
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

  return (
    <div>
{loading && (
        <div className="d-flex justify-content-center" style={{ padding: '20px' }}>
          <Spinner animation="border" role="status"/>
        </div>
      )}      <UserList
        users={users}
        selectedUser={selectedUser}
        onSelectUser={handleSelectUser}
        onAddUser={handleAddUser}
        onRemoveUser={handleRemoveUser}
      />
      <UserManagement
        selectedUser={selectedUser}
        onUpdateUser={handleUpdateUser}
        isCreatingUser={isCreatingUser}
        onCreateUser={handleCreateUser}  // Przekazanie nowej funkcji do tworzenia użytkownika
      />
    </div>
  );
};