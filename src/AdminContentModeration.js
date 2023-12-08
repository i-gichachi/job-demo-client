import React, { useState, useEffect } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import './AdminContentModeration.css'

function AdminContentModeration() {
    const [postings, setPostings] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const getAuthToken = () => {
        return localStorage.getItem('token')
    };
        
    useEffect(() => {
        fetchPostings();
    }, []);

    const fetchPostings = async () => {
        try {
            const authToken = getAuthToken();
            const response = await fetch('https://test-server-6mxa.onrender.com/admin/content', {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setPostings(data.postings || []);
            } else {
                console.error('Failed to fetch postings');
            }
        } catch (error) {
            console.error('Error fetching postings:', error);
        }
    }

    const handleDeletePosting = async (postingId) => {
        try {
            const authToken = getAuthToken();
            const response = await fetch(`https://test-server-6mxa.onrender.com/admin/content/${postingId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if (response.ok) {
                setAlertMessage('Job posting deleted successfully.');
                setShowAlert(true);
                fetchPostings();
            } else {
                setAlertMessage('Failed to delete job posting. Please try again.');
                setShowAlert(true);
            }
        } catch (error) {
            console.error('Error deleting job posting:', error);
        }
    }

    return (
        <div>
            <h1>Admin Content Moderation</h1>
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
                        <th>Title</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {postings.map(posting => (
                        <tr key={posting.id}>
                            <td>{posting.id}</td>
                            <td>{posting.title}</td>
                            <td>{posting.description}</td>
                            <td>
                                <Button variant="danger" onClick={() => handleDeletePosting(posting.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            </div>
        </div>
    );
}

export default AdminContentModeration