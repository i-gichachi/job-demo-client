import React, { useState, useEffect } from 'react';
import { Button, Table, Alert } from 'react-bootstrap';
import './AdminFileApproval.css'

function AdminFileApproval() {
    const [jobseekers, setJobseekers] = useState([])
    const [showAlert, setShowAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')

    const getAuthToken = () => {
        return localStorage.getItem('token')
    }

    useEffect(() => {
        fetchPendingJobseekers();
    }, [])

    const fetchPendingJobseekers = async () => {
        try {
            const authToken = getAuthToken();
            const response = await fetch('https://job-seeking-57c5.onrender.com/admin/jobseekers', {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setJobseekers(data.jobseekers.filter(j => j.file_approval_status === 'pending' || j.file_approval_status === 'rejected'));
            } else {
                console.error('Failed to fetch jobseekers')
            }
        } catch (error) {
            console.error('Error fetching jobseekers:', error)
        }
    }

    const handleApproval = async (jobseekerId, status) => {
        try {
            const authToken = getAuthToken();
            const response = await fetch(`https://job-seeking-57c5.onrender.com/jobseeker/file-approval/${jobseekerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ approval_status: status })
            });
            if (response.ok) {
                setAlertMessage(`Jobseeker's file has been ${status}.`)
                setShowAlert(true);
                fetchPendingJobseekers()
            } else {
                setAlertMessage('Failed to update status. Please try again.')
                setShowAlert(true)
            }
        } catch (error) {
            console.error('Error updating file approval status:', error)
        }
    }

    return (
        <div className='admin-file-container'>
            <h1>Admin File Approval</h1>
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
                            <th>Username</th>
                            <th>Resume</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobseekers.map(jobseeker => (
                            <tr key={jobseeker.id}>
                                <td>{jobseeker.username}</td>
                                <td>
                                    <a href={jobseeker.resume} target="_blank" rel="noopener noreferrer">View Resume</a>
                                </td>
                                <td>{jobseeker.file_approval_status}</td>
                                <td>
                                    <Button variant="success" onClick={() => handleApproval(jobseeker.id, 'approved')}>Approve</Button>
                                    {' '}
                                    <Button variant="danger" onClick={() => handleApproval(jobseeker.id, 'rejected')}>Reject</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    )
}

export default AdminFileApproval
