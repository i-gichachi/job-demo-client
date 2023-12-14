import React, { useState, useEffect, useRef } from 'react';
import { useUserContext } from './UserContext';
import './PaymentVerification.css';

function PaymentVerification() {
    const [phoneNumber, setPhoneNumber] = useState('254')
    const [isProcessing, setIsProcessing] = useState(false)
    const [isVerified, setIsVerified] = useState(false)
    const { user } = useUserContext()
    const intervalId = useRef(null) 

    const getAuthToken = () => {
        return localStorage.getItem('token')
    }

    const checkVerificationStatus = async () => {
        if (user && user.userId) {
            const token = getAuthToken()
            const response = await fetch(`https://test-server-6mxa.onrender.com/payment-status/${user.userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            })
            const data = await response.json()
            if (data.verified) {
                clearInterval(intervalId.current)
                setIsProcessing(false)
                setIsVerified(true)
                alert('Payment verified successfully! Your account is now verified.')
            }
        }
    }

    const initiatePayment = async () => {
        if (!user || !user.userId) {
            alert("Error: User not identified.")
            return
        }

        setIsProcessing(true)
        const token = getAuthToken()
        const response = await fetch('https://test-server-6mxa.onrender.com/stk-push', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone_number: phoneNumber, amount: 1 })
        })

        const data = await response.json();

        if (response.ok) {
            alert('Please check your phone to complete the M-Pesa transaction.')
            intervalId.current = setInterval(checkVerificationStatus, 5000)
        } else {
            alert('Error: ' + data.message)
            setIsProcessing(false)
        }
    }

    useEffect(() => {
        return () => {
            if (intervalId.current) {
                clearInterval(intervalId.current)
            }
        }
    }, [])

    return (
        <div className="payment-verification">
            <h2>Verify Your Account via M-Pesa</h2>
            <div className="payment-form">
                <input
                    type="tel"
                    placeholder="2547XXXXXXXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={isProcessing}
                    maxLength={12}
                />
                <button onClick={initiatePayment} disabled={isProcessing || phoneNumber.length !== 12}>
                    {isProcessing ? 'Processing...' : 'Pay Ksh 1 with M-Pesa'}
                </button>
            </div>
            {isProcessing && <p>Please complete the M-Pesa transaction on your phone...</p>}
            {isVerified && <p>Your account has been verified!</p>}
        </div>
    )
}

export default PaymentVerification