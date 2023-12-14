import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useUserContext } from './UserContext';
import './SeekerProfileManagement.css'

const JobseekerProfileSchema = Yup.object().shape({
    resume: Yup.string().required('Resume link is required'),
    profile_status: Yup.string().required('Profile status is required'),
    availability: Yup.string().required('Availability is required'),
    job_category: Yup.string().required('Job category is required'),
    salary_expectations: Yup.string().required('Salary expectations are required')
})

function SeekerProfileManagement() {
    const [editMode, setEditMode] = useState(false);
    const [profileData, setProfileData] = useState({
        resume: '',
        profile_status: '',
        availability: '',
        job_category: '',
        salary_expectations: ''
    })
    const { user } = useUserContext()

    const getAuthToken = () => {
        return localStorage.getItem('token')
    }

    useEffect(() => {
        if (user && user.userId) {
            const authToken = getAuthToken()
            fetch(`https://job-seeking-57c5.onrender.com/jobseeker/profile/${user.userId}`, {
                headers: {
                    Authorization: `Bearer ${authToken}` 
                }
            })
            .then(response => response.json())
            .then(data => {
                setProfileData(data);
            })
            .catch(error => {
                console.error('Error fetching profile data:', error)
            })
        }
    }, [user])

    const handleSubmit = async (values) => {
        if (values.profile_status === 'Inactive') {
            const confirmInactive = window.confirm("Setting your profile to 'Inactive' will make it invisible to employers. Are you sure you want to continue?");
            if (!confirmInactive) {
                return
            }
        }

        const authToken = getAuthToken()
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}` 
            },
            body: JSON.stringify(values)
        }

        fetch(`https://job-seeking-57c5.onrender.com/jobseeker/profile/update/${user.userId}`, requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message)
            }
            setEditMode(false)
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Update failed. Please try again.')
        })
    }

    const editModeToggle = () => {
        setEditMode(!editMode)
    }

    return (
        <div className="jobseeker-profile-management-container">
            <h1>Jobseeker Profile Management</h1>
            <Formik
                initialValues={profileData}
                validationSchema={JobseekerProfileSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ isSubmitting }) => (
                    <Form>
                        <label htmlFor="resume">Resume:</label>
                        <Field type="text" name="resume" disabled={!editMode}/>
                        <ErrorMessage name="resume" component="div" />

                        <label htmlFor="profile_status">Profile Status:</label>
                        <Field as="select" name="profile_status" disabled={!editMode}>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </Field>
                        <ErrorMessage name="profile_status" component="div" />

                        <label htmlFor="availability">Availability:</label>
                        <Field as="select" name="availability" disabled={!editMode}>
                            <option value="Available">Available</option>
                            <option value="Not-Available">Not-Available</option>
                        </Field>
                        <ErrorMessage name="availability" component="div" />

                        <label htmlFor="job_category">Job Category:</label>
                        <Field as="select" name="job_category" disabled={!editMode}>
                        <option value="">Select Job Category</option>
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
                        </Field>
                        <ErrorMessage name="job_category" component="div" />

                        <label htmlFor="salary_expectations">Salary Expectations (Ksh):</label>
                        <Field type="text" name="salary_expectations" disabled={!editMode}/>
                        <ErrorMessage name="salary_expectations" component="div" />

                        {editMode ? (
                            <>
                                <button type="submit" disabled={isSubmitting}>Save</button>
                                <button type="button" onClick={editModeToggle}>Cancel</button>
                            </>
                        ) : (
                            <button type="button" onClick={editModeToggle}>Edit</button>
                        )}
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SeekerProfileManagement