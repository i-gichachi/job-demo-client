import React, { useState, useEffect } from 'react';
import { FaUserShield, FaBell } from 'react-icons/fa';
import AccountSettings from './AccountSetting';
import AdminContentModeration from './AdminContentModeration';
import AdminFileApproval from './AdminFileApproval';
import AdminUserManagement from './AdminUserManagement';
import Notifications from './Notification';
import Logout from './Logout';
import { useUserContext } from './UserContext';
import './AdminDashboard.css'

function AdminDashboard() {
    const [activeComponent, setActiveComponent] = useState('userManagement');
    const [showNotifications, setShowNotifications] = useState(false);
    const { user } = useUserContext();
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Assuming 'user' is not null or undefined.
        console.log("User Data: ", user);
        fetchNotifications();
    }, [user]); // Correctly passing 'user' as a dependency.

    const fetchNotifications = async () => {
        try {
            const response = await fetch('https://test-server-6mxa.onrender.com/notifications', { method: 'GET' });
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markNotificationAsRead = (notificationId) => {
        setNotifications(notifications.map(n => n.id === notificationId ? { ...n, is_read: true } : n));
    };

    const handleAllRead = () => {
        setNotifications(notifications.map(notification => ({
            ...notification,
            is_read: true
        })));
        setShowNotifications(false); // Hide notifications dropdown
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    const renderComponent = () => {
        switch (activeComponent) {
            case 'accountSettings':
                return <AccountSettings />;
            case 'contentModeration':
                return <AdminContentModeration />;
            case 'fileApproval':
                return <AdminFileApproval />;
            case 'userManagement':
                return <AdminUserManagement />;
            case 'notifications':
                return <Notifications onAllRead={handleAllRead} />;
            default:
                return <div>Select a component</div>;
        }
    };

    const unreadNotificationsCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="admin-dashboard">
            <header className="admin-navbar">
                <div className="admin-brand">
                    {user && user.userType === 'admin' && <FaUserShield />}
                    {user ? user.username : 'Loading...'}
                </div>
                <nav className="admin-nav">
                    <button onClick={() => setActiveComponent('accountSettings')}>Account Settings</button>
                    <button onClick={() => setActiveComponent('contentModeration')}>Content Moderation</button>
                    <button onClick={() => setActiveComponent('fileApproval')}>File Approval</button>
                    <button onClick={() => setActiveComponent('userManagement')}>User Management</button>
                </nav>
                <div className="admin-right">
                    <span className="notification-bell" onClick={toggleNotifications}>
                        <FaBell />
                        {unreadNotificationsCount > 0 &&
                            <sup className="notification-count">{unreadNotificationsCount}</sup>
                        }
                    </span>
                    <Logout />
                </div>
            </header>
            <main>
                {showNotifications && <Notifications notifications={notifications} onAllRead={handleAllRead} />}
                {renderComponent()}
            </main>
        </div>
    );
}

export default AdminDashboard