import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { PaymentForm, CreditCard } from 'react-square-web-payments-sdk';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FaHandHoldingHeart, FaLock, FaCheckCircle, FaExclamationCircle, FaCreditCard, FaPaypal, FaUniversity, FaSquare } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

// --- Configuration & Keys ---
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || "";
const SQUARE_APP_ID = import.meta.env.VITE_SQUARE_APP_ID || "";
const SQUARE_LOCATION_ID = import.meta.env.VITE_SQUARE_LOCATION_ID || "";
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "";

const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

// --- Stripe Checkout Form Component ---
const StripeCheckoutForm = ({ amount, onSuccess }: { amount: number; onSuccess: (id: string) => void }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.href, // This might need to be adjusted to a dedicated success page
            },
            redirect: "if_required",
        });

        if (error) {
            setMessage(error.message || "An unexpected error occurred.");
            setIsLoading(false);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            onSuccess(paymentIntent.id);
            setIsLoading(false);
        } else {
            setMessage("Payment status: " + (paymentIntent?.status || "unknown"));
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement />
            <button
                disabled={isLoading || !stripe || !elements}
                className="w-full bg-[#635bff] text-white py-3 rounded-lg font-bold hover:bg-[#544ee0] disabled:opacity-50 transition shadow-md"
            >
                {isLoading ? "Processing..." : `Donate £${amount.toFixed(2)} via Stripe`}
            </button>
            {message && (
                <div className="bg-red-50 text-red-600 p-3 rounded text-sm flex items-center">
                    <FaExclamationCircle className="mr-2" /> {message}
                </div>
            )}
        </form>
    );
};


