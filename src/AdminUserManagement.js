import React, { useState, useEffect } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import { useUserContext } from './UserContext';
import './AdminUserManagement.css'

function AdminUserManagement() {
    const [users, setUsers] = useState([])
    const [showAlert, setShowAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const { user } = useUserContext()

    const getAuthToken = () => {
        return localStorage.getItem('token')
    };
    
    useEffect(() => {
        if (user && user.userType === 'admin') {
            fetchUsers()
        }
    }, [user])

    const fetchUsers = async () => {
        try {
            const authToken = getAuthToken();
            const response = await fetch('https://test-server-6mxa.onrender.com/admin/users', {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            if (response.ok) {
                const data = await response.json()
                setUsers(data.users || [])
            } else {
                console.error('Failed to fetch users')
            }
        } catch (error) {
            console.error('Error fetching users:', error)
        }
    }

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const authToken = getAuthToken()
                const response = await fetch(`https://test-server-6mxa.onrender.com/admin/users/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                if (response.ok) {
                    setAlertMessage('User deleted successfully.');
                    setShowAlert(true);
                    fetchUsers();
                } else {
                    setAlertMessage('Failed to delete user. Please try again.')
                    setShowAlert(true)
                }
            } catch (error) {
                console.error('Error deleting user:', error)
            }
        }
    };

    return (
        <div className='admin-user-container'> 
            <h1>Admin User Management</h1>
            {showAlert && (
                <div className="custom-alert">
                    <div className="alert-content">{alertMessage}</div>
                    <button type="button" className="close-alert" onClick={() => setShowAlert(false)} aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )}
            <div className="table-container">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.type}</td>
                                <td>
                                    <Button variant="danger" onClick={() => handleDeleteUser(user.id)}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}

export default AdminUserManagement;
