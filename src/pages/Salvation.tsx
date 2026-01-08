import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaUser, FaEnvelope, FaPhone, FaCheckCircle, FaExclamationCircle, FaPray } from 'react-icons/fa';
import { ref, push } from 'firebase/database';
import { database } from '../firebase';

const decisions = [
    "Accept Jesus",
    "Rededicate My Life",
    "Get Baptised",
    "Join the Church"
];

const contactMethodsOptions = [
    "Phone",
    "Email",
    "WhatsApp",
    "Text Message"
];

const Salvation: React.FC = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        decision: '',
        prayerRequest: '',
        contactMethods: [] as string[]
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleCheckboxChange = (method: string) => {
        setFormData(prev => ({
            ...prev,
            contactMethods: prev.contactMethods.includes(method)
                ? prev.contactMethods.filter(m => m !== method)
                : [...prev.contactMethods, method]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.fullName || !formData.email || !formData.phone || !formData.decision) {
            setErrorMessage('Please fill in check all required fields.');
            setStatus('error');
            return;
        }

        setStatus('submitting');
        setErrorMessage('');

        try {
            const decisionRef = ref(database, 'decisionCards');
            await push(decisionRef, {
                ...formData,
                timestamp: new Date().toISOString()
            });

            setStatus('success');
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                decision: '',
                prayerRequest: '',
                contactMethods: []
            });
        } catch (error: any) {
            console.error("Error submitting decision card:", error);
            setStatus('error');
            setErrorMessage('Failed to submit. Please try again later.');
        }
    };

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen pt-20 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                        <FaHeart className="text-3xl" />
                    </motion.div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">I Have Decided</h1>
                    <p className="text-gray-600 max-w-xl mx-auto text-lg">
                        "If you declare with your mouth, 'Jesus is Lord,' and believe in your heart that God raised him from the dead, you will be saved."
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
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Hallelujah!</h2>
                            <p className="text-gray-600 mb-8">
                                We are rejoicing with you! Someone from our team will reach out to you shortly to support you on this journey.
                            </p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
                            >
                                Submit Another
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">

                            {/* Decision Type */}
                            <div>
                                <label className="block text-gray-700 font-bold mb-2 text-lg">My Decision Today</label>
                                <select
                                    name="decision"
                                    value={formData.decision}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition bg-white"
                                    required
                                >
                                    <option value="" disabled>Select your decision...</option>
                                    {decisions.map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>

                            <hr className="border-gray-100" />

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
                                        placeholder="Your Name"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
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
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
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
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Prayer Request */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2 flex items-center">
                                    <FaPray className="mr-2 text-gray-400" /> Prayer Request (Optional)
                                </label>
                                <textarea
                                    name="prayerRequest"
                                    value={formData.prayerRequest}
                                    onChange={handleChange}
                                    placeholder="How can we pray for you?"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition h-24 resize-none"
                                />
                            </div>

                            {/* Contact Methods */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-3">Best way to contact you?</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {contactMethodsOptions.map(method => (
                                        <label key={method} className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50 transition border border-transparent hover:border-gray-200">
                                            <input
                                                type="checkbox"
                                                checked={formData.contactMethods.includes(method)}
                                                onChange={() => handleCheckboxChange(method)}
                                                className="w-4 h-4 text-red-600 rounded focus:ring-red-500 border-gray-300"
                                            />
                                            <span className="text-gray-700 text-sm">{method}</span>
                                        </label>
                                    ))}
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
                                className={`w-full py-4 rounded-lg font-bold text-white transition transform active:scale-95 ${status === 'submitting'
                                        ? 'bg-red-300 cursor-not-allowed'
                                        : 'bg-red-500 hover:bg-red-600 shadow-md hover:shadow-lg'
                                    }`}
                            >
                                {status === 'submitting' ? 'Submitting...' : 'I Have Decided!'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Salvation;
