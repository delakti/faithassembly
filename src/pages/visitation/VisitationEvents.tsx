import React, { useState, useEffect } from 'react';
import {
    getFirestore,
    collection,
    query,
    onSnapshot,
    addDoc,
    orderBy,
    serverTimestamp,
    doc,
    getDoc,
    updateDoc,
    arrayUnion,
    arrayRemove
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import {
    HiOutlineCalendar,
    HiPlus,
    HiLocationMarker,
    HiClock,
    HiOutlineUserGroup,
    HiCheckCircle
} from 'react-icons/hi';
import toast, { Toaster } from 'react-hot-toast';

interface VisitationEvent {
    id: string;
    title: string;
    date: string; // ISO date string or timestamp
    time: string;
    location: string;
    description: string;
    attendees: string[]; // List of user IDs
    createdAt: any;
}

const VisitationEvents: React.FC = () => {
    const [events, setEvents] = useState<VisitationEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLeader, setIsLeader] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    // Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        date: '',
        time: '',
        location: '',
        description: ''
    });

    const db = getFirestore();
    const auth = getAuth();

    // Check User Role & Auth
    useEffect(() => {
        const checkRole = async () => {
            const user = auth.currentUser;
            if (user) {
                setCurrentUserId(user.uid);
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        // Allow creation if admin or visitation_leader
                        if (['visitation_leader', 'admin', 'super_admin'].includes(userData.role)) {
                            setIsLeader(true);
                        }
                    }
                } catch (error) {
                    console.error("Error checking role:", error);
                }
            }
        };
        checkRole();
    }, [auth, db]);

    // Fetch Events
    useEffect(() => {
        const q = query(
            collection(db, 'visitation_events'),
            orderBy('date', 'asc') // Upcoming events first
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const eventsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as VisitationEvent[];
            setEvents(eventsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [db]);

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await addDoc(collection(db, 'visitation_events'), {
                ...newEvent,
                attendees: [],
                createdAt: serverTimestamp()
            });
            toast.success('Event created successfully!');
            setIsCreateModalOpen(false);
            setNewEvent({ title: '', date: '', time: '', location: '', description: '' });
        } catch (error) {
            console.error("Error creating event:", error);
            toast.error("Failed to create event.");
        }
    };

    const toggleRSVP = async (event: VisitationEvent) => {
        if (!currentUserId) return;

        const isAttending = event.attendees?.includes(currentUserId);
        const eventRef = doc(db, 'visitation_events', event.id);

        try {
            if (isAttending) {
                await updateDoc(eventRef, {
                    attendees: arrayRemove(currentUserId)
                });
                toast.success("Attendance cancelled.");
            } else {
                await updateDoc(eventRef, {
                    attendees: arrayUnion(currentUserId)
                });
                toast.success("You're attending!");
            }
        } catch (error) {
            toast.error("Failed to update RSVP.");
        }
    };

    return (
        <div className="space-y-6">
            <Toaster position="top-right" />

            <div className="flex justify-between items-center">
                <div>
                    <h3 className="font-serif font-bold text-2xl text-stone-800">Events</h3>
                    <p className="text-stone-500 text-sm">Team gatherings, training, and prayer meetings.</p>
                </div>
                {isLeader && (
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center shadow-sm"
                    >
                        <HiPlus className="w-5 h-5 mr-1" />
                        Create Event
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
                    </div>
                ) : events.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-12 text-center">
                        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400">
                            <HiOutlineCalendar className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-medium text-stone-900">No events scheduled</h3>
                        <p className="text-stone-500 mt-1">Check back later for upcoming team gatherings.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event) => {
                            const isAttending = currentUserId && event.attendees?.includes(currentUserId);

                            return (
                                <div key={event.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                                    <div className="p-6 flex-1">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                                Team Gathering
                                            </div>
                                            {isAttending && (
                                                <div className="flex items-center text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs font-medium">
                                                    <HiCheckCircle className="w-3 h-3 mr-1" />
                                                    Attending
                                                </div>
                                            )}
                                        </div>

                                        <h4 className="font-bold text-xl text-stone-800 mb-2">{event.title}</h4>
                                        <p className="text-stone-500 text-sm mb-6 line-clamp-3">{event.description}</p>

                                        <div className="space-y-2 text-sm text-stone-600">
                                            <div className="flex items-center">
                                                <HiOutlineCalendar className="w-4 h-4 mr-2 text-teal-500" />
                                                {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            </div>
                                            <div className="flex items-center">
                                                <HiClock className="w-4 h-4 mr-2 text-teal-500" />
                                                {event.time}
                                            </div>
                                            <div className="flex items-center">
                                                <HiLocationMarker className="w-4 h-4 mr-2 text-teal-500" />
                                                {event.location}
                                            </div>
                                            <div className="flex items-center mt-2 pt-2 border-t border-stone-100">
                                                <HiOutlineUserGroup className="w-4 h-4 mr-2 text-stone-400" />
                                                {event.attendees?.length || 0} Attending
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-stone-50 px-6 py-4 border-t border-stone-100">
                                        <button
                                            onClick={() => toggleRSVP(event)}
                                            className={`w-full py-2 rounded-lg font-medium transition-colors ${isAttending
                                                    ? 'bg-white border border-stone-200 text-stone-600 hover:text-red-500 hover:border-red-200'
                                                    : 'bg-teal-600 text-white hover:bg-teal-700'
                                                }`}
                                        >
                                            {isAttending ? 'Cancel RSVP' : 'RSVP Now'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Create Event Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-scale-in">
                        <h3 className="text-lg font-bold text-stone-900 mb-4">Create New Event</h3>
                        <form onSubmit={handleCreateEvent} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Event Title</label>
                                <input
                                    type="text"
                                    required
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                    className="w-full rounded-lg border-stone-200 focus:ring-2 focus:ring-teal-500 px-3 py-2"
                                    placeholder="e.g., Monthly Team Training"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    required
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                    className="w-full rounded-lg border-stone-200 focus:ring-2 focus:ring-teal-500 px-3 py-2"
                                    placeholder="Brief details about the event..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={newEvent.date}
                                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                        className="w-full rounded-lg border-stone-200 focus:ring-2 focus:ring-teal-500 px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Time</label>
                                    <input
                                        type="time"
                                        required
                                        value={newEvent.time}
                                        onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                                        className="w-full rounded-lg border-stone-200 focus:ring-2 focus:ring-teal-500 px-3 py-2"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Location</label>
                                <input
                                    type="text"
                                    required
                                    value={newEvent.location}
                                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                    className="w-full rounded-lg border-stone-200 focus:ring-2 focus:ring-teal-500 px-3 py-2"
                                    placeholder="e.g., Church Main Hall / Zoom"
                                />
                            </div>

                            <div className="mt-6 flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 text-stone-500 hover:bg-stone-100 rounded-lg text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-teal-600 text-white hover:bg-teal-700 rounded-lg text-sm font-medium"
                                >
                                    Create Event
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VisitationEvents;