const Give: React.FC = () => {
    const [amount, setAmount] = useState<string>('50');
    const [customAmount, setCustomAmount] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'stripe' | 'paypal' | 'square' | 'bank'>('stripe');
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [clientSecret, setClientSecret] = useState("");

    // Helper to get actual amount to charge (number)
    const getChargeAmount = () => {
        const val = customAmount ? parseFloat(customAmount) : parseFloat(amount);
        return isNaN(val) ? 0 : val;
    };

    const currentAmount = getChargeAmount();

    // Fetch Stripe PaymentIntent on amount change or tab switch
    useEffect(() => {
        if (activeTab === 'stripe' && currentAmount > 0) {
            // Debounce or just fetch
            const fetchIntent = async () => {
                try {
                    const res = await fetch("/api/create-payment-intent", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ amount: Math.round(currentAmount * 100), currency: "gbp" }),
                    });
                    const data = await res.json();
                    if (data.clientSecret) setClientSecret(data.clientSecret);
                } catch (err) {
                    console.error("Failed to init Stripe", err);
                }
            };
            const timeout = setTimeout(fetchIntent, 500); // debounce
            return () => clearTimeout(timeout);
        }
    }, [currentAmount, activeTab]);

    const handleSuccess = (provider: string, id: string) => {
        console.log(`Success via ${provider}:`, id);
        setPaymentStatus('success');
        toast.success("Donation received! Thank you.");
    };

    const handleSquarePayment = async (token: any) => {
        try {
            const amountInCents = Math.round(currentAmount * 100);
            const response = await fetch('/api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sourceId: token.token, amount: amountInCents }),
            });
            const data = await response.json();
            if (response.ok) handleSuccess('Square', 'sq_token');
            else toast.error(data.message || "Square Payment Failed");
        } catch (e: any) {
            toast.error(e.message);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pt-20 pb-16 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200"
                    >
                        <FaHandHoldingHeart className="text-3xl" />
                    </motion.div>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Give Online</h1>
                    <p className="text-gray-500 max-w-xl mx-auto text-lg">
                        Your generosity empowers our mission. Choose the method that works best for you.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">

                    {/* LEFT COLUMN: Amount Selection */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">1. Select Amount</h3>
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                {['10', '25', '50', '100', '250', '500'].map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => { setAmount(val); setCustomAmount(''); }}
                                        className={`py-3 rounded-xl font-bold text-lg transition-all ${amount === val && !customAmount
                                            ? 'bg-blue-600 text-white shadow-md transform scale-105'
                                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'
                                            }`}
                                    >
                                        £{val}
                                    </button>
                                ))}
                            </div>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">£</span>
                                <input
                                    type="number"
                                    placeholder="Enter custom amount"
                                    value={customAmount}
                                    onChange={(e) => setCustomAmount(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-bold text-gray-800"
                                />
                            </div>
                        </div>

                        {/* Summary Card */}
                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-center">
                            <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-1">Total Donation</p>
                            <p className="text-4xl font-extrabold text-blue-900">£{currentAmount.toFixed(2)}</p>
                            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-blue-500 font-medium bg-white py-1.5 px-3 rounded-full mx-auto w-fit shadow-sm">
                                <FaLock className="w-3 h-3" /> Secure 256-bit SSL Encryption
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Payment Method */}
                    <div className="lg:col-span-7">
                        {paymentStatus === 'success' ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white p-12 rounded-2xl shadow-xl border border-green-100 text-center h-full flex flex-col items-center justify-center"
                            >
                                <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                                    <FaCheckCircle className="text-5xl" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Thank You!</h2>
                                <p className="text-gray-600 mb-8 text-lg">
                                    Your donation of £{currentAmount.toFixed(2)} has been received.
                                </p>
                                <button
                                    onClick={() => setPaymentStatus('idle')}
                                    className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition shadow-lg"
                                >
                                    Give Again
                                </button>
                            </motion.div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden min-h-[500px] flex flex-col">
                                {/* Tabs */}
                                <div className="flex border-b border-gray-100 bg-gray-50/50">
                                    <button
                                        onClick={() => setActiveTab('stripe')}
                                        className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'stripe' ? 'bg-white text-blue-600 border-t-2 border-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        <FaCreditCard /> Card (Stripe)
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('paypal')}
                                        className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'paypal' ? 'bg-white text-[#003087] border-t-2 border-[#003087] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        <FaPaypal /> PayPal
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('square')}
                                        className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'square' ? 'bg-white text-gray-800 border-t-2 border-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        <FaSquare /> Square
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('bank')}
                                        className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'bank' ? 'bg-white text-emerald-600 border-t-2 border-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        <FaUniversity /> Bank
                                    </button>
                                </div>

                                {/* Content Area */}
                                <div className="p-8 flex-1 bg-white relative">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">2. Complete Payment</h3>

                                    {/* STRIPE */}
                                    {activeTab === 'stripe' && (
                                        <div className="animate-fade-in">
                                            {clientSecret ? (
                                                <Elements stripe={stripePromise} options={{ clientSecret }}>
                                                    <StripeCheckoutForm amount={currentAmount} onSuccess={(id) => handleSuccess('Stripe', id)} />
                                                </Elements>
                                            ) : (
                                                <div className="flex justify-center items-center h-48 text-gray-400">
                                                    Loading secure payment...
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* PAYPAL */}
                                    {activeTab === 'paypal' && (
                                        <div className="animate-fade-in max-w-sm mx-auto">
                                            <p className="text-center text-gray-500 text-sm mb-6">Use your PayPal account or Card via PayPal</p>
                                            {PAYPAL_CLIENT_ID ? (
                                                <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: "GBP" }}>
                                                    <PayPalButtons
                                                        style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
                                                        createOrder={(_data, actions) => {
                                                            return actions.order.create({
                                                                purchase_units: [{
                                                                    amount: { currency_code: "GBP", value: currentAmount.toFixed(2) },
                                                                    description: "Faith Assembly Donation"
                                                                }],
                                                                intent: "CAPTURE"
                                                            });
                                                        }}
                                                        onApprove={async (_data, actions) => {
                                                            if (actions.order) {
                                                                const order = await actions.order.capture();
                                                                handleSuccess('PayPal', order.id || 'unknown');
                                                            }
                                                        }}
                                                    />
                                                </PayPalScriptProvider>
                                            ) : <div className="text-red-500">PayPal Config Missing</div>}

                                            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                                                <p className="text-xs text-gray-400 mb-3">Or use direct link</p>
                                                <a href="https://paypal.me/faithassemblyuk" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[#003087] font-bold hover:underline">
                                                    <FaPaypal /> paypal.me/faithassemblyuk
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {/* SQUARE */}
                                    {activeTab === 'square' && (
                                        <div className="animate-fade-in">
                                            {SQUARE_APP_ID && SQUARE_LOCATION_ID ? (
                                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                                    <PaymentForm
                                                        applicationId={SQUARE_APP_ID}
                                                        locationId={SQUARE_LOCATION_ID}
                                                        cardTokenizeResponseReceived={handleSquarePayment}
                                                    >
                                                        <CreditCard
                                                            buttonProps={{
                                                                css: {
                                                                    backgroundColor: '#333',
                                                                    fontSize: '16px',
                                                                    color: '#fff',
                                                                    '&:hover': { backgroundColor: '#000' }
                                                                }
                                                            }}
                                                        >
                                                            Pay £{currentAmount.toFixed(2)}
                                                        </CreditCard>
                                                    </PaymentForm>
                                                </div>
                                            ) : <div className="text-red-500">Square Config Missing</div>}
                                        </div>
                                    )}

                                    {/* BANK */}
                                    {activeTab === 'bank' && (
                                        <div className="animate-fade-in space-y-4">
                                            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 flex items-start gap-3">
                                                <FaCheckCircle className="text-emerald-500 mt-1 flex-shrink-0" />
                                                <div>
                                                    <h4 className="font-bold text-emerald-800">Direct Transfer</h4>
                                                    <p className="text-emerald-700 text-sm">Use these details to set up a standing order or one-off payment from your banking app.</p>
                                                </div>
                                            </div>
                                            <div className="space-y-3 bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                                    <span className="text-gray-500">Bank</span>
                                                    <span className="font-bold text-gray-900">HSBC Bank</span>
                                                </div>
                                                <div className="flex flex-col border-b border-gray-50 pb-2">
                                                    <span className="text-gray-500 text-xs mb-1">Account Name</span>
                                                    <span className="font-bold text-gray-900 text-right">The Redeemed Christian Church of God Faith Assembly</span>
                                                </div>
                                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                                    <span className="text-gray-500">Sort Code</span>
                                                    <span className="font-mono font-bold text-gray-900 text-lg">40-45-08</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Account No</span>
                                                    <span className="font-mono font-bold text-gray-900 text-lg">62551594</span>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <button onClick={() => { toast.success("Details copied!"); navigator.clipboard.writeText("40-45-08 62551594"); }} className="text-blue-600 text-sm font-bold hover:underline">
                                                    Copy Account Details
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Security Footer */}
                        <div className="mt-8 text-center text-gray-400 text-sm">
                            <p>Faith Assembly is a registered charity. Charity No: 123456</p>
                            <p className="mt-2 text-xs">If you are a UK taxpayer, please consider Gift Aid to boost your donation by 25%.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Give;
