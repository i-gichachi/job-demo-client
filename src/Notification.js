import React, { useState, useEffect } from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import './Notification.css'

function Notifications({ onAllRead }) {
    const [notifications, setNotifications] = useState([])

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
        return () => clearInterval(interval);
    }, [])

    const getAuthToken = () => {
        return localStorage.getItem('token'); // Fetch the token from local storage
    };

    const fetchNotifications = async () => {
        try {
            const authToken = getAuthToken();
            const response = await fetch('https://test-server-6mxa.onrender.com/notifications', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const authToken = getAuthToken();
            const response = await fetch(`https://test-server-6mxa.onrender.com/notifications/read/${notificationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
            });
            if (response.ok) {
                fetchNotifications();
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        const unreadNotifications = notifications.filter(n => !n.is_read);
        for (const notification of unreadNotifications) {
            await markAsRead(notification.id);
        }
        onAllRead(); // This will update the state in the parent component
    };

    return (
        <div>
            <h2>Notifications</h2>
            {notifications.length === 0 && <p>No new notifications at the moment.</p>}
            <ListGroup>
                {notifications.map(notification => (
                    <ListGroup.Item key={notification.id} variant={notification.is_read ? "light" : "info"}>
                        {notification.message}
                        {!notification.is_read && (
                            <Button variant="primary" size="sm" onClick={() => markAsRead(notification.id)} style={{ float: 'right' }}>
                                Mark as Read
                            </Button>
                        )}
                    </ListGroup.Item>
                ))}
            </ListGroup>
            {notifications.some(n => !n.is_read) && (
                <Button variant="secondary" onClick={markAllAsRead} style={{ marginTop: '10px' }}>
                    Mark All as Read
                </Button>
            )}
        </div>
    );
}

export default Notifications;