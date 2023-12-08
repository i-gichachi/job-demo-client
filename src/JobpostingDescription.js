import React, { useState, useEffect } from 'react';

function JobpostingDescription({ jobpostingId }) {
    const [jobPosting, setJobPosting] = useState(null);

    useEffect(() => {
        const fetchJobPosting = async () => {
            try {
                const authToken = localStorage.getItem('token'); // Replace 'authToken' with your actual token key

                const response = await fetch(`https://test-server-6mxa.onrender.com/jobposting/${jobpostingId}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setJobPosting(data);
                } else {
                    console.error('Job posting not found');
                }
            } catch (error) {
                console.error('Error fetching job posting:', error);
            }
        };

        if (jobpostingId) {
            fetchJobPosting();
        }
    }, [jobpostingId]);

    if (!jobPosting) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{jobPosting.title}</h1>
            <p><strong>Location:</strong> {jobPosting.location}</p>
            <p><strong>Salary Range:</strong> Ksh {jobPosting.salary_range}</p>
            <p><strong>Job Type:</strong> {jobPosting.job_type}</p>

            <div>
                <h2>Description</h2>
                <p>{jobPosting.description}</p>
            </div>
            <div>
                <h2>Responsibilities</h2>
                <ul>
                    {jobPosting.responsibilities.split(';').map((responsibility, index) => (
                        <li key={index}>{responsibility}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Instructions</h2>
                <ul>
                    {jobPosting.instructions.split(';').map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Qualifications</h2>
                <ul>
                    {jobPosting.qualifications.split(';').map((qualification, index) => (
                        <li key={index}>{qualification}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default JobpostingDescription