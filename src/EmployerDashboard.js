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
    const [hasProfile, setHasProfile] = useState(false)
    const [activeComponent, setActiveComponent] = useState('jobseekerView')
    const [selectedJobseekerId, setSelectedJobseekerId] = useState(null)
    const { user } = useUserContext()
    const [isVerified, setIsVerified] = useState(false)
    const [notifications, setNotifications] = useState([])
    const [lastPaymentDate, setLastPaymentDate] = useState(null)
    const [nextVerificationDate, setNextVerificationDate] = useState(new Date())

    useEffect(() => {
        let nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + 30)
        setNextVerificationDate(nextDate)

        if (user && user.userId) {
            checkEmployerProfile().then(() => {
                if (!hasProfile) {
                    setActiveComponent('employerProfile')
                } else if (hasProfile && !isVerified) {
                    setActiveComponent('employerProfileManagement')
                } else if (hasProfile && isVerified) {
                    setActiveComponent('jobseekerView')
                }
            })
        }
    }, [user])


    const getAuthToken = () => {
        return localStorage.getItem('token')
    }

    const checkEmployerProfile = async () => {
        const authToken = getAuthToken()
        try {
            const response = await fetch(`https://test-server-6mxa.onrender.com/employer/profile/${user.userId}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            })
            const profileData = await response.json()
            if (response.ok) {
                setHasProfile(true)
                setIsVerified(profileData.verified)
                setActiveComponent(profileData.verified ? 'jobseekerView' : 'employerProfileManagement')
            } else {
                setHasProfile(false)
                setActiveComponent('employerProfile')
            }
        } catch (error) {
            console.error('Error checking employer profile:', error)
        }
    }
    
    const fetchNotifications = async () => {
        const authToken = getAuthToken()
        try {
            const response = await fetch('https://test-server-6mxa.onrender.com/notifications', {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            if (response.ok) {
                const data = await response.json()
                setNotifications(data)
            }
        } catch (error) {
            console.error('Error fetching notifications:', error)
        }
    }

    const handleAllNotificationsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, is_read: true })))
    }

    const unreadNotificationsCount = notifications.filter(n => !n.is_read).length

    const handleViewProfile = (jobseekerId) => {
        setSelectedJobseekerId(jobseekerId);
        setActiveComponent('jobseekerProfile')
    }

    const onProfileCreated = () => {
        setHasProfile(true)
        setActiveComponent('paymentVerification')
    };

    const onPaymentSuccess = (paymentDate) => {
        setIsVerified(true)
        setLastPaymentDate(paymentDate)
        window.location.reload()
    };

    const canAccessPaymentVerification = () => {
        if (!isVerified) return true
        const today = new Date()
        return today >= nextVerificationDate
    };

    const handleNavClick = (component) => {
        if (!isVerified && component !== 'employerProfile' && component !== 'accountSettings') {
            alert('You need to pay the verification fee to access this section.');
        } else if (component === 'paymentVerification' && !canAccessPaymentVerification()) {
            alert(`You have already paid the verification fee. Next verification available on ${nextVerificationDate.toLocaleDateString()}.`);
        } else {
            setActiveComponent(component)
        }
    };

    const renderComponent = () => {
        switch (activeComponent) {
            case 'employerProfile':
                return <EmployerProfile onProfileCreated={() => setHasProfile(true)} />
            case 'employerProfileManagement':
                return <EmployerProfileManagement />
            case 'jobPosting':
                return <JobPosting />
            case 'jobPostingManagement':
                return <JobPostingManagement />
            case 'accountSettings':
                return <AccountSettings />
            case 'paymentVerification':
                if (canAccessPaymentVerification()) {
                    return <PaymentVerification onPaymentSuccess={onPaymentSuccess} />
                }
                return null
            case 'notifications':
                return <Notifications />
            case 'employerSearch':
                return <EmployerSearch />
            case 'jobseekerView':
            default:
                return <EmployerJobseekerView />
        }
    }

    return (
        <div className="employer-dashboard">
            <header className="employer-navbar">
                <div className="brand-container">
                    {user && user.userType === 'employer' && <FaUserTie className="brand-icon"/>}
                    <span className="brand-name">
                    {user ? user.username : 'Loading...'} {isVerified && <FaCheckCircle className="verified-icon" />}
                </span>
                </div>
                <nav className="employer-nav">
                    <ul>
                        <li onClick={() => handleNavClick('jobseekerView')}>Jobseeker Profiles</li>
                        {!hasProfile && (
                            <li onClick={() => handleNavClick('employerProfile')}>Create Profile</li>
                        )}
                        {hasProfile && (
                            <>
                                <li onClick={() => handleNavClick('employerProfileManagement')}>Manage Profile</li>
                                {isVerified && (
                                    <>
                                        <li onClick={() => handleNavClick('jobPosting')}>Create Job Posting</li>
                                        <li onClick={() => handleNavClick('jobPostingManagement')}>Manage Job Postings</li>
                                    </>
                                )}
                            </>
                        )}
                        <li onClick={() => handleNavClick('accountSettings')}>Account Settings</li>
                        {!isVerified && (
                            <li onClick={() => handleNavClick('paymentVerification')}>Payment Verification</li>
                        )}
                        {isVerified && (
                            <li onClick={() => handleNavClick('employerSearch')}>Search Jobseekers</li>
                        )}
                    </ul>
                </nav>
                <div className="nav-right">
                 <div className="notification-icon" onClick={() => setActiveComponent('notifications')}>
                        <FaBell />
                        {unreadNotificationsCount > 0 && (
                            <span className="notification-count">{unreadNotificationsCount}</span>
                        )}
                    </div>
                    <Logout />
                </div>
            </header>
            <main>
                {renderComponent()}
            </main>
        </div>
    )
}

export default EmployerDashboard