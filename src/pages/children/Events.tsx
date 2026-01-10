import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, getDocs, orderBy, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { FaCalendarAlt, FaPlus, FaTrash, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import type { Event } from '../../types/children';

const EventPlanner: React.FC = () => {
    const [events, setEvents] = useState<(Event & { id: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Event>({
        title: '',
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        location: '',
        description: '',
        assignedGroup: 'All',
        organizer: ''
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const q = query(collection(db, 'children_events'), orderBy('date', 'asc'));
            const snap = await getDocs(q);
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Event & { id: string }));
            setEvents(data);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await addDoc(collection(db, 'children_events'), {
                ...formData,
                createdAt: serverTimestamp()
            });
            alert("Event created successfully!");
            setShowForm(false);
            setFormData({
                title: '',
                date: new Date().toISOString().split('T')[0],
                time: '10:00',
                location: '',
                description: '',
                assignedGroup: 'All',
                organizer: ''
            });
            fetchEvents();
        } catch (error) {
            console.error("Error creating event:", error);
            alert("Failed to create event.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;
        try {
            await deleteDoc(doc(db, 'children_events', id));
            setEvents(events.filter(e => e.id !== id));
        } catch (error) {
            console.error("Error deleting event:", error);
            alert("Failed to delete event.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Event Planner</h1>
                    <p className="text-gray-500">Schedule and manage upcoming children's ministry events.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-sky-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-sky-600 transition flex items-center shadow-md"
                >
                    <FaPlus className="mr-2" /> {showForm ? 'Cancel' : 'New Event'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-2xl shadow-md border border-sky-100 animate-fade-in-down">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <FaCalendarAlt className="mr-2 text-sky-500" /> Plan New Event
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                            <input required name="title" value={formData.title} onChange={handleChange} className="w-full p-3 border rounded-xl" placeholder="e.g. Summer Bible Camp" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input required type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-3 border rounded-xl" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                            <input required type="time" name="time" value={formData.time} onChange={handleChange} className="w-full p-3 border rounded-xl" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <div className="relative">
                                <FaMapMarkerAlt className="absolute left-3 top-3.5 text-gray-400" />
                                <input required name="location" value={formData.location} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border rounded-xl" placeholder="e.g. Main Hall" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Target Group</label>
                            <select name="assignedGroup" value={formData.assignedGroup} onChange={handleChange} className="w-full p-3 border rounded-xl bg-gray-50">
                                <option value="All">All Groups</option>
                                <option value="Creche">Creche (0-4)</option>
                                <option value="Primary">Primary (5-11)</option>
                                <option value="Teens">Teens (12-18)</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Organizer / Contact Person</label>
                            <input required name="organizer" value={formData.organizer} onChange={handleChange} className="w-full p-3 border rounded-xl" placeholder="e.g. Sis. Sarah" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea required name="description" value={formData.description} onChange={handleChange} className="w-full p-3 border rounded-xl h-24" placeholder="Event details and requirements..." />
                        </div>
                        <div className="md:col-span-2 pt-2">
                            <button type="submit" disabled={submitting} className="w-full bg-sky-600 text-white py-3 rounded-xl font-bold hover:bg-sky-700 transition">
                                {submitting ? 'Saving...' : 'Create Event'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Events List */}
            {loading ? (
                <div className="text-center py-12 text-gray-400">Loading events...</div>
            ) : events.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 text-2xl">
                        <FaCalendarAlt />
                    </div>
                    <h3 className="text-lg font-bold text-gray-600">No Events Scheduled</h3>
                    <p className="text-gray-400">Plan a new event to get started.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {events.map((event) => (
                        <div key={event.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col md:flex-row justify-between items-start md:items-center group">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${event.assignedGroup === 'Creche' ? 'bg-pink-100 text-pink-700' :
                                            event.assignedGroup === 'Primary' ? 'bg-orange-100 text-orange-700' :
                                                event.assignedGroup === 'Teens' ? 'bg-purple-100 text-purple-700' : 'bg-sky-100 text-sky-700'
                                        }`}>
                                        {event.assignedGroup}
                                    </span>
                                    <span className="text-gray-400 text-sm flex items-center">
                                        <FaClock className="mr-1 text-xs" /> {event.time}
                                    </span>
                                    <span className="text-gray-400 text-sm flex items-center">
                                        <FaMapMarkerAlt className="mr-1 text-xs" /> {event.location}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                                <p className="text-gray-600 mt-1 max-w-2xl">{event.description}</p>
                                <p className="text-xs text-gray-400 mt-2 font-medium">Organizer: {event.organizer}</p>
                            </div>

                            <div className="flex items-center space-x-6 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                                <div className="text-center px-4 border-l border-gray-100">
                                    <div className="text-xs text-gray-400 font-bold uppercase">Date</div>
                                    <div className="text-lg font-bold text-gray-800">
                                        {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {new Date(event.date).getFullYear()}
                                    </div>
                                </div>
                                <button
                                    onClick={() => event.id && handleDelete(event.id)}
                                    className="text-red-400 hover:text-red-600 p-3 rounded-full hover:bg-red-50 transition opacity-0 group-hover:opacity-100"
                                    title="Delete Event"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventPlanner;
