import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import Logout from './Logout';
import Signup from './Signup';
import AdminDashboard from './AdminDashboard';
import EmployerDashboard from './EmployerDashboard';
import JobseekerDashboard from './JobseekerDashboard';
import Homepage from './Homepage';
import { UserProvider } from './UserContext'; 

function App() {

    return (
        <UserProvider>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/employer-dashboard" element={<EmployerDashboard />} />
                <Route path="/jobseeker-dashboard" element={<JobseekerDashboard />} />
            </Routes>
        </UserProvider>
    );
}

export default App;