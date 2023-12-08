import React, { useState, useEffect } from 'react';
import JobpostingDescription from './JobpostingDescription';
import './JobpostingList.css'

function JobpostingListing() {
    const [jobPostings, setJobPostings] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [selectedJobPosting, setSelectedJobPosting] = useState(null);

    useEffect(() => {
        const fetchJobPostings = async () => {
            try {
                const authToken = localStorage.getItem('token'); // Replace 'authToken' with your actual token key
                const response = await fetch('https://test-server-6mxa.onrender.com/jobpostings', {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Job Postings:', data.postings);
                    setJobPostings(data.postings);
                } else {
                    setJobPostings([]);
                    console.error('No job postings available at the moment. Please try again later.');
                }
            } catch (error) {
                console.error('Error fetching job postings:', error);
            }
        };

        fetchJobPostings();
    }, []);

    if (jobPostings.length === 0) {
        return <p>No Jobpostings available at the moment! Please try again after sometime!</p>
    }

    const groupByEmployers = (postings) => {
        return postings.reduce((acc, posting) => {
            (acc[posting.employer.id] = acc[posting.employer.id] || []).push(posting)
            return acc
        }, {})
    }

    const handleViewJobs = (employerId) => {
        console.log('Selected Employer ID:', employerId)
        const selectedPostings = jobPostings.filter(posting => posting.employer.id === employerId)
        if (selectedPostings.length > 0) {
            setSelectedCompany({
                name: selectedPostings[0].employer.company_name,
                image: selectedPostings[0].employer.company_image,
                postings: selectedPostings
            })
        } else {
            console.error(`No job postings found for employer ID: ${employerId}`)
        }
    }

    const viewJobDetails = (jobpostingId) => {
        setSelectedJobPosting(jobpostingId);
    }

    const closeJobDetails = () => {
        setSelectedJobPosting(null);
    }

    const jobPostingsByEmployer = groupByEmployers(jobPostings);

    return (
        <div className='job-posting-list-container'>
            <h1 className='job-posting-title'>Job Postings</h1>
            {!selectedCompany && Object.entries(jobPostingsByEmployer).map(([employerId, postings]) => (
                <div key={employerId} className="company-card">
                    <img src={postings[0].employer.company_image} alt={postings[0].employer.company_name} />
                    <h2>{postings[0].employer.company_name}</h2>
                    <p>Number of Job Postings: {postings.length}</p>
                    {/* Directly pass the employer ID from the postings array */}
                    <button onClick={() => handleViewJobs(postings[0].employer.id)}>View Jobs</button>
                </div>
            ))}
            {selectedCompany && (
                <div>
                    <h2 className='job-posting-title'>Job Postings at {selectedCompany.name}</h2>
                    {selectedCompany.postings.map((posting) => (
                        <div key={posting.id} className="job-posting-card">
                            <h3>{posting.title}</h3>
                            <p>Location: {posting.location}</p>
                            <button onClick={() => viewJobDetails(posting.id)}>View More Details</button>
                        </div>
                    ))}
                    <button onClick={() => setSelectedCompany(null)}>Back to Companies</button>
                </div>
            )}
            {selectedJobPosting && (
                <div className="modal-backdrop">
                    <div className="modal">
                    <JobpostingDescription jobpostingId={selectedJobPosting} />
                 <button onClick={closeJobDetails}>Close</button>
                </div>
            </div>
            )}
        </div>
    )
}

export default JobpostingListing