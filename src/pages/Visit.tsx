
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaPray, FaInfoCircle, FaCheckCircle, FaPaperPlane, FaCalendar, FaHeart, FaUsers } from 'react-icons/fa';
import { database } from '../firebase';
import { ref, push, set } from 'firebase/database';
import toast from 'react-hot-toast';

const Visit: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        visitType: 'First Time Guest',
        message: '',
        contactPreference: 'Email',
        // New Fields
        gender: '',
        maritalStatus: '',
        nextBirthday: '',
        ministryInterest: '',
        referralSource: '',
        consentToContact: false
    });

    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const newcomersRef = ref(database, 'Newcomers');
            const newNewcomerRef = push(newcomersRef);

            const payload = {
                firstname: formData.firstName,
                lastname: formData.lastName,
                email: formData.email,
                emailAddress: formData.email, // Redundant but matches schema
                phoneNumber: formData.phone,
                contactAddress: formData.address,
                lookingForPlaceToWorship: formData.visitType === 'Looking for a Church Home',
                gender: formData.gender,
                maritalStatus: formData.maritalStatus,
                ministryInterest: formData.ministryInterest,
                nextBirthday: formData.nextBirthday,
                nextSteps: 'New',
                prayerPoints: formData.message,
                referralSource: formData.referralSource,
                consentToContact: formData.consentToContact,
                timestamp: new Date().toISOString(),
                // Extra fields from form that map generally
                visitType: formData.visitType,
                contactPreference: formData.contactPreference
            };

            await set(newNewcomerRef, payload);

            setSubmitted(true);
            toast.success('Information submitted successfully!');
            window.scrollTo(0, 0);
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaCheckCircle className="text-4xl text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">You're Connected!</h2>
                    <p className="text-gray-600 mb-8">
                        Thank you for filling out our visitor form. We are so excited to connect with you. A member of our team will be in touch shortly!
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="bg-cyan-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-cyan-700 transition w-full"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <div className="relative py-24 bg-blue-900 text-white text-center overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80')] bg-cover bg-center" />
                <div className="absolute inset-0 bg-blue-900/80" />
                <div className="relative z-10 px-4 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Visitor Connect Card</h1>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            We'd love to get to know you better. Whether you're a first-time guest or have been visiting for a while, please take a moment to fill out this form.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Form Section */}
            <div className="max-w-3xl mx-auto px-4 py-16 -mt-10 relative z-20">
                <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-10 border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Personal Details */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center border-b pb-2">
                                <FaUser className="text-cyan-600 mr-3" />
                                Personal Information
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-cyan-500 focus:bg-white transition outline-none"
                                        placeholder="John"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-cyan-500 focus:bg-white transition outline-none"
                                        placeholder="Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-cyan-500 focus:bg-white transition outline-none"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
                                    <select
                                        name="maritalStatus"
                                        value={formData.maritalStatus}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-cyan-500 focus:bg-white transition outline-none"
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Widowed">Widowed</option>
                                        <option value="Divorced">Divorced</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Next Birthday</label>
                                    <div className="relative">
                                        <FaCalendar className="absolute left-4 top-3.5 text-gray-400" />
                                        <input
                                            type="date"
                                            name="nextBirthday"
                                            value={formData.nextBirthday}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-cyan-500 focus:bg-white transition outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center border-b pb-2">
                                <FaEnvelope className="text-cyan-600 mr-3" />
                                Contact Details
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-cyan-500 focus:bg-white transition outline-none"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-cyan-500 focus:bg-white transition outline-none"
                                        placeholder="+44 7700 900000"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Address (Optional)</label>
                                    <div className="relative">
                                        <FaMapMarkerAlt className="absolute left-4 top-3.5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-cyan-500 focus:bg-white transition outline-none"
                                            placeholder="Your street address"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Visit Info */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center border-b pb-2">
                                <FaInfoCircle className="text-cyan-600 mr-3" />
                                About Your Visit
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
                                    <select
                                        name="visitType"
                                        value={formData.visitType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-cyan-500 focus:bg-white transition outline-none appearance-none"
                                    >
                                        <option value="First Time Guest">First Time Guest</option>
                                        <option value="Second Time Guest">Second Time Guest</option>
                                        <option value="Regular Attendee">Regular Attendee</option>
                                        <option value="Looking for a Church Home">Looking for a Church Home</option>
                                        <option value="Visiting from out of town">Visiting from out of town</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">How would you like us to contact you?</label>
                                    <div className="flex space-x-6">
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="contactPreference"
                                                value="Email"
                                                checked={formData.contactPreference === 'Email'}
                                                onChange={handleChange}
                                                className="text-cyan-600 focus:ring-cyan-500 h-4 w-4"
                                            />
                                            <span className="text-gray-700">Email</span>
                                        </label>
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="contactPreference"
                                                value="Phone"
                                                checked={formData.contactPreference === 'Phone'}
                                                onChange={handleChange}
                                                className="text-cyan-600 focus:ring-cyan-500 h-4 w-4"
                                            />
                                            <span className="text-gray-700">Phone Call</span>
                                        </label>
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="contactPreference"
                                                value="Text"
                                                checked={formData.contactPreference === 'Text'}
                                                onChange={handleChange}
                                                className="text-cyan-600 focus:ring-cyan-500 h-4 w-4"
                                            />
                                            <span className="text-gray-700">Text Message</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Interests */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center border-b pb-2">
                                <FaHeart className="text-cyan-600 mr-3" />
                                Interests
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Ministry Interest</label>
                                    <select
                                        name="ministryInterest"
                                        value={formData.ministryInterest}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-cyan-500 focus:bg-white transition outline-none"
                                    >
                                        <option value="">Select Ministry Interest</option>
                                        <option value="Choir/Worship">Choir/Worship</option>
                                        <option value="Ushering">Ushering</option>
                                        <option value="Media/Tech">Media/Tech</option>
                                        <option value="Children">Children</option>
                                        <option value="Youth">Youth</option>
                                        <option value="Evangelism">Evangelism</option>
                                        <option value="Prayer">Prayer</option>
                                        <option value="None">None / Not Sure</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">How did you hear about us?</label>
                                    <div className="relative">
                                        <FaUsers className="absolute left-4 top-3.5 text-gray-400" />
                                        <select
                                            name="referralSource"
                                            value={formData.referralSource}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-cyan-500 focus:bg-white transition outline-none appearance-none"
                                        >
                                            <option value="">Select Source</option>
                                            <option value="Friend/Family">Friend/Family</option>
                                            <option value="Social Media">Social Media</option>
                                            <option value="Website">Website</option>
                                            <option value="Flyer/Poster">Flyer/Poster</option>
                                            <option value="Drive/Walk by">Drive/Walk by</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Prayer/Comments */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center border-b pb-2">
                                <FaPray className="text-cyan-600 mr-3" />
                                Prayer Requests & Comments
                            </h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">How can we pray for you? / Any comments?</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-cyan-500 focus:bg-white transition outline-none resize-none"
                                    placeholder="Share your prayer requests or thoughts here..."
                                />
                            </div>
                        </div>

                        {/* Consent */}
                        <div className="flex items-start">
                            <div className="flex bg-blue-50 p-4 rounded-lg w-full">
                                <div className="flex items-center h-5">
                                    <input
                                        id="consentToContact"
                                        name="consentToContact"
                                        type="checkbox"
                                        checked={formData.consentToContact}
                                        onChange={handleChange}
                                        className="focus:ring-cyan-500 h-4 w-4 text-cyan-600 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="consentToContact" className="font-medium text-blue-900">Consent to Contact</label>
                                    <p className="text-blue-700">I agree that Faith Assembly may contact me using the information I have provided.</p>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full text-white font-bold py-4 rounded-xl transition shadow-lg flex items-center justify-center text-lg ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-700 shadow-cyan-600/30'}`}
                            >
                                <FaPaperPlane className="mr-3" />
                                {isSubmitting ? 'Submitting...' : 'Submit Form'}
                            </motion.button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Visit;
