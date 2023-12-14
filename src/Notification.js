import React, { useState, useEffect } from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { IoIosMail } from 'react-icons/io';
import './Notification.css';

function Notifications({ onAllRead }) {
    const [notifications, setNotifications] = useState([])

    useEffect(() => {
        fetchNotifications()
        const interval = setInterval(fetchNotifications, 30000)
        return () => clearInterval(interval)
    }, [])

    const getAuthToken = () => {
        return localStorage.getItem('token')
    }

    const fetchNotifications = async () => {
        try {
            const authToken = getAuthToken();
            const response = await fetch('https://job-seeking-57c5.onrender.com/notifications', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            })
            if (response.ok) {
                const data = await response.json()
                const notificationsWithExpanded = data.map(n => ({ ...n, expanded: false }))
                setNotifications(notificationsWithExpanded)
            }
        } catch (error) {
            console.error('Error fetching notifications:', error)
        }
    }

    const markAsRead = async (notificationId) => {
        try {
            const authToken = getAuthToken()
            const response = await fetch(`https://job-seeking-57c5.onrender.com/notifications/read/${notificationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
            });
            if (response.ok) {
                fetchNotifications()
            }
        } catch (error) {
            console.error('Error marking notification as read:', error)
        }
    }

    const markAllAsRead = async () => {
        const unreadNotifications = notifications.filter(n => !n.is_read);
        for (const notification of unreadNotifications) {
            await markAsRead(notification.id)
        }
        onAllRead()
    }

    const toggleDetails = (id) => {
        setNotifications(notifications.map(notification => {
            if (notification.id === id) {
                return { ...notification, expanded: !notification.expanded };
            }
            return notification
        }))
    }

    return (
        <div className='notification'>
            <h2>Notifications</h2>
            {notifications.length === 0 && <p>No new notifications at the moment.</p>}
            <ListGroup className='notification-list'>
                {notifications.map(notification => (
                    <ListGroup.Item key={notification.id} variant={notification.is_read ? "light" : "info"}>
                        <span style={{ cursor: 'pointer' }}>
                            <IoIosMail 
                                onClick={() => toggleDetails(notification.id)}
                                style={{ marginRight: '10px' }} // Icon style
                            />
                            {notification.title || notification.type || 'Notification'} {/* Title or type shown next to icon */}
                        </span>
                        {notification.expanded && (
                            <div style={{ marginTop: '10px' }}>
                                {notification.message} {/* Full message displayed here */}
                            </div>
                        )}
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
    )
}

export default Notifications