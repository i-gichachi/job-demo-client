import React, { useState, useEffect } from 'react';
import { FaUserTie, FaBell, FaCheckCircle } from 'react-icons/fa';
import EmployerJobseekerView from './EmployerJobseekerProfile';
import EmployerProfile from './EmployerProfile';
import EmployerProfileManagement from './EmployerProfileManagement';
import JobPosting from './Jobposting';
import JobPostingManagement from './JobpostingManagement';
import AccountSettings from './AccountSetting';
import Notifications from './Notification';
import Logout from './Logout';
import EmployerSearch from './EmployerSearch'; 
import PaymentVerification from './PaymentVerification';
import { useUserContext } from './UserContext';
import './EmployerDashboard.css'

function EmployerDashboard() {
    const [hasProfile, setHasProfile] = useState(false);
    const [activeComponent, setActiveComponent] = useState('jobseekerView');
    const [selectedJobseekerId, setSelectedJobseekerId] = useState(null);
    const { user } = useUserContext();
    const [isVerified, setIsVerified] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (user && user.userId) {
            checkEmployerProfile();
            fetchNotifications();
        }
    }, [user]);

    const getAuthToken = () => {
        return localStorage.getItem('token'); // Replace 'authToken' with your actual token key
    };

    const checkEmployerProfile = async () => {
        const authToken = getAuthToken();
        try {
            const response = await fetch(`https://test-server-6mxa.onrender.com/employer/profile/${user.userId}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            const profileData = await response.json();
            if (response.ok) {
                setHasProfile(true);
                setIsVerified(profileData.verified);
            } else {
                setHasProfile(false);
            }
        } catch (error) {
            console.error('Error checking employer profile:', error);
        }
    };

    const fetchNotifications = async () => {
        const authToken = getAuthToken();
        try {
            const response = await fetch('https://test-server-6mxa.onrender.com/notifications', {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleAllNotificationsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    };

    const unreadNotificationsCount = notifications.filter(n => !n.is_read).length;

    const handleViewProfile = (jobseekerId) => {
        setSelectedJobseekerId(jobseekerId);
        setActiveComponent('jobseekerProfile');
    };

    const onProfileCreated = () => {
        setHasProfile(true);
        setActiveComponent('paymentVerification');
    };

    const onPaymentSuccess = () => {
        setIsVerified(true);
        window.location.reload(); // Reload the page to update the state and UI
    };

    const handleNavClick = (component) => {
        if (!isVerified && component !== 'employerProfile' && component !== 'paymentVerification') {
            alert('You need to pay the verification fee to access this section.');
        } else {
            setActiveComponent(component);
        }
    };

    const renderComponent = () => {
        switch (activeComponent) {
            case 'employerProfile':
                return <EmployerProfile onProfileCreated={() => setHasProfile(true)} />;
            case 'employerProfileManagement':
                return <EmployerProfileManagement />;
            case 'jobPosting':
                return <JobPosting />;
            case 'jobPostingManagement':
                return <JobPostingManagement />;
            case 'accountSettings':
                return <AccountSettings />;
            case 'paymentVerification':
                return <PaymentVerification onPaymentSuccess={onPaymentSuccess} />;
            case 'notifications':
                return <Notifications />;
            case 'employerSearch':
                return <EmployerSearch />;
            case 'jobseekerView':
            default:
                return <EmployerJobseekerView />;
        }
    };

    return (
        <div className="employer-dashboard">
            <header className="employer-navbar">
                <div className="brand-container">
                    {user && user.userType === 'employer' && <FaUserTie className="brand-icon"/>}
                    <span className="brand-name">{user ? `${user.username} ${isVerified ? <FaCheckCircle className="verified-icon"/> : ''}` : 'Loading...'}</span>
                </div>
                <nav className="employer-nav">
                    <ul>
                        <li onClick={() => handleNavClick('jobseekerView')}>Jobseeker Profiles</li>
                        {!hasProfile ? (
                            <li onClick={() => handleNavClick('employerProfile')}>Create Profile</li>
                        ) : (
                            <>
                                <li onClick={() => handleNavClick('employerProfileManagement')}>Manage Profile</li>
                                <li onClick={() => handleNavClick('jobPosting')}>Create Job Posting</li>
                                <li onClick={() => handleNavClick('jobPostingManagement')}>Manage Job Postings</li>
                            </>
                        )}
                        <li onClick={() => handleNavClick('accountSettings')}>Account Settings</li>
                        <li onClick={() => handleNavClick('paymentVerification')}>Payment Verification</li>
                        <li onClick={() => handleNavClick('employerSearch')}>Search Jobseekers</li>
                    </ul>
                </nav>
                <div className="nav-right">
                    <Logout />
                </div>
            </header>
            <main>
                {renderComponent()}
            </main>
        </div>
    );
}

export default EmployerDashboard;