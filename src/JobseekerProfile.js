import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useUserContext } from './UserContext';
import './JobseekerProfile.css'

const JobseekerProfileSchema = Yup.object().shape({
    resume: Yup.string().required('Resume is required'),
    profile_status: Yup.string().required('Profile status is required'),
    availability: Yup.string().required('Availability is required'),
    job_category: Yup.string().required('Job category is required'),
    salary_expectations: Yup.string().required('Salary expectations are required')
})

const getAuthToken = () => {
    return localStorage.getItem('token')
}

function JobseekerProfile(props) {
    const { user } = useUserContext()

    const handleSubmit = async (values, { setSubmitting, resetForm, setErrors }) => {
        console.log(user);
        if (user.userType !== 'jobseeker') {
            alert('Unauthorized or invalid user type')
            return
        }

        try {
            const authToken = getAuthToken();
            const profileData = { ...values, user_id: user.userId }
            const requestOptions = {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`
                },
                body: JSON.stringify(profileData)
            }

            const response = await fetch('https://test-server-6mxa.onrender.com/jobseeker/profile', requestOptions)
            const data = await response.json()

            if (response.ok) {
                alert(data.message || 'Profile created successfully!')
                resetForm()
                props.onProfileCreated()
            } else {
                alert(data.message || 'Error creating profile. Please try again.')
                setErrors({ api: data.message })
            }
        } catch (error) {
            console.error('Error:', error)
            setErrors({ api: 'An error occurred. Please try again.' })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="jobseeker-profile-container">
            <h1 className="jobseeker-profile-header">Create Jobseeker Profile</h1>
            <Formik
                initialValues={{
                    resume: '',
                    profile_status: 'Active',
                    availability: 'Available',
                    job_category: '',
                    salary_expectations: ''
                }}
                validationSchema={JobseekerProfileSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className='jobseeker-profile-form'>
                        <div>
                            <label htmlFor="resume">Resume:</label>
                            <Field type="text" name="resume" placeholder="Google Docs link" />
                            <ErrorMessage name="resume" component="div" />
                        </div>

                        <div>
                            <label htmlFor="profile_status">Profile Status:</label>
                            <Field as="select" name="profile_status">
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </Field>
                            <ErrorMessage name="profile_status" component="div" />
                        </div>

                        <div>
                            <label htmlFor="availability">Availability:</label>
                            <Field as="select" name="availability">
                                <option value="Available">Available</option>
                                <option value="Not-Available">Not-Available</option>
                            </Field>
                            <ErrorMessage name="availability" component="div" />
                        </div>

                        <div>
                            <label htmlFor="job_category">Job Category:</label>
                            <Field as="select" name="job_category">
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
                        </div>

                        <div>
                            <label htmlFor="salary_expectations">Salary Expectations (Ksh):</label>
                            <Field type="text" name="salary_expectations" />
                            <ErrorMessage name="salary_expectations" component="div" />
                        </div>

                        <button type="submit" disabled={isSubmitting}>Submit</button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default JobseekerProfile