import React, { useState } from 'react';
import './PaymentVerification.css'

function PaymentVerification() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const initiatePayment = async () => {
        // Prepend the country code if it's not already included
        const fullPhoneNumber = phoneNumber.startsWith('254') ? phoneNumber : `254${phoneNumber}`;

        setIsProcessing(true);
        const response = await fetch('https://test-server-6mxa.onrender.com/stk-push', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone_number: `+${fullPhoneNumber}`, amount: 1 })
        });

        const data = await response.json();
        setIsProcessing(false);

        if (response.ok) {
            // If the STK Push was initiated successfully, alert the user to complete the payment
            alert('Please check your phone to complete the M-Pesa transaction.');
        } else {
            // If there was an error, display it to the user
            alert('Error: ' + data.message);
        }
    };

    return (
        <div className="payment-verification">
            <h2>Verify Your Account via M-Pesa</h2>
            <div className="payment-form">
                <input
                    type="tel"
                    placeholder="Enter last 9 digits of your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={isProcessing}
                />
                <button onClick={initiatePayment} disabled={isProcessing || phoneNumber.length !== 9}>
                    {isProcessing ? 'Processing...' : 'Pay Ksh 1 with M-Pesa'}
                </button>
            </div>
            {isProcessing && <p>Please complete the M-Pesa transaction on your phone...</p>}
        </div>
    );
}

export default PaymentVerification;