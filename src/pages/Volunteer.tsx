import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaHandsHelping, FaCheckCircle, FaExclamationCircle, FaUser, FaEnvelope, FaPhone, FaChurch } from 'react-icons/fa';
import { ref, push } from 'firebase/database';
import { database } from '../firebase';

const ministries = [
    "Hospitality",
    "Worship",
    "Media",
    "Kids",
    "Youth",
    "Prayer",
    "Maintenance",
    "Outreach",
    "Other"
];

const Volunteer: React.FC = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        ministry: ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.fullName || !formData.email || !formData.phone || !formData.ministry) {
            setErrorMessage('Please fill in all fields.');
            setStatus('error');
            return;
        }

        setStatus('submitting');
        setErrorMessage('');

        try {
            const applicationsRef = ref(database, 'volunteerApplications');
            await push(applicationsRef, {
                ...formData,
                status: "pending_background_check",
                timestamp: new Date().toISOString(),
                userId: "guest"
            });

            setStatus('success');
            setFormData({ fullName: '', email: '', phone: '', ministry: '' });
        } catch (error: any) {
            console.error("Error submitting volunteer application:", error);
            setStatus('error');
            setErrorMessage('Failed to submit application. Please try again later.');
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pt-20 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                        <FaHandsHelping className="text-3xl" />
                    </motion.div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Volunteer With Us</h1>
                    <p className="text-gray-500 max-w-xl mx-auto">
                        Join one of our teams and use your gifts to serve the church and our community.
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
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Received!</h2>
                            <p className="text-gray-600 mb-8">
                                Thank you for signing up to serve. A team leader will be in touch with you shortly.
                            </p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
                            >
                                Sign Up Another
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
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
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
                                        placeholder="john@example.com"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <FaPhone />
                                    </span>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="07123 456789"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Ministry Dropdown */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Select Ministry</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <FaChurch />
                                    </span>
                                    <select
                                        name="ministry"
                                        value={formData.ministry}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition bg-white"
                                        required
                                    >
                                        <option value="" disabled>Choose a ministry...</option>
                                        {ministries.map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                </div>
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
                                className={`w-full py-3 rounded-lg font-bold text-white transition transform active:scale-95 ${status === 'submitting'
                                        ? 'bg-purple-400 cursor-not-allowed'
                                        : 'bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg'
                                    }`}
                            >
                                {status === 'submitting' ? 'Submitting...' : 'Send Application'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Volunteer;
