import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { FaCalendarAlt, FaUserTie, FaCheckCircle } from 'react-icons/fa';

const Appointments: React.FC = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        pastor: 'Pastor Adeyemi Solomon Adelakun',
        date: '',
        timeSlot: '',
        reason: '',
        notes: ''
    });

    // Mock slots - in a real app, fetch available slots from DB
    const timeSlots = [
        '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addDoc(collection(db, 'appointments'), {
                userId: user?.uid,
                userName: user?.displayName,
                email: user?.email,
                ...formData,
                status: 'pending',
                createdAt: serverTimestamp()
            });
            setSuccess(true);
        } catch (error) {
            console.error("Error booking appointment:", error);
            alert("Failed to book appointment.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg text-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                    <FaCheckCircle />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted</h2>
                <p className="text-gray-600 mb-6">
                    Your appointment request with {formData.pastor} has been received.
                    You will receive a confirmation email once the time is approved.
                </p>
                <button
                    onClick={() => { setSuccess(false); setFormData({ ...formData, date: '', reason: '', notes: '', timeSlot: '' }); }}
                    className="text-blue-600 font-medium hover:underline"
                >
                    Book another appointment
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 text-white">
                <div className="flex items-center mb-4">
                    <FaUserTie className="text-3xl mr-4" />
                    <div>
                        <h1 className="text-2xl font-bold">Pastoral Appointment</h1>
                        <p className="text-blue-100">Schedule a time to speak with our pastoral team.</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Pastor</label>
                    <select
                        className="w-full p-3 border rounded-lg bg-gray-50"
                        value={formData.pastor}
                        onChange={e => setFormData({ ...formData, pastor: e.target.value })}
                    >
                        <option>Pastor Adeyemi Solomon Adelakun</option>
                        <option>Pastor Ola</option>
                        {/* Add more pastors if needed */}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                            required
                            type="date"
                            className="w-full p-3 border rounded-lg"
                            min={new Date().toISOString().split('T')[0]}
                            value={formData.date}
                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
                        <select
                            required
                            className="w-full p-3 border rounded-lg"
                            value={formData.timeSlot}
                            onChange={e => setFormData({ ...formData, timeSlot: e.target.value })}
                        >
                            <option value="">Select a time</option>
                            {timeSlots.map(slot => (
                                <option key={slot} value={slot}>{slot}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
                    <select
                        required
                        className="w-full p-3 border rounded-lg"
                        value={formData.reason}
                        onChange={e => setFormData({ ...formData, reason: e.target.value })}
                    >
                        <option value="">Select a reason</option>
                        <option value="Counselling">Counselling</option>
                        <option value="Prayer">Prayer</option>
                        <option value="Testimony">Testimony Sharing</option>
                        <option value="Membership">Membership Inquiry</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                    <textarea
                        className="w-full p-3 border rounded-lg h-32"
                        placeholder="Please provide any details that will help us prepare..."
                        value={formData.notes}
                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg flex items-center justify-center"
                >
                    {loading ? 'Submitting...' : (
                        <>
                            <FaCalendarAlt className="mr-2" /> Book Appointment
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default Appointments;
