import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { database } from '../firebase';
import { ref, push } from 'firebase/database';

const Contact: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const contactsRef = ref(database, 'contacts');
            await push(contactsRef, {
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                email: formData.email,
                message: formData.message,
                createdAt: new Date().toISOString()
            });

            alert('Thank you for contacting us! We will get back to you shortly.');
            setFormData({ firstName: '', lastName: '', email: '', message: '' });
        } catch (error) {
            console.error("Error submitting contact form:", error);
            alert("Failed to send message. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-white pt-20">
            {/* Header */}
            <div className="bg-gray-900 text-white py-20 px-4 text-center">
                <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
                <p className="text-xl text-gray-400">We'd love to hear from you. Get in touch with us today.</p>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-16">
                {/* Contact Info */}
                <div>
                    <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
                    <p className="text-gray-600 mb-10 leading-relaxed">
                        Have a question, prayer request, or just want to say hello?
                        Fill out the form or reach out to us using the details below.
                    </p>

                    <div className="space-y-8">
                        <div className="flex items-start">
                            <div className="bg-cyan-100 text-cyan-600 p-4 rounded-full mr-6">
                                <FaMapMarkerAlt className="text-xl" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg mb-1">Our Location</h4>
                                <p className="text-gray-600">Faith Arena, 25 Bakers Road<br />Uxbridge, Greater London</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="bg-cyan-100 text-cyan-600 p-4 rounded-full mr-6">
                                <FaPhone className="text-xl" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg mb-1">Phone</h4>
                                <p className="text-gray-600">01895 548 888</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="bg-cyan-100 text-cyan-600 p-4 rounded-full mr-6">
                                <FaEnvelope className="text-xl" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg mb-1">Email</h4>
                                <p className="text-gray-600">info@faithassembly.org.uk</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-gray-50 p-8 rounded-2xl shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                                    placeholder="John"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                                    placeholder="Doe"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                                placeholder="john@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                            <textarea
                                rows={4}
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                                placeholder="How can we help you?"
                                required
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-black text-white font-bold py-4 rounded-lg hover:bg-gray-800 transition-colors uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Map */}
            <div className="h-96 w-full bg-gray-200">
                <iframe
                    title="Map"
                    className="w-full h-full"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.541443652877!2d-0.4815!3d51.5475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDMyJzUxLjAiTiAwwrAyOCUyOS40Ilc!5e0!3m2!1sen!2suk!4v1600000000000!5m2!1sen!2suk"
                    loading="lazy"
                ></iframe>
            </div>
        </div>
    );
};

export default Contact;
