import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, getDocs, orderBy, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { HiPlus, HiPencil, HiTrash, HiSave, HiCalendar, HiLocationMarker, HiClock } from 'react-icons/hi';
import type { EstherEvent } from '../../types/esther';

const EstherEventManager: React.FC = () => {
    const [events, setEvents] = useState<EstherEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEvent, setCurrentEvent] = useState<EstherEvent>({
        title: '',
        date: new Date().toISOString().split('T')[0],
        time: '',
        location: 'Church Hall',
        image: '',
        spots: 50
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'esther_events'), orderBy('date', 'asc'));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EstherEvent));
            setEvents(data);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await deleteDoc(doc(db, 'esther_events', id));
                setEvents(prev => prev.filter(e => e.id !== id));
            } catch (error) {
                console.error("Error deleting event:", error);
            }
        }
    };

    const handleEdit = (event: EstherEvent) => {
        setCurrentEvent(event);
        setIsEditing(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const eventData = {
                ...currentEvent,
                updatedAt: serverTimestamp()
            };

            if (currentEvent.id) {
                await updateDoc(doc(db, 'esther_events', currentEvent.id), eventData);
            } else {
                await addDoc(collection(db, 'esther_events'), {
                    ...eventData,
                    createdAt: serverTimestamp()
                });
            }

            setIsEditing(false);
            setCurrentEvent({
                title: '',
                date: new Date().toISOString().split('T')[0],
                time: '',
                location: 'Church Hall',
                image: '',
                spots: 50
            });
            fetchEvents();
        } catch (error) {
            console.error("Error saving event:", error);
            alert("Failed to save event.");
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-rose-50 flex justify-between items-center bg-rose-50/30">
                <h2 className="text-xl font-bold text-rose-950 flex items-center">
                    Manage Events
                </h2>
                {!isEditing && (
                    <button
                        onClick={() => {
                            setCurrentEvent({
                                title: '',
                                date: new Date().toISOString().split('T')[0],
                                time: '',
                                location: 'Church Hall',
                                image: '',
                                spots: 50
                            });
                            setIsEditing(true);
                        }}
                        className="flex items-center px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors text-sm font-bold shadow-sm"
                    >
                        <HiPlus className="w-4 h-4 mr-2" />
                        New Event
                    </button>
                )}
            </div>

            <div className="p-6">
                {isEditing ? (
                    <form onSubmit={handleSave} className="space-y-6 max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                                <input required value={currentEvent.title} onChange={e => setCurrentEvent({ ...currentEvent, title: e.target.value })} className="w-full p-3 border rounded-xl focus:ring-rose-500 focus:border-rose-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input type="date" required value={currentEvent.date} onChange={e => setCurrentEvent({ ...currentEvent, date: e.target.value })} className="w-full p-3 border rounded-xl focus:ring-rose-500 focus:border-rose-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Time (e.g. 10:00 AM - 12:00 PM)</label>
                                <input required value={currentEvent.time} onChange={e => setCurrentEvent({ ...currentEvent, time: e.target.value })} className="w-full p-3 border rounded-xl focus:ring-rose-500 focus:border-rose-500" placeholder="10:00 AM" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input required value={currentEvent.location} onChange={e => setCurrentEvent({ ...currentEvent, location: e.target.value })} className="w-full p-3 border rounded-xl focus:ring-rose-500 focus:border-rose-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Available Spots</label>
                                <input type="number" required value={currentEvent.spots} onChange={e => setCurrentEvent({ ...currentEvent, spots: parseInt(e.target.value) })} className="w-full p-3 border rounded-xl focus:ring-rose-500 focus:border-rose-500" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input value={currentEvent.image} onChange={e => setCurrentEvent({ ...currentEvent, image: e.target.value })} className="w-full p-3 border rounded-xl focus:ring-rose-500 focus:border-rose-500" placeholder="https://..." />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 rounded-lg text-gray-600 font-bold hover:bg-gray-100">Cancel</button>
                            <button type="submit" className="px-6 py-2 rounded-lg bg-rose-500 text-white font-bold hover:bg-rose-600 shadow-md flex items-center">
                                <HiSave className="mr-2" /> Save Event
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-gray-500 border-b border-gray-100 text-sm">
                                    <th className="py-3 font-semibold">Event</th>
                                    <th className="py-3 font-semibold">Date & Time</th>
                                    <th className="py-3 font-semibold">Location</th>
                                    <th className="py-3 font-semibold">Spots</th>
                                    <th className="py-3 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr><td colSpan={5} className="py-8 text-center text-gray-400">Loading events...</td></tr>
                                ) : events.length === 0 ? (
                                    <tr><td colSpan={5} className="py-12 text-center text-gray-400">No events found. Schedule your first one!</td></tr>
                                ) : (
                                    events.map(event => (
                                        <tr key={event.id} className="hover:bg-rose-50/30 transition-colors group">
                                            <td className="py-4 font-medium text-gray-800">{event.title}</td>
                                            <td className="py-4 text-gray-600 text-sm">
                                                <div className="flex items-center"><HiCalendar className="mr-1 text-rose-400" /> {event.date}</div>
                                                <div className="flex items-center mt-1 text-xs text-gray-400"><HiClock className="mr-1" /> {event.time}</div>
                                            </td>
                                            <td className="py-4 text-gray-600 text-sm flex items-center mt-4">
                                                <HiLocationMarker className="mr-1 text-rose-400" /> {event.location}
                                            </td>
                                            <td className="py-4 text-gray-600">{event.spots}</td>
                                            <td className="py-4 text-right">
                                                <button onClick={() => handleEdit(event)} className="text-gray-400 hover:text-rose-600 mr-3 transition-colors"><HiPencil className="w-5 h-5" /></button>
                                                <button onClick={() => handleDelete(event.id!)} className="text-gray-400 hover:text-red-600 transition-colors"><HiTrash className="w-5 h-5" /></button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EstherEventManager;
