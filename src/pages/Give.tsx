import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { FaHandHoldingHeart, FaLock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Give: React.FC = () => {
    const [amount, setAmount] = useState<string>('50');
    const [customAmount, setCustomAmount] = useState<string>('');
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || "";

    // Helper to get actual amount to charge (number)
    const getChargeAmount = () => {
        const val = customAmount ? parseFloat(customAmount) : parseFloat(amount);
        return isNaN(val) ? 0 : val;
    };

    const handleApprove = (orderId: string) => {
        console.log("Processing order:", orderId);
        setPaymentStatus('success');
        toast.success("Donation received! Thank you.");
    };

    if (!clientId) {
        return (
            <div className="min-h-screen pt-24 px-4 text-center">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 max-w-2xl mx-auto rounded">
                    <div className="flex items-center">
                        <FaExclamationCircle className="text-yellow-400 text-3xl mr-4" />
                        <div className="text-left">
                            <h3 className="text-lg font-bold text-yellow-800">Configuration Required</h3>
                            <p className="text-yellow-700">
                                The PayPal integration is not fully configured. Please set <code>VITE_PAYPAL_CLIENT_ID</code> in your environment variables.
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
                                            onClick={() => { setAmount(val || '50'); setCustomAmount(''); }}
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

                            {/* PayPal Button Component */}
                            <div className="mb-6 z-0 relative">
                                <label className="block text-gray-700 font-semibold mb-3">Payment Details</label>
                                <PayPalScriptProvider options={{ clientId: clientId, currency: "GBP" }}>
                                    <PayPalButtons
                                        style={{ layout: "vertical", color: "blue", shape: "rect", label: "donate" }}
                                        createOrder={(data, actions) => {
                                            console.log("Creating order for:", data);
                                            const val = getChargeAmount().toFixed(2);
                                            return actions.order.create({
                                                purchase_units: [
                                                    {
                                                        amount: {
                                                            currency_code: "GBP",
                                                            value: val,
                                                        },
                                                        description: "Faith Assembly Donation"
                                                    },
                                                ],
                                                intent: "CAPTURE"
                                            });
                                        }}
                                        onApprove={async (data, actions) => {
                                            console.log("Approved:", data);
                                            if (actions.order) {
                                                const order = await actions.order.capture();
                                                console.log("Order Successful:", order);
                                                handleApprove(order.id || "UNKNOWN_ORDER_ID");
                                            }
                                        }}
                                        onError={(err) => {
                                            console.error("PayPal Error:", err);
                                            setErrorMessage("Payment could not be processed. Please try again.");
                                        }}
                                    />
                                </PayPalScriptProvider>
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
                                Secure payment processing powered by PayPal
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Alternative Giving Methods */}
            <div className="max-w-4xl mx-auto mt-12 grid md:grid-cols-2 gap-8">
                {/* Bank Transfer */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-600 p-2 rounded-lg text-sm">BANK</span> Direct Transfer
                    </h3>
                    <div className="space-y-4 text-gray-600">
                        <p className="text-sm">You can set up a standing order or make a one-off transfer directly to our church account.</p>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2 text-sm font-mono text-gray-800">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Bank:</span>
                                <span className="font-bold">HSBC Bank</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Account Name:</span>
                                <span className="font-bold text-right ml-4">The Redeemed Christian Church of God Faith Assembly</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Sort Code:</span>
                                <span className="font-bold">40-45-08</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Account No:</span>
                                <span className="font-bold">62551594</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PayPal */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="bg-blue-100 text-[#003087] p-2 rounded-lg text-sm">PAYPAL</span> Give via PayPal
                        </h3>
                        <p className="text-gray-600 text-sm mb-6">
                            Prefer using PayPal? You can give securely using your PayPal account or debit card.
                        </p>
                    </div>
                    <a
                        href="https://paypal.me/faithassemblyuk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center bg-[#003087] hover:bg-[#002569] text-white font-bold py-3 rounded-xl transition-colors"
                    >
                        Open PayPal.me
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Give;
