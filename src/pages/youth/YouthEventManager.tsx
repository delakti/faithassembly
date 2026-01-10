import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase'; // Correct path to firebase.ts
import type { YouthEvent } from '../../types/youth'; // Type-only import
import { toast } from 'react-hot-toast';
import { HiPlus, HiPencil, HiTrash, HiCalendar, HiLocationMarker } from 'react-icons/hi';

const YouthEventManager: React.FC = () => {
    const [events, setEvents] = useState<YouthEvent[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEvent, setCurrentEvent] = useState<Partial<YouthEvent>>({});
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const q = query(collection(db, 'youth_events'), orderBy('date', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const eventsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as YouthEvent[];
            setEvents(eventsData);
        });

        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && currentEvent.id) {
                const eventRef = doc(db, 'youth_events', currentEvent.id);
                const { id, ...data } = currentEvent;
                await updateDoc(eventRef, data);
                toast.success('Event updated!');
            } else {
                await addDoc(collection(db, 'youth_events'), {
                    ...currentEvent,
                    createdAt: serverTimestamp()
                });
                toast.success('Event created!');
            }
            setShowForm(false);
            setIsEditing(false);
            setCurrentEvent({});
        } catch (error) {
            console.error('Error saving event:', error);
            toast.error('Failed to save event');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;
        try {
            await deleteDoc(doc(db, 'youth_events', id));
            toast.success('Event deleted');
        } catch (error) {
            console.error('Error deleting event:', error);
            toast.error('Failed to delete event');
        }
    };

    const openEdit = (event: YouthEvent) => {
        setCurrentEvent(event);
        setIsEditing(true);
        setShowForm(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-white italic uppercase">Manage Events</h2>
                <button
                    onClick={() => { setShowForm(!showForm); setIsEditing(false); setCurrentEvent({}); }}
                    className="bg-yellow-400 text-black px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-yellow-300 transition-colors"
                >
                    <HiPlus className="w-5 h-5" />
                    {showForm ? 'Cancel' : 'Add Event'}
                </button>
            </div>

            {showForm && (
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl animate-in fade-in slide-in-from-top-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-2">Event Title</label>
                            <input
                                type="text"
                                required
                                value={currentEvent.title || ''}
                                onChange={e => setCurrentEvent({ ...currentEvent, title: e.target.value })}
                                className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-yellow-400 focus:outline-none"
                                placeholder="e.g. Friday Night Live"
                            />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-400 text-sm font-bold mb-2">Date & Time</label>
                                <input
                                    type="text"
                                    required
                                    value={currentEvent.date || ''}
                                    onChange={e => setCurrentEvent({ ...currentEvent, date: e.target.value })}
                                    className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-yellow-400 focus:outline-none"
                                    placeholder="e.g. Friday, Oct 27 @ 7:00 PM"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm font-bold mb-2">Location</label>
                                <input
                                    type="text"
                                    required
                                    value={currentEvent.location || ''}
                                    onChange={e => setCurrentEvent({ ...currentEvent, location: e.target.value })}
                                    className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-yellow-400 focus:outline-none"
                                    placeholder="e.g. Main Auditorium"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-2">Description</label>
                            <textarea
                                required
                                value={currentEvent.desc || ''}
                                onChange={e => setCurrentEvent({ ...currentEvent, desc: e.target.value })}
                                className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-yellow-400 focus:outline-none h-24"
                                placeholder="Event details..."
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-2">Image URL</label>
                            <input
                                type="url"
                                required
                                value={currentEvent.image || ''}
                                onChange={e => setCurrentEvent({ ...currentEvent, image: e.target.value })}
                                className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-yellow-400 focus:outline-none"
                                placeholder="https://..."
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-2">Registration Link (Optional)</label>
                            <input
                                type="url"
                                value={currentEvent.registrationLink || ''}
                                onChange={e => setCurrentEvent({ ...currentEvent, registrationLink: e.target.value })}
                                className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-yellow-400 focus:outline-none"
                                placeholder="https://..."
                            />
                        </div>
                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                className="bg-green-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-600 transition-colors"
                            >
                                {isEditing ? 'Update Event' : 'Create Event'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid gap-4">
                {events.map((event) => (
                    <div key={event.id} className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-start md:items-center group hover:border-gray-700 transition-all">
                        <img src={event.image} alt={event.title} className="w-full md:w-24 h-24 object-cover rounded-lg bg-gray-800" />
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-white">{event.title}</h3>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-400 mt-1">
                                <span className="flex items-center gap-1"><HiCalendar className="w-4 h-4" /> {event.date}</span>
                                <span className="flex items-center gap-1"><HiLocationMarker className="w-4 h-4" /> {event.location}</span>
                            </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button
                                onClick={() => openEdit(event)}
                                className="flex-1 md:flex-none bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <HiPencil className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleDelete(event.id)}
                                className="flex-1 md:flex-none bg-red-900/20 text-red-500 p-2 rounded-lg hover:bg-red-900/40 transition-colors"
                            >
                                <HiTrash className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default YouthEventManager;
