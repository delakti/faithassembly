import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { database } from '../firebase';
import { ref, onValue, push } from 'firebase/database';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaArrowLeft, FaShare, FaTimes } from 'react-icons/fa';

interface EventData {
    date: string;
    description: string;
    endDate: string;
    endTime: string;
    id: string;
    image: string;
    location: string;
    startDate: string;
    startTime: string;
    text: string;
    time: string;
    title: string;
}

const EventDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [event, setEvent] = useState<EventData | null>(null);
    const [loading, setLoading] = useState(true);

    // Registration Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!id) return;

        const eventRef = ref(database, `Event/${id}`);
        const unsubscribe = onValue(eventRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setEvent({ ...data, id });
            } else {
                setEvent(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [id]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        setSubmitting(true);
        try {
            const registrationRef = ref(database, `event_registrations/${id}`);
            await push(registrationRef, {
                ...formData,
                registeredAt: new Date().toISOString(),
                userId: "guest" // Placeholder as we don't have auth yet
            });
            setSuccess(true);
            setFormData({ name: '', email: '', phone: '' });
        } catch (error) {
            console.error("Error registering:", error);
            alert("Failed to register. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Date TBA';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;

        return date.toLocaleDateString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen pt-32 px-4 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h2>
                <Link to="/events" className="text-cyan-600 font-semibold hover:underline">
                    Back to Events
                </Link>
            </div>
        );
    }

    const effectiveDate = event.date || event.startDate;

    return (
        <div className="min-h-screen bg-white relative">
            {/* Hero Section */}
            <div className="relative h-[50vh] min-h-[400px]">
                <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 max-w-7xl mx-auto text-white">
                    <Link to="/events" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
                        <FaArrowLeft /> Back to Events
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">{event.title}</h1>
                    <div className="flex flex-wrap items-center gap-4 md:gap-8 text-lg font-medium">
                        <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-cyan-400" />
                            {formatDate(effectiveDate)}
                        </div>
                        <div className="flex items-center gap-2">
                            <FaClock className="text-cyan-400" />
                            {event.startTime} - {event.endTime}
                        </div>
                        <div className="flex items-center gap-2">
                            <FaMapMarkerAlt className="text-cyan-400" />
                            {event.location}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="bg-white rounded-3xl -mt-24 relative z-10 p-8 md:p-12 shadow-xl border border-gray-100">
                    <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                        {event.description}
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-100 flex gap-4">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex-1 bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg"
                        >
                            Register / Join
                        </button>
                        <button className="px-6 py-4 rounded-xl border-2 border-gray-200 hover:border-cyan-500 hover:text-cyan-600 transition-colors">
                            <FaShare className="text-xl" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Registration Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md p-8 relative shadow-2xl animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => {
                                setIsModalOpen(false);
                                setSuccess(false);
                            }}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2"
                        >
                            <FaTimes className="text-xl" />
                        </button>

                        {success ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h3>
                                <p className="text-gray-600 mb-6">You have been registered for {event.title}. We look forward to seeing you there!</p>
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setSuccess(false);
                                    }}
                                    className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800"
                                >
                                    Close
                                </button>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Register for Event</h3>
                                <form onSubmit={handleRegister} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            required
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                                            placeholder="+44 7123 456789"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-cyan-600 text-white py-4 rounded-lg font-bold hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                                    >
                                        {submitting ? 'Registering...' : 'Confirm Registration'}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventDetail;