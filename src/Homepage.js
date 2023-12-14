import React, { useState, useEffect } from 'react';
import { FaHome } from 'react-icons/fa'; 
import { Link } from 'react-router-dom';
import './Homepage.css'

function Homepage() {
    const [welcomeData, setWelcomeData] = useState({
        message: ''
    });

    useEffect(() => {
        const fetchWelcomeData = async () => {
            try {
                const response = await fetch('https://job-seeking-57c5.onrender.com/');
                if (response.ok && response.headers.get("Content-Type").includes("application/json")) {
                    const data = await response.json();
                    setWelcomeData({
                        message: data.message
                    });
                } else {
                    console.error('Non-JSON response received');
                    setWelcomeData(prev => ({ ...prev, message: 'Welcome to the Job Seeking Platform' }));
                }
            } catch (error) {
                console.error('Error fetching welcome data:', error);
                setWelcomeData(prev => ({ ...prev, message: 'Welcome to the Job Seeking Platform' }));
            }
        };
    
        fetchWelcomeData();
    }, []);
    
    return (
        <div className="homepage">
            <nav className="navbar">
                <Link to="/" className="navbar-brand"><FaHome /> Home</Link>
                <div className="navbar-nav">
                    <Link to="/signup" className="nav-item">Sign Up</Link>
                    <Link to="/login" className="nav-item">Login</Link>
                </div>
            </nav>

            <h1>{welcomeData.message}</h1>
            

            <section className="content">
                <div className="card-container">
                    {/* Brief Description Card */}
                    <div className="card">
                        <div className="card-image" style={{ backgroundImage: 'url(https://i.pinimg.com/564x/f1/08/f9/f108f928ab6566f49a93d1962b6251f0.jpg)' }}></div>
                        <div className="card-content">
                            <h2>Brief Description</h2>
                            <p>Our platform, based in Kenya, connects job seekers and employers in a streamlined, efficient manner. Job seekers can create profiles, post CVs, set job statuses, and explore job postings. Employers can manage job postings and initiate contact with potential candidates.</p>
                        </div>
                    </div>
                    {/* Advantages Card */}
                    <div className="card">
                        <div className="card-image" style={{ backgroundImage: 'url(https://i.pinimg.com/564x/e1/f0/22/e1f0223ea36815548b775ea61a4c09e1.jpg)' }}></div>
                        <div className="card-content">
                            <h2>Advantages</h2>
                                <p>Experience a tailored job search with our platform. Gain access to exclusive job listings, direct employer contacts, and a robust support system designed to align with your career aspirations. Say goodbye to endless searching and welcome targeted opportunities.</p>
                            </div>
                        </div>

                        {/* Mission Card */}
                        <div className="card">
                            <div className="card-image" style={{ backgroundImage: 'url(https://i.pinimg.com/564x/e5/79/72/e57972081be54c44e317f7017181c843.jpg)' }}></div>
                            <div className="card-content">
                                <h2>Mission</h2>
                            <p>Our mission is to revolutionize job seeking in Kenya by providing a dedicated platform that bridges the gap between talented individuals and potential employers. We aim to empower both job seekers and companies by facilitating efficient and meaningful connections.</p>
                            </div>
                        </div>

                            {/* Aim Card */}
                        <div className="card">
    <                       div className="card-image" style={{ backgroundImage: 'url(https://i.pinimg.com/564x/b2/9d/31/b29d3134e712c61692445901b8b59e3a.jpg)' }}></div>
                            <div className="card-content">
                                <h2>Aim</h2>
                                <p>Our aim is to enhance the job-seeking experience by offering a platform where job seekers can seamlessly connect with potential employers. We strive to provide an environment that fosters career growth and helps job seekers find roles that match their skills and ambitions.</p>
                            </div>
                        </div>
                        </div>
            </section>
        </div>
    );
}

export default Homepage