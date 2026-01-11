
import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaComment, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';

const CustomerSupport = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would connect to a backend
        console.log('Support request:', formData);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Support Center</h1>
                    <p className="mt-4 text-lg text-gray-600">We're here to help. Get in touch with our team.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Contact Information */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>

                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                                        <FaPhone className="text-xl" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                                    <p className="mt-1 text-gray-600">Call us for immediate assistance</p>
                                    <p className="mt-1 text-blue-600 font-semibold">+44 (0) 20 1234 5678</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                                        <FaEnvelope className="text-xl" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">Email</h3>
                                    <p className="mt-1 text-gray-600">Send us a message anytime</p>
                                    <p className="mt-1 text-blue-600 font-semibold">support@faithassembly.org</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                                        <FaMapMarkerAlt className="text-xl" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">Office</h3>
                                    <p className="mt-1 text-gray-600">Visit our main office</p>
                                    <p className="mt-1 text-gray-900">123 Faith Street, London, UK</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 bg-blue-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-blue-900 mb-2">Service Times</h3>
                            <p className="text-blue-800">Available Monday - Friday</p>
                            <p className="text-blue-800 font-medium">9:00 AM - 5:00 PM GMT</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <FaComment className="mr-2 text-blue-600" />
                            Send a Message
                        </h2>

                        {submitted ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-green-50 rounded-lg">
                                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <FaCheckCircle className="text-3xl text-green-600" />
                                </div>
                                <h3 className="text-xl font-medium text-green-900">Message Sent!</h3>
                                <p className="mt-2 text-green-700">Thank you for contacting us. We will get back to you shortly.</p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="mt-6 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                                        Subject
                                    </label>
                                    <select
                                        name="subject"
                                        id="subject"
                                        required
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                    >
                                        <option value="">Select a topic...</option>
                                        <option value="General Inquiry">General Inquiry</option>
                                        <option value="Technical Support">Technical Support</option>
                                        <option value="Prayer Request">Prayer Request</option>
                                        <option value="Donation Issue">Donation Issue</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                        Message
                                    </label>
                                    <textarea
                                        name="message"
                                        id="message"
                                        rows={4}
                                        required
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors items-center"
                                >
                                    <FaPaperPlane className="mr-2" />
                                    Submit Request
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerSupport;
