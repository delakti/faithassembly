import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPray, FaUser, FaEnvelope, FaPaperPlane, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { ref, push } from 'firebase/database';
import { database } from '../firebase';

const NeedPrayer: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        request: ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.request) {
            setErrorMessage('Please fill in check all required fields.');
            setStatus('error');
            return;
        }

        setStatus('submitting');
        setErrorMessage('');

        try {
            const prayersRef = ref(database, 'PrayerRequests');
            await push(prayersRef, {
                ...formData,
                submittedAt: new Date().toISOString()
            });

            setStatus('success');
            setFormData({
                name: '',
                email: '',
                request: ''
            });
        } catch (error: any) {
            console.error("Error submitting prayer request:", error);
            setStatus('error');
            setErrorMessage('Failed to submit. Please try again later.');
        }
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen pt-20 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                        <FaPray className="text-3xl" />
                    </motion.div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Need Prayer?</h1>
                    <p className="text-gray-600 max-w-xl mx-auto text-lg">
                        "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God." - Philippians 4:6
                    </p>
                </div>

                <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    {status === 'success' ? (
                        <div className="p-12 text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                            >
                                <FaCheckCircle className="text-4xl" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Sent</h2>
                            <p className="text-gray-600 mb-8">
                                We have received your prayer request and our team will be praying for you.
                            </p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                            >
                                Send Another Request
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">

                            {/* Full Name */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <FaUser />
                                    </span>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Your Name"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <FaEnvelope />
                                    </span>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@email.com"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Prayer Request */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Your Prayer Request</label>
                                <textarea
                                    name="request"
                                    value={formData.request}
                                    onChange={handleChange}
                                    placeholder="Share your request here..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition h-32 resize-none"
                                    required
                                />
                            </div>

                            {/* Error Message */}
                            {status === 'error' && (
                                <div className="text-red-600 bg-red-50 p-3 rounded-lg flex items-center text-sm">
                                    <FaExclamationCircle className="mr-2 flex-shrink-0" />
                                    {errorMessage}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className={`w-full py-4 rounded-lg font-bold text-white transition transform active:scale-95 flex items-center justify-center ${status === 'submitting'
                                        ? 'bg-blue-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                                    }`}
                            >
                                {status === 'submitting' ? 'Sending...' : (
                                    <>
                                        Submit Request <FaPaperPlane className="ml-2" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NeedPrayer;
