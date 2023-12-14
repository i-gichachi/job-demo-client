import React, { createContext, useState, useContext, useEffect } from 'react';

export const UserContext = createContext(null)

export const useUserContext = () => useContext(UserContext)

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const checkLoginState = async () => {
            try {
                const token = localStorage.getItem('token')
                if (token) {
                    const response = await fetch('https://job-seeking-57c5.onrender.com/check_user', {
                        headers: {
                            'Authorization': `Bearer ${token}` 
                        }
                    })

                    if (response.ok) {
                        const data = await response.json()
                        if (data.logged_in) {
                            setUser({ 
                                userType: data.user_type, 
                                username: data.username, 
                                userId: data.user_id 
                            })
                        }
                    } else {
                        console.error('Non-JSON response received:', response.statusText)
                    }
                }
            } catch (error) {
                console.error('Error checking login state:', error)
            }
        }
    
        checkLoginState()
    }, [])

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}
