import React, { useState } from 'react';
import './PaymentVerification.css'

function PaymentVerification() {
    const [phoneNumber, setPhoneNumber] = useState('254');
    const [isProcessing, setIsProcessing] = useState(false);

    const initiatePayment = async () => {
        setIsProcessing(true);
        const response = await fetch('https://test-server-6mxa.onrender.com/stk-push', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone_number: phoneNumber, amount: 1 })
        });

        const data = await response.json();
        setIsProcessing(false);

        if (response.ok) {
            alert('Please check your phone to complete the M-Pesa transaction.');
        } else {
            alert('Error: ' + data.message);
        }
    };

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
        </div>
    );
}

export default PaymentVerification;