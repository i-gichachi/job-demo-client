import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './AccountSetting.css'

const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    firstname: Yup.string().required('First name is required'),
    secondname: Yup.string(),
    surname: Yup.string().required('Surname is required'),
    gender: Yup.string().required('Gender is required'),
    address: Yup.string().required('Address is required'),
    phone_number: Yup.string().matches(/^[0-9]{9}$/, 'Phone number must be a valid Kenyan number').required('Phone number is required')
});

function AccountSettings() {
    const [editMode, setEditMode] = useState(false)
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        firstname: '',
        secondname: '',
        surname: '',
        gender: '',
        address: '',
        phone_number: ''
    });

    
    const getAuthToken = () => {
        return localStorage.getItem('token'); 
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const authToken = getAuthToken();
                const userResponse = await fetch('https://test-server-6mxa.onrender.com/user/info', {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
                const userData = await userResponse.json();
                setUserData(userData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (values) => {
        try {
            const authToken = getAuthToken();
            const requestOptions = {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(values)
            };
            const response = await fetch('https://test-server-6mxa.onrender.com/user/update', requestOptions);
            if (response.ok) {
                alert('You have Successfully Updated your information!');
                setEditMode(false);
            } else {
                const data = await response.json();
                alert(data.message || 'Update failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Update failed. Please try again.');
        }
    };

    const editModeToggle = () => {
        setEditMode(!editMode);
    };


    return (
        <div className="account-settings-container"> 
            <h1 className='account-settings'>Account Settings</h1>
            <Formik initialValues={userData} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
                {({ isSubmitting }) => (
                    <Form className='account-settings-form'>
                        <label htmlFor="username"> Username:</label>
                        <Field type="text" name="username" placeholder="Username" disabled={!editMode} />
                        <ErrorMessage name="username" component="div" />

                        <label htmlFor="email"> Email</label>
                        <Field type="email" name="email" placeholder="Email" disabled={!editMode} />
                        <ErrorMessage name="email" component="div" />

                        <label htmlFor="firstname"> Firstname:</label>
                        <Field type="text" name="firstname" placeholder="First Name" disabled={!editMode} />
                        <ErrorMessage name="firstname" component="div" />

                        <label htmlFor="secondname"> Secondname:</label>
                        <Field type="text" name="secondname" placeholder="Second Name" disabled={!editMode} />

                        <label htmlFor="surname"> Surname:</label>
                        <Field type="text" name="surname" placeholder="Surname" disabled={!editMode} />
                        <ErrorMessage name="surname" component="div" />

                        <label htmlFor="gender"> Gender:</label>
                        <Field as="select" name="gender" disabled={!editMode}>
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </Field>
                        <ErrorMessage name="gender" component="div" />

                        <label htmlFor="address"> Address:</label>
                        <Field as="select" name="address" disabled={!editMode}>
                            <option value="">Select County</option>
                            <option value="Baringo">Baringo</option>
                            <option value="Bomet">Bomet</option>
                            <option value="Bungoma">Bungoma</option>
                            <option value="Busia">Busia</option>
                            <option value="Elgeyo Marakwet">Elgeyo Marakwet</option>
                            <option value="Embu">Embu</option>
                            <option value="Garissa">Garissa</option>
                            <option value="Homa Bay">Homa Bay</option>
                            <option value="Isiolo">Isiolo</option>
                            <option value="Kajiado">Kajiado</option>
                            <option value="Kakamega">Kakamega</option>
                            <option value="Kericho">Kericho</option>
                            <option value="Kiambu">Kiambu</option>
                            <option value="Kilifi">Kilifi</option>
                            <option value="Kirinyaga">Kirinyaga</option>
                            <option value="Kisii">Kisii</option>
                            <option value="Kisumu">Kisumu</option>
                            <option value="Kitui">Kitui</option>
                            <option value="Kwale">Kwale</option>
                            <option value="Laikipia">Laikipia</option>
                            <option value="Lamu">Lamu</option>
                            <option value="Machakos">Machakos</option>
                            <option value="Makueni">Makueni</option>
                            <option value="Mandera">Mandera</option>
                            <option value="Marsabit">Marsabit</option>
                            <option value="Meru">Meru</option>
                            <option value="Migori">Migori</option>
                            <option value="Mombasa">Mombasa</option>
                            <option value="Murang'a">Murang'a</option>
                            <option value="Nairobi">Nairobi</option>
                            <option value="Nakuru">Nakuru</option>
                            <option value="Nandi">Nandi</option>
                            <option value="Narok">Narok</option>
                            <option value="Nyamira">Nyamira</option>
                            <option value="Nyandarua">Nyandarua</option>
                            <option value="Nyeri">Nyeri</option>
                            <option value="Samburu">Samburu</option>
                            <option value="Siaya">Siaya</option>
                            <option value="Taita Taveta">Taita Taveta</option>
                            <option value="Tana River">Tana River</option>
                            <option value="Tharaka Nithi">Tharaka Nithi</option>
                            <option value="Trans Nzoia">Trans Nzoia</option>
                            <option value="Turkana">Turkana</option>
                            <option value="Uasin Gishu">Uasin Gishu</option>
                            <option value="Vihiga">Vihiga</option>
                            <option value="Wajir">Wajir</option>
                            <option value="West Pokot">West Pokot</option>
                        </Field>
                        <ErrorMessage name="address" component="div" />

                        <label htmlFor="phone_number"> Phone Number (+254):</label>
                        <Field type="text" name="phone_number" placeholder="7XXXXXXXX" disabled={!editMode} />
                        <ErrorMessage name="phone_number" component="div" />

                        {editMode ? (
                            <>
                                <button type="submit" disabled={isSubmitting}>Save</button>
                                <button type="button" onClick={editModeToggle}>Cancel</button>
                            </>
                        ) : (
                            <button type="button" onClick={editModeToggle}>Update</button>
                        )}
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default AccountSettings