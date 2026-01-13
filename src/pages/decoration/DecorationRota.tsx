import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, orderBy, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { HiCalendar, HiPlus, HiTrash, HiUser, HiHand, HiCheckCircle, HiX } from 'react-icons/hi';
import { format, parseISO } from 'date-fns';
import { toast } from 'react-hot-toast';

interface RotaEvent {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    volunteers: string[]; // List of UIDs
    volunteerNames?: string[]; // Cached names for display (optional, better to fetch or map)
    status: 'planned' | 'confirmed' | 'completed';
    leadDecorator?: string;
}

const DecorationRota: React.FC = () => {
    const auth = getAuth();
    const db = getFirestore();
    const [events, setEvents] = useState<RotaEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLeader, setIsLeader] = useState(false);
    const [userId, setUserId] = useState<string>('');

    // Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<RotaEvent>>({});

    useEffect(() => {
        if (auth.currentUser) setUserId(auth.currentUser.uid);
        checkRole();
        fetchEvents();
    }, []);

    const checkRole = async () => {
        if (auth.currentUser) {
            const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
            if (userDoc.exists()) {
                const role = userDoc.data().role;
                if (['decor_leader', 'hospitality_leader', 'admin', 'super_admin'].includes(role)) {
                    setIsLeader(true);
                }
            }
        }
    };

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const today = new Date().toISOString().split('T')[0];
            // Fetch all future events (and maybe some past ones if meaningful)
            // Just simple sort for now
            const q = query(collection(db, 'decor_rota'), orderBy('date', 'asc'));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as RotaEvent[];

            // Filter out old events if needed (or keep them for history)
            // For now, keep all
            setEvents(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load rota");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'decor_rota'), {
                ...formData,
                volunteers: [],
                status: 'planned',
                createdAt: serverTimestamp()
            });
            toast.success("Event added to rota");
            setIsModalOpen(false);
            setFormData({}); // Reset
            fetchEvents();
        } catch (error) {
            toast.error("Failed to create event");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this event from the rota?")) return;
        try {
            await deleteDoc(doc(db, 'decor_rota', id));
            setEvents(prev => prev.filter(e => e.id !== id));
            toast.success("Deleted");
        } catch (error) {
            toast.error("Failed to delete");
        }
    };

    const toggleVolunteer = async (event: RotaEvent) => {
        if (!userId) return;
        const isVolunteering = event.volunteers.includes(userId);

        try {
            await updateDoc(doc(db, 'decor_rota', event.id), {
                volunteers: isVolunteering ? arrayRemove(userId) : arrayUnion(userId)
            });

            // Optimistic update
            setEvents(prev => prev.map(e => {
                if (e.id === event.id) {
                    const newVolunteers = isVolunteering
                        ? e.volunteers.filter(id => id !== userId)
                        : [...e.volunteers, userId];
                    return { ...e, volunteers: newVolunteers };
                }
                return e;
            }));

            toast.success(isVolunteering ? "Signed off" : "Signed up!");
        } catch (error) {
            toast.error("Action failed");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold font-serif text-fuchsia-950">Decoration Rota</h1>
                    <p className="text-slate-500">Upcoming events and duty assignments.</p>
                </div>
                {isLeader && (
                    <button
                        onClick={() => {
                            setFormData({ date: '', time: '09:00', title: '', location: 'Main Sanctuary' });
                            setIsModalOpen(true);
                        }}
                        className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-fuchsia-700"
                    >
                        <HiPlus /> Add Date
                    </button>
                )}
            </div>

            {/* Event List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-12 text-slate-400">Loading rota...</div>
                ) : events.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                        <HiCalendar className="w-12 h-12 text-slate-200 mx-auto mb-2" />
                        <p className="text-slate-500">No events scheduled.</p>
                    </div>
                ) : (
                    events.map(event => {
                        const isSignedUp = event.volunteers.includes(userId);
                        return (
                            <div key={event.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 relative group hover:border-fuchsia-200 transition-colors">
                                {/* Date Box */}
                                <div className="hidden md:flex flex-col items-center justify-center w-24 bg-fuchsia-50 rounded-xl p-4 text-center shrink-0">
                                    <span className="text-xs font-bold text-fuchsia-500 uppercase">{event.date && format(parseISO(event.date), 'MMM')}</span>
                                    <span className="text-3xl font-bold text-slate-800">{event.date && format(parseISO(event.date), 'd')}</span>
                                    <span className="text-xs text-slate-400">{event.date && format(parseISO(event.date), 'EEE')}</span>
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-xl text-slate-800">{event.title}</h3>
                                            <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                                                <span>⏰ {event.time}</span>
                                                <span>📍 {event.location}</span>
                                            </div>
                                        </div>
                                        {/* Mobile Date Badge */}
                                        <div className="md:hidden bg-fuchsia-50 px-3 py-1 rounded-lg text-xs font-bold text-fuchsia-600">
                                            {event.date}
                                        </div>
                                    </div>

                                    <p className="text-slate-600 text-sm mb-4">{event.description}</p>

                                    {/* Volunteers */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="flex -space-x-2">
                                            {event.volunteers.length > 0 ? (
                                                event.volunteers.map(id => (
                                                    <div key={id} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs text-slate-500" title="User ID (Names need join)">
                                                        <HiUser className="w-4 h-4" />
                                                    </div>
                                                ))
                                            ) : (
                                                <span className="text-sm text-slate-400 italic">No volunteers yet</span>
                                            )}
                                        </div>
                                        {event.volunteers.length > 0 && <span className="text-xs text-slate-400 font-medium ml-2">{event.volunteers.length} signed up</span>}
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        onClick={() => toggleVolunteer(event)}
                                        className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors ${isSignedUp
                                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                : 'bg-slate-100 text-slate-600 hover:bg-fuchsia-100 hover:text-fuchsia-700'
                                            }`}
                                    >
                                        {isSignedUp ? <><HiCheckCircle /> I'm Volunteering</> : <><HiHand /> Sign Me Up</>}
                                    </button>
                                </div>

                                {/* Leader Controls */}
                                {isLeader && (
                                    <button
                                        onClick={() => handleDelete(event.id)}
                                        className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <HiTrash className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-slate-50 rounded-full">
                            <HiX className="w-6 h-6 text-slate-400" />
                        </button>
                        <h2 className="text-xl font-bold mb-4">Schedule Event</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Event Title</label>
                                <input
                                    className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-fuchsia-500"
                                    required
                                    value={formData.title || ''}
                                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="e.g. Easter Setup"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Date</label>
                                    <input
                                        type="date"
                                        className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-fuchsia-500"
                                        required
                                        value={formData.date || ''}
                                        onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Time</label>
                                    <input
                                        type="time"
                                        className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-fuchsia-500"
                                        required
                                        value={formData.time || ''}
                                        onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Location</label>
                                <input
                                    className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-fuchsia-500"
                                    value={formData.location || ''}
                                    onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                    placeholder="Room / Hall"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Notes/Instructions</label>
                                <textarea
                                    className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-fuchsia-500 h-24"
                                    value={formData.description || ''}
                                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Details for the team..."
                                />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-bold text-slate-500 hover:bg-slate-50 rounded-lg">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-fuchsia-600 text-white font-bold rounded-lg hover:bg-fuchsia-700">Add to Rota</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DecorationRota;
