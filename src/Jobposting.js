import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './Jobposting.css'

const jobPostingSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    responsibilities: Yup.string().required('Responsibilities are required'),
    instructions: Yup.string().required('Instructions are required'),
    location: Yup.string().required('Location is required'),
    salary_range: Yup.string().required('Salary range is required'),
    qualifications: Yup.string().required('Qualifications are required'),
    job_type: Yup.string().required('Job type is required'),
})

const counties = [
    'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo Marakwet', 'Embu', 'Garissa', 
    'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 
    'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos', 
    'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a', 
    'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 
    'Samburu', 'Siaya', 'Taita Taveta', 'Tana River', 'Tharaka Nithi', 'Trans Nzoia', 
    'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
]

function JobPosting() {
    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const authToken = localStorage.getItem('token')

            const requestOptions = {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(values)
            }

            const response = await fetch('https://job-seeking-57c5.onrender.com/jobposting/create', requestOptions)
            const data = await response.json()

            if (response.ok) {
                alert(`Job posting '${values.title}' created successfully`)
                resetForm()
            } else {
                alert(data.message || 'Unable to create job posting. Please try again.')
            }
        } catch (error) {
            console.error('Error:', error)
            alert('An error occurred. Please try again.')
        }

        setSubmitting(false)
    }

    return (
        <div className='job-posting-container'>
            <h1 className='job-posting-header'>Create Job Posting</h1>
            <Formik
                 initialValues={{
                    title: '',
                    description: '',
                    responsibilities: '',
                    instructions: '',
                    location: '',
                    salary_range: '',
                    qualifications: '',
                    deadline: '',
                    job_type: '',
                }}
                validationSchema={jobPostingSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <label htmlFor="title"> Job Title:</label>
                        <Field type="text" name="title" placeholder="Title" />
                        <ErrorMessage name="title" component="div" />

                        <label htmlFor="description"> Job Description:</label>
                        <Field type="text" name="description" placeholder="Description" />
                        <ErrorMessage name="description" component="div" />

                        <label htmlFor="responsibilities"> Job Responsibilities:</label>
                        <Field type="text" name="responsibilities" placeholder="Responsibilities" />
                        <ErrorMessage name="responsibilities" component="div" />

                        <label htmlFor="qualifications"> Job Qualifications:</label>
                        <Field type="text" name="qualifications" placeholder="Qualifications" />
                        <ErrorMessage name="qualifications" component="div" />

                        <label htmlFor="instructions"> How to Apply:</label>
                        <Field type="text" name="instructions" placeholder="Instructions" />
                        <ErrorMessage name="instructions" component="div" />

                        <label htmlFor="job_type"> Job-Type:</label>
                        <Field as="select" name="job_type">
                            <option value="">Select Job Type</option>
                            <option value="full-time">Full-time</option>
                            <option value="part-time">Part-time</option>
                            <option value="contract">Contract</option>
                        </Field>
                        <ErrorMessage name="job_type" component="div" />

                        <label htmlFor="location"> Location:</label>
                        <Field as="select" name="location">
                            <option value="">Select a County</option>
                            {counties.map((county, index) => (
                                <option key={index} value={county}>{county}</option>
                            ))}
                        </Field>
                        <ErrorMessage name="location" component="div" />

                        <div>
                            <label htmlFor="salary_range"> Salary Range (Ksh):</label>
                            <Field type="text" name="salary_range" placeholder="Salary Range" />
                        </div>
                        <ErrorMessage name="salary_range" component="div" />

                        <button type="submit" disabled={isSubmitting}>
                            Create Job Posting
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default JobPosting