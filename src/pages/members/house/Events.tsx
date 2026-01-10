import React, { useState, useEffect } from 'react';
import { useHouseFellowship } from '../../../layouts/HouseLayout';
import { db } from '../../../firebase';
import { collection, addDoc, getDocs, query, orderBy, Timestamp, deleteDoc, doc } from 'firebase/firestore';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaPlus, FaTrash } from 'react-icons/fa';

interface HouseEvent {
    id: string;
    title: string;
    date: string;
    time: string;
    venue: string;
    description: string;
}

const HouseEvents: React.FC = () => {
    const { fellowship } = useHouseFellowship();
    const [events, setEvents] = useState<HouseEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [venue, setVenue] = useState('');
    const [description, setDescription] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, [fellowship]);

    const fetchEvents = async () => {
        if (!fellowship?.name) return;
        setLoading(true);
        try {
            const q = query(collection(db, 'fellowships', fellowship.name, 'events'), orderBy('date'));
            const snapshot = await getDocs(q);
            const eventList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as HouseEvent));
            setEvents(eventList);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fellowship?.name) return;
        setSaving(true);
        try {
            await addDoc(collection(db, 'fellowships', fellowship.name, 'events'), {
                title,
                date,
                time,
                venue,
                description,
                timestamp: Timestamp.now()
            });
            setShowForm(false);
            resetForm();
            fetchEvents();
        } catch (error) {
            console.error("Error saving event:", error);
            alert("Failed to save event");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!fellowship?.name || !window.confirm("Are you sure you want to delete this event?")) return;
        try {
            await deleteDoc(doc(db, 'fellowships', fellowship.name, 'events', id));
            setEvents(prev => prev.filter(e => e.id !== id));
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    const resetForm = () => {
        setTitle('');
        setDate('');
        setTime('');
        setVenue('');
        setDescription('');
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading events...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <FaCalendarAlt className="mr-3 text-purple-600" />
                    Fellowship Events
                </h2>
                {fellowship?.isLeader && (
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-bold hover:bg-purple-700 transition shadow-sm"
                    >
                        <FaPlus className="mr-2" /> {showForm ? 'Cancel' : 'Add Event'}
                    </button>
                )}
            </div>

            {showForm && fellowship?.isLeader && (
                <div className="bg-white rounded-xl shadow-md border border-purple-100 p-6 mb-8 animate-in fade-in slide-in-from-top-4">
                    <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Create New Event</h3>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Event Title</label>
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full border rounded-md p-2 focus:ring-2 focus:ring-purple-500 outline-none" placeholder="e.g. Monthly Picnic" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Date</label>
                                <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full border rounded-md p-2 focus:ring-2 focus:ring-purple-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Time</label>
                                <input type="time" value={time} onChange={e => setTime(e.target.value)} required className="w-full border rounded-md p-2 focus:ring-2 focus:ring-purple-500 outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Venue</label>
                            <input type="text" value={venue} onChange={e => setVenue(e.target.value)} required className="w-full border rounded-md p-2 focus:ring-2 focus:ring-purple-500 outline-none" placeholder="e.g. 123 Church St" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Description</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full border rounded-md p-2 focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Details about the event..."></textarea>
                        </div>
                        <div className="flex justify-end pt-2">
                            <button type="submit" disabled={saving} className="px-6 py-2 bg-purple-600 text-white rounded-md font-bold hover:bg-purple-700 transition disabled:opacity-50">
                                {saving ? 'Saving...' : 'Create Event'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {events.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaCalendarAlt className="text-3xl" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">No Upcoming Events</h3>
                    <p className="text-gray-500 mt-2">Check back later for updates on fellowship activities.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {events.map(event => (
                        <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row md:items-center hover:shadow-md transition">
                            <div className="flex-shrink-0 w-16 h-16 bg-purple-100 rounded-lg flex flex-col items-center justify-center text-purple-800 font-bold mb-4 md:mb-0 md:mr-6">
                                <span className="text-xs uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                <span className="text-2xl">{new Date(event.date).getDate()}</span>
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                                <div className="flex flex-wrap text-sm text-gray-500 mt-1 space-x-4">
                                    <span className="flex items-center"><FaClock className="mr-1" /> {event.time}</span>
                                    <span className="flex items-center"><FaMapMarkerAlt className="mr-1" /> {event.venue}</span>
                                </div>
                                {event.description && <p className="text-gray-600 mt-2">{event.description}</p>}
                            </div>
                            {fellowship?.isLeader && (
                                <div className="ml-auto pl-4 mt-4 md:mt-0">
                                    <button
                                        onClick={() => handleDelete(event.id)}
                                        className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition"
                                        title="Delete Event"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HouseEvents;
