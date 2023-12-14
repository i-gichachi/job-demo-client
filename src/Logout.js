import React from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
    const navigate = useNavigate()

    const handleLogout = () => {
        const confirmation = window.confirm("Are you sure you want to log out?")
        if (confirmation) {
    
            localStorage.removeItem('token')

            alert('You have successfully logged out.')
            navigate('/')
        }
    }

    return (
        <div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default Logout
