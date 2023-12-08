import React, { useState } from 'react';
import { useUserContext } from './UserContext'; // Import the context hook
import './PaymentVerification.css'

function PaymentVerification() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const { user } = useUserContext(); // Use the context to access user data

    const initiatePayment = async () => {
        setIsProcessing(true);

        try {
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

                // Start polling for payment status
                const employerId = user.userId; // Use the employer ID from the user context
                const interval = setInterval(async () => {
                    const statusResponse = await fetch(`https://test-server-6mxa.onrender.com/payment-status/${employerId}`);
                    const statusData = await statusResponse.json();
                    if (statusData.verified) {
                        clearInterval(interval);
                        setIsProcessing(false);
                        alert('Payment verified successfully!');
                        // Update any additional state or perform further actions here
                    }
                }, 5000); // Poll every 5 seconds
            } else {
                alert('Error: ' + data.message);
                setIsProcessing(false);
            }
        } catch (error) {
            alert('An error occurred: ' + error.message);
            setIsProcessing(false);
        }
    };

    return (
        <div className="payment-verification">
            <h2>Verify Your Account via M-Pesa</h2>
            <div className="payment-form">
                <input
                    type="tel"
                    className="phone-input"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={isProcessing}
                />
                <button className="pay-button" onClick={initiatePayment} disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : 'Pay with M-Pesa'}
                </button>
            </div>
            {isProcessing && <p className="processing-message">Please complete the M-Pesa transaction on your phone...</p>}
        </div>
    );
}

export default PaymentVerification;