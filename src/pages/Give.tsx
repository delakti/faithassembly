import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PaymentForm, CreditCard } from 'react-square-web-payments-sdk';
import { FaHandHoldingHeart, FaLock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const Give: React.FC = () => {
    const [amount, setAmount] = useState<string>('50');
    const [customAmount, setCustomAmount] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const appId = import.meta.env.VITE_SQUARE_APP_ID;
    const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID;

    // Helper to get actual amount to charge (number)
    const getChargeAmount = () => {
        const val = customAmount ? parseFloat(customAmount) : parseFloat(amount);
        return isNaN(val) ? 0 : val;
    };

    const handlePayment = async (token: any) => {
        setIsProcessing(true);
        setPaymentStatus('idle');
        setErrorMessage('');

        const chargeAmount = getChargeAmount();

        if (chargeAmount <= 0) {
            setErrorMessage('Please enter a valid donation amount.');
            setIsProcessing(false);
            return;
        }

        try {
            // Convert to smallest currency unit (e.g., pence/cents)
            // Assuming GBP/USD, so * 100
            const amountInCents = Math.round(chargeAmount * 100);

            const response = await fetch('/api/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sourceId: token.token,
                    amount: amountInCents,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setPaymentStatus('success');
            } else {
                console.error('Payment failed:', data);
                setPaymentStatus('error');
                setErrorMessage(data.message || 'Payment failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            setPaymentStatus('error');
            setErrorMessage('An unexpected error occurred. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (!appId || !locationId) {
        return (
            <div className="min-h-screen pt-24 px-4 text-center">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 max-w-2xl mx-auto rounded">
                    <div className="flex items-center">
                        <FaExclamationCircle className="text-yellow-400 text-3xl mr-4" />
                        <div className="text-left">
                            <h3 className="text-lg font-bold text-yellow-800">Configuration Required</h3>
                            <p className="text-yellow-700">
                                The Square payment integration is not fully configured. Please set <code>VITE_SQUARE_APP_ID</code> and <code>VITE_SQUARE_LOCATION_ID</code> in your environment variables.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pt-20 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-16 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                        <FaHandHoldingHeart className="text-3xl" />
                    </motion.div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Give Online</h1>
                    <p className="text-gray-500 max-w-xl mx-auto">
                        Your generosity helps us continue our mission and serve our community. Thank you for your support.
                    </p>
                </div>

                <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    {paymentStatus === 'success' ? (
                        <div className="p-12 text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                            >
                                <FaCheckCircle className="text-4xl" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
                            <p className="text-gray-600 mb-8">
                                Your donation of £{getChargeAmount().toFixed(2)} has been received successfully.
                            </p>
                            <button
                                onClick={() => setPaymentStatus('idle')}
                                className="bg-cyan-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-cyan-700 transition"
                            >
                                Give Again
                            </button>
                        </div>
                    ) : (
                        <div className="p-6 sm:p-8">
                            {/* Amount Selection */}
                            <div className="mb-8">
                                <label className="block text-gray-700 font-semibold mb-3">Select Amount</label>
                                <div className="grid grid-cols-4 gap-3 mb-4">
                                    {['10', '25', '50', '100'].map((val) => (
                                        <button
                                            key={val}
                                            onClick={() => { setAmount(val); setCustomAmount(''); }}
                                            className={`py-2 rounded-lg font-medium transition ${amount === val && !customAmount
                                                    ? 'bg-cyan-600 text-white shadow-md'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            £{val}
                                        </button>
                                    ))}
                                </div>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
                                    <input
                                        type="number"
                                        placeholder="Other amount"
                                        value={customAmount}
                                        onChange={(e) => setCustomAmount(e.target.value)}
                                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                                    />
                                </div>
                            </div>

                            {/* Square Payment Form Component */}
                            <div className="mb-6">
                                <label className="block text-gray-700 font-semibold mb-3">Payment Details</label>
                                <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                                    <PaymentForm
                                        applicationId={appId}
                                        locationId={locationId}
                                        cardTokenizeResponseReceived={handlePayment}
                                    >
                                        <CreditCard
                                            buttonProps={{
                                                css: {
                                                    backgroundColor: '#0891b2', // cyan-600
                                                    fontSize: '16px',
                                                    color: '#fff',
                                                    '&:hover': {
                                                        backgroundColor: '#0e7490', // cyan-700
                                                    },
                                                }
                                            }}
                                        >
                                            {isProcessing ? 'Processing...' : `Donate £${getChargeAmount().toFixed(2)}`}
                                        </CreditCard>
                                    </PaymentForm>
                                </div>
                            </div>

                            {/* Error Message */}
                            {errorMessage && (
                                <div className="mb-4 text-red-600 bg-red-50 p-3 rounded-lg flex items-center text-sm">
                                    <FaExclamationCircle className="mr-2 flex-shrink-0" />
                                    {errorMessage}
                                </div>
                            )}

                            {/* Security Note */}
                            <div className="flex items-center justify-center text-xs text-gray-400 mt-6">
                                <FaLock className="mr-1" />
                                Secure payment processing powered by Square
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Give;
