import React, { useState, useEffect, useRef } from 'react';
import { useUserContext } from './UserContext'; // Import the context hook
import './PaymentVerification.css';

function PaymentVerification() {
    const [phoneNumber, setPhoneNumber] = useState('254');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const { user } = useUserContext(); // Use the context to access user data
    const intervalId = useRef(null); // Store interval ID for clearing

    const getAuthToken = () => {
        return localStorage.getItem('token'); // Fetch the token from local storage
    };

    const checkVerificationStatus = async () => {
        if (user && user.userId) {
            const token = getAuthToken();
            const response = await fetch(`https://test-server-6mxa.onrender.com/payment-status/${user.userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}` // Include the JWT in the request
                }
            });
            const data = await response.json();
            if (data.verified) {
                clearInterval(intervalId.current);
                setIsProcessing(false);
                setIsVerified(true);
                alert('Payment verified successfully! Your account is now verified.');
            }
        }
    };

    const initiatePayment = async () => {
        if (!user || !user.userId) {
            alert("Error: User not identified.");
            return;
        }

        setIsProcessing(true);
        const token = getAuthToken();
        const response = await fetch('https://test-server-6mxa.onrender.com/stk-push', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // Include the JWT in the request
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone_number: phoneNumber, amount: 1 })
        });


        const data = await response.json();

        if (response.ok) {
            alert('Please check your phone to complete the M-Pesa transaction.');
            intervalId.current = setInterval(checkVerificationStatus, 5000); // Poll every 5 seconds
        } else {
            alert('Error: ' + data.message);
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        return () => {
            if (intervalId.current) {
                clearInterval(intervalId.current); // Clear interval on component unmount
            }
        };
    }, []);

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
    );
}

export default PaymentVerification;