import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useUserContext } from './UserContext';
import './EmployerProfileManagement.css'

function EmployerProfileManagement() {
    const [editMode, setEditMode] = useState(false);
    const [profileData, setProfileData] = useState({
        company_name: '',
        company_image: '',
        company_description: ''
    });
    const { user } = useUserContext();

    useEffect(() => {
        const fetchData = async () => {
            if (user && user.userId) {
                const authToken = localStorage.getItem('token'); // Replace 'authToken' with your actual token key
                try {
                    const profileResponse = await fetch(`https://test-server-6mxa.onrender.com/employer/profile/${user.userId}`, {
                        headers: {
                            'Authorization': `Bearer ${authToken}`
                        }
                    });
                    if (profileResponse.ok) {
                        const data = await profileResponse.json();
                        setProfileData(data);
                    } else {
                        console.error('Failed to fetch profile data');
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };

        fetchData();
    }, [user]);

    const handleSubmit = async (values) => {
        const authToken = localStorage.getItem('token'); // Replace 'authToken' with your actual token key
        try {
            const requestOptions = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(values)
            };

            if (user && user.userId) {
                const response = await fetch(`https://test-server-6mxa.onrender.com/employer/profile/${user.userId}`, requestOptions);
                if (response.ok) {
                    alert('Employer profile updated successfully');
                    setEditMode(false);
                } else {
                    const data = await response.json();
                    alert(data.message || 'Unable to update profile. Please try again.');
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const validationSchema = Yup.object().shape({
        company_name: Yup.string().required('Company name is required'),
        company_image: Yup.string().required('Company image URL is required'),
        company_description: Yup.string().required('Company description is required')
    });

    return (
        <div className='employer-profile-management-container'>
            <h1 className='employer-profile-management-header'>Employer Profile Management</h1>
            <Formik
                initialValues={profileData}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ isSubmitting }) => (
                    <Form className='employer-profile-form'>
                        <label htmlFor="company_name"> Company Name:</label>
                        <Field type="text" name="company_name" disabled={!editMode} />
                        <ErrorMessage name="company_name" component="div" />

                        <label htmlFor="company_image"> Company Image:</label>
                        <Field type="text" name="company_image" disabled={!editMode} />
                        <ErrorMessage name="company_image" component="div" />

                        <label htmlFor="company_description"> Company Description:</label>
                        <Field as="textarea" name="company_description" disabled={!editMode} />
                        <ErrorMessage name="company_description" component="div" />

                        {editMode ? (
                            <>
                                <button type="submit" disabled={isSubmitting}>Save</button>
                                <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
                            </>
                        ) : (
                            <button type="button" onClick={() => setEditMode(true)}>Edit</button>
                        )}
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default EmployerProfileManagement;