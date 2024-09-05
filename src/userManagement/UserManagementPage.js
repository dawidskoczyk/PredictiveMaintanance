import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserList } from './UserList';
import { UserManagement } from './UserManagement';

export const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch users from the server when the component mounts
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5001/api/users');
        setUsers(response.data);
      } catch (error) {
        setError('Error fetching users');
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  const handleAddUser = async () => {
    const newUser = { username: 'NewUser', password: 'password', email: 'newuser@example.com', role: 'user' };
    setLoading(true);
    setError(null);
    try {
      await axios.post('http://localhost:5001/api/register', newUser);
      // Refresh the user list
      const response = await axios.get('http://localhost:5001/api/users');
      setUsers(response.data);
    } catch (error) {
      setError('Error adding user');
      console.error('Error adding user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUser = async () => {
    if (selectedUser) {
      setLoading(true);
      setError(null);
      try {
        await axios.delete(`http://localhost:5001/api/users/${selectedUser._id}`);
        // Refresh the user list
        const response = await axios.get('http://localhost:5001/api/users');
        setUsers(response.data);
        setSelectedUser(null);
      } catch (error) {
        setError('Error removing user');
        console.error('Error removing user:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdateUser = async (updatedUser) => {
    setLoading(true);
    setError(null);
    try {
      await axios.put(`http://localhost:5001/api/users/${updatedUser._id}`, updatedUser);
      // Refresh the user list
      const response = await axios.get('http://localhost:5001/api/users');
      setUsers(response.data);
      setSelectedUser(updatedUser);
    } catch (error) {
      setError('Error updating user');
      console.error('Error updating user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div>Loading...</div>}
      <UserList
        users={users}
        onSelectUser={handleSelectUser}
        onAddUser={handleAddUser}
        onRemoveUser={handleRemoveUser}
      />
      <UserManagement selectedUser={selectedUser} onUpdateUser={handleUpdateUser} />
    </div>
  );
};
