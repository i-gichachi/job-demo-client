import React, { useState, useEffect } from 'react';
import { useUserContext } from './UserContext'; // Import the context hook
import './PaymentVerification.css';

function PaymentVerification() {
    const [phoneNumber, setPhoneNumber] = useState('254');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const { user } = useUserContext(); // Use the context to access user data

    // Ensure the employerId is retrieved from the user context
    const employerId = user ? user.userId : null;

    const checkVerificationStatus = async () => {
        if (!employerId) return;
        const response = await fetch(`https://test-server-6mxa.onrender.com/payment-status/${employerId}`);
        const data = await response.json();
        if (data.verified) {
            setIsProcessing(false);
            setIsVerified(true);
            alert('Payment verified successfully! Your account is now verified.');
        }
    };

    const initiatePayment = async () => {
        if (!employerId) {
            alert('Employer ID not found.');
            return;
        }

        setIsProcessing(true);
        const response = await fetch('https://test-server-6mxa.onrender.com/stk-push', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone_number: phoneNumber, amount: 1 })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Please check your phone to complete the M-Pesa transaction.');
            const interval = setInterval(checkVerificationStatus, 5000); // Poll every 5 seconds
            setTimeout(() => clearInterval(interval), 60000); // Stop polling after 60 seconds
        } else {
            alert('Error: ' + data.message);
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        if (isVerified) {
            // Perform actions after verification, e.g., redirect or update UI
        }
    }, [isVerified]);

    return (
        <div className="payment-verification">
            <h2>Verify Your Account via M-Pesa</h2>
            <div className="payment-form">
                <input
                    type="tel"
                    className="phone-input"
                    placeholder="2547XXXXXXXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={isProcessing}
                    maxLength={12}  // 3 digits for '254' and 9 for the phone number
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