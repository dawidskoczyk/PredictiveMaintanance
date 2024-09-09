import React from 'react';
import PropTypes from 'prop-types';
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import { FaPlus, FaMinus } from 'react-icons/fa';
import './UserList.css'; // Upewnij się, że ścieżka jest poprawna

export const UserList = ({ users, selectedUser, onSelectUser, onAddUser, onRemoveUser }) => {

  const handleSelectUser = (user) => {
    onSelectUser(user);
  };

  return (
    <div style={{ width: '30%', float: 'left', padding: '10px' }}>
      <h3>Users</h3>
      <Button onClick={onAddUser} variant="success" style={{ marginRight: '5px' }}>
        <FaPlus /> Add User
      </Button>
      <Button onClick={onRemoveUser} variant="danger" disabled={!selectedUser}>
        <FaMinus /> Remove User
      </Button>
      <ListGroup style={{ marginTop: '10px' }}>
        {users.map((user) => (
          <ListGroupItem
            key={user._id}
            onClick={() => handleSelectUser(user)}
            style={{
              cursor: 'pointer',
              backgroundColor: selectedUser?._id === user._id ? '#d3d3d3' : 'transparent'
            }}
          >
            {user.username}
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
};

// Adding PropTypes for validation
UserList.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired
    })
  ).isRequired,
  selectedUser: PropTypes.object,
  onSelectUser: PropTypes.func.isRequired,
  onAddUser: PropTypes.func.isRequired,
  onRemoveUser: PropTypes.func.isRequired
};
