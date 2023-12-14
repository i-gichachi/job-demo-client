import React, { useState } from 'react';
import './EmployerSearch.css'

function EmployerSearch({ onViewProfile }) {
    const [searchParams, setSearchParams] = useState({
        availability: '',
        job_category: '',
        salary_expectations: '',
    })
    const [jobseekers, setJobseekers] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [error, setError] = useState('')

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prevParams => ({
            ...prevParams,
            [name]: value,
        }))
    }

    const performSearch = async () => {
        setError('')
        try {
            const authToken = localStorage.getItem('token')
            const queryString = new URLSearchParams(searchParams).toString();
            const response = await fetch(`https://job-seeking-57c5.onrender.com/employer/search?${queryString}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = await response.json()
            setJobseekers(data)
            setIsModalOpen(true)
        } catch (error) {
            setError('Failed to fetch jobseekers. Please try again.')
            console.error('Error:', error)
        }
    }

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    }

    const renderModal = () => (
        <div className="modal-overlay" onClick={toggleModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <span className="close-modal" onClick={toggleModal}>&times;</span>
                <h2>Search Results</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Resume</th>
                            <th>Availability</th>
                            <th>Job Category</th>
                            <th>Salary Expectations</th>
                            <th>Verified</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobseekers.map(js => (
                            <tr key={js.id}>
                                <td>{js.username}</td>
                                <td><a href={js.resume} target="_blank" rel="noopener noreferrer">View Resume</a></td>
                                <td>{js.availability}</td>
                                <td>{js.job_category}</td>
                                <td>{js.salary_expectations}</td>
                                <td>{js.is_verified ? 'Yes' : 'No'}</td>
                                <td>
                                    <button onClick={() => onViewProfile(js)}>View Profile</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )

    return (
        <div className="employer-search-container">
            <h2>Search Jobseekers</h2>
            <div>
            <label>
                    Availability:
                    <select
                        name="availability"
                        value={searchParams.availability}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Availability</option>
                        <option value="Available">Available</option>
                        <option value="Not Available">Not Available</option>
                    </select>
                </label>

                <label>
                    Job Category:
                    <select
                        name="job_category"
                        value={searchParams.job_category}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Job Category</option>
                        <option value="Healthcare and Medicine">Healthcare and Medicine</option>
                        <option value="Healthcare and Medicine">Healthcare and Medicine</option>
                        <option value="Information Technology and Computer Science">Information Technology and Computer Science</option>
                        <option value="Education and Teaching">Education and Teaching</option>
                        <option value="Business and Finance">Business and Finance</option>
                        <option value="Engineering and Architecture">Engineering and Architecture</option>
                        <option value="Legal Services">Legal Services</option>
                        <option value="Arts, Design, and Entertainment">Arts, Design, and Entertainment</option>
                        <option value="Sales and Retail">Sales and Retail</option>
                        <option value="Manufacturing and Construction">Manufacturing and Construction</option>
                        <option value="Science and Research">Science and Research</option>
                        <option value="Hospitality and Tourism">Hospitality and Tourism</option>
                        <option value="Public Service and Administration">Public Service and Administration</option>
                        <option value="Agriculture and Forestry">Agriculture and Forestry</option>
                        <option value="Transportation and Logistics">Transportation and Logistics</option>
                        <option value="Skilled Trades">Skilled Trades</option>
                        <option value="Media and Communications">Media and Communications</option>
                    </select>
                </label>

                <label>
                    Salary Range (Ksh):
                    <select
                        name="salary_expectations"
                        value={searchParams.salary_expectations}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Salary Range</option>
                        <option value="0-50000">0-50,000</option>
                        <option value="50001-100000">50,001-100,000</option>
                        <option value="100001-200000">100,001-200,000</option>
                        <option value="200001-300000">200,001-300,000</option>
                        <option value="300001-400000">300,001-400,000</option>
                        <option value="400001-500000">400,001-500,000</option>
                    </select>
                </label>
            </div>
            <button onClick={performSearch}>Search</button>
            {error && <p>{error}</p>}
            {isModalOpen && renderModal()}
        </div>
    )
}

export default EmployerSearch