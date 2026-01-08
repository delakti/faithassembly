import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PaymentForm, CreditCard } from 'react-square-web-payments-sdk';
import { FaLock, FaExclamationCircle, FaShoppingBag } from 'react-icons/fa';
import { useStore } from '../../context/StoreContext';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Checkout: React.FC = () => {
    const { cart, cartTotal, clearCart } = useStore();
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        postcode: '',
    });

    // Status State
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const appId = import.meta.env.VITE_SQUARE_APP_ID;
    const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID;

    // Redirect if cart is empty
    React.useEffect(() => {
        if (cart.length === 0) {
            navigate('/store');
        }
    }, [cart, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.address || !formData.city || !formData.postcode) {
            setErrorMessage('Please fill in all shipping fields.');
            return false;
        }
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            setErrorMessage('Please enter a valid email address.');
            return false;
        }
        return true;
    };

    const handlePayment = async (token: any) => {
        setIsProcessing(true);
        setErrorMessage('');

        if (!validateForm()) {
            setIsProcessing(false);
            return;
        }

        try {
            // 1. Process Payment via generic API
            const amountInCents = Math.round(cartTotal * 100);

            const response = await fetch('/api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sourceId: token.token,
                    amount: amountInCents,
                }),
            });

            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                throw new Error(`Server returned ${response.status}: ${text}`);
            }

            if (!response.ok) {
                throw new Error(data.message || 'Payment failed');
            }

            // 2. Create Order in Firestore
            await addDoc(collection(db, 'orders'), {
                customer: formData,
                items: cart,
                total: cartTotal,
                paymentId: data.payment.id, // Assuming Square returns payment object
                status: 'paid',
                createdAt: serverTimestamp(),
            });

            // 3. Success
            clearCart();
            navigate('/store/success');

        } catch (error: any) {
            console.error('Checkout Error:', error);
            setErrorMessage(error.message || 'An unexpected error occurred during checkout.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (cart.length === 0) return null; // Handled by useEffect redirect

    if (!appId || !locationId) {
        return (
            <div className="min-h-screen pt-24 px-4 text-center">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 max-w-2xl mx-auto rounded">
                    <p className="text-yellow-700">Square configuration missing (App ID / Location ID).</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Left Column: Shipping & Payment */}
                    <div className="space-y-8">

                        {/* Shipping Form */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                <span className="bg-purple-100 text-purple-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
                                Shipping Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none md:col-span-2"
                                />
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="Address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none md:col-span-2"
                                />
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                                <input
                                    type="text"
                                    name="postcode"
                                    placeholder="Postcode"
                                    value={formData.postcode}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Payment Section */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                <span className="bg-purple-100 text-purple-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
                                Payment Details
                            </h2>

                            <div className="mb-4">
                                <PaymentForm
                                    applicationId={appId}
                                    locationId={locationId}
                                    cardTokenizeResponseReceived={handlePayment}
                                >
                                    <CreditCard
                                        buttonProps={{
                                            css: {
                                                backgroundColor: '#9333ea', // purple-600
                                                fontSize: '16px',
                                                color: '#fff',
                                                '&:hover': {
                                                    backgroundColor: '#7e22ce', // purple-700
                                                },
                                            }
                                        }}
                                    >
                                        {isProcessing ? 'Processing...' : `Pay £${cartTotal.toFixed(2)}`}
                                    </CreditCard>
                                </PaymentForm>
                            </div>

                            {errorMessage && (
                                <div className="mt-4 text-red-600 bg-red-50 p-3 rounded-lg flex items-center text-sm">
                                    <FaExclamationCircle className="mr-2 flex-shrink-0" />
                                    {errorMessage}
                                </div>
                            )}

                            <div className="flex items-center justify-center text-xs text-gray-400 mt-4">
                                <FaLock className="mr-1" />
                                Secure payment processing powered by Square
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-bold mb-6 flex items-center">
                                <FaShoppingBag className="mr-2 text-purple-600" /> Order Summary
                            </h2>

                            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                {cart.map((item) => (
                                    <div key={`${item.product.id}-${item.selectedVariant}`} className="flex space-x-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.product.images[0]}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900 line-clamp-1">{item.product.name}</h3>
                                            <p className="text-sm text-gray-500">
                                                Qty: {item.quantity} {item.selectedVariant && `• Size: ${item.selectedVariant}`}
                                            </p>
                                        </div>
                                        <div className="font-semibold text-gray-900">
                                            £{(item.product.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 mt-6 pt-4 space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>£{cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-100 mt-2">
                                    <span>Total</span>
                                    <span>£{cartTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Checkout;
