import React, { useState, useEffect } from 'react';
import { HiCalendar, HiLocationMarker, HiTicket } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import type { YouthEvent } from '../../types/youth';

const YouthEvents: React.FC = () => {
    const [events, setEvents] = useState<YouthEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'youth_events'), orderBy('date', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const eventsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as YouthEvent[];
            setEvents(eventsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const toggleRSVP = (_id: string, link?: string) => {
        if (link) {
            window.open(link, '_blank');
            return;
        }
        toast.success("RSVP feature coming soon!");
    };

    if (loading) {
        return <div className="text-white text-center py-20">Loading events...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Upcoming Hype</h1>
                    <p className="text-gray-400">Don't miss out on what God is doing.</p>
                </div>
            </div>

            {events.length === 0 ? (
                <div className="text-gray-500 text-center py-20 bg-gray-900/50 rounded-3xl border border-gray-800">
                    <p className="text-xl font-bold">No upcoming events yet.</p>
                    <p className="text-sm">Check back soon for the next move.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-8">
                    {events.map((event) => (
                        <div key={event.id} className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden group hover:border-yellow-400 transition-all">
                            <div className="h-48 overflow-hidden relative bg-black">
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                                />
                                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur text-yellow-400 px-3 py-1 rounded-full text-xs font-bold uppercase border border-yellow-400/20">
                                    Upcoming
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-2xl font-black text-white italic uppercase mb-2">{event.title}</h3>
                                <div className="flex items-center text-gray-400 text-sm mb-1">
                                    <HiCalendar className="w-4 h-4 mr-2" />
                                    {event.date}
                                </div>
                                <div className="flex items-center text-gray-400 text-sm mb-4">
                                    <HiLocationMarker className="w-4 h-4 mr-2" />
                                    {event.location}
                                </div>
                                <p className="text-gray-300 mb-6 leading-relaxed text-sm line-clamp-3">
                                    {event.desc}
                                </p>

                                <button
                                    onClick={() => toggleRSVP(event.id, event.registrationLink)}
                                    className="w-full py-3 rounded-xl font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 bg-yellow-400 text-black hover:bg-yellow-300"
                                >
                                    <HiTicket className="w-5 h-5" />
                                    {event.registrationLink ? "Register Now" : "RSVP Now"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default YouthEvents;
