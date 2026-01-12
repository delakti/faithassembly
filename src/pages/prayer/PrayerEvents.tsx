import React, { useState, useEffect } from 'react';
import { HiCalendar, HiLocationMarker, HiUserGroup, HiCheckCircle, HiXCircle } from 'react-icons/hi';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'react-hot-toast';

const PrayerEvents: React.FC = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [rsvpState, setRsvpState] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const q = query(collection(db, 'prayer_events'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    const handleRSVP = async (id: string, isAttending: boolean) => {
        const currentStatus = rsvpState[id];

        // Prevent double voting for same status
        if (currentStatus === isAttending) return;

        try {
            // If changing from yes to no, decrement. If no to yes, increment.
            // If null to yes, increment. Null to no, do nothing (or decrement if we assume they were counted? No).
            // Simplified: 
            // - Click Yes: +1 (if not already yes)
            // - Click No: -1 (if currently yes)

            const ref = doc(db, 'prayer_events', id);

            if (isAttending) {
                if (currentStatus !== true) {
                    await updateDoc(ref, { attendees: increment(1) });
                    toast.success('Attendance Confirmed');
                }
            } else {
                if (currentStatus === true) {
                    await updateDoc(ref, { attendees: increment(-1) });
                    toast.error('Updated: Not Attending');
                }
            }

            setRsvpState(prev => ({ ...prev, [id]: isAttending }));

        } catch (error) {
            toast.error("Failed to update RSVP");
        }
    };

    // Helper to safely format date parts
    const getDateParts = (dateString: string) => {
        if (!dateString) return { day: '', date: '', month: '' };
        const parts = dateString.split(' '); // Expected: "Friday, Dec 01" -> ["Friday,", "Dec", "01"]
        if (parts.length < 3) return { day: '', date: '', month: '' };
        return {
            day: parts[0].replace(',', ''),
            month: parts[1],
            date: parts[2]
        };
    };

    return (
        <div className="space-y-8 font-sans text-slate-200">
            <div className="mb-8 border-l-4 border-indigo-500 pl-6">
                <span className="text-indigo-400 font-bold tracking-widest uppercase text-xs mb-2 block">Gatherings</span>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">Holy Convocations</h1>
                <p className="text-slate-400 font-medium mt-2 max-w-2xl">
                    "Not giving up meeting together, as some are in the habit of doing, but encouraging one another." — Hebrews 10:25
                </p>
            </div>

            <div className="grid gap-6">
                {events.length === 0 && (
                    <div className="p-12 text-center text-slate-500 italic bg-slate-900/30 rounded-xl border border-slate-800">
                        No upcoming convocations scheduled.
                    </div>
                )}
                {events.map((event) => {
                    const { day, month, date } = getDateParts(event.date);
                    const userAttending = rsvpState[event.id];

                    return (
                        <div key={event.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 hover:border-indigo-500/30 transition-all group">
                            {/* Date Block */}
                            <div className="md:w-32 flex-shrink-0 flex flex-col items-center justify-center bg-slate-950 rounded-xl border border-slate-800 p-4 group-hover:border-indigo-500/30 transition-colors">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">{day}</span>
                                <span className="text-3xl font-serif font-black text-white my-1">{date}</span>
                                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{month}</span>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${event.type === 'Vigil' ? 'bg-purple-900/40 text-purple-300' :
                                        event.type === 'Workshop' ? 'bg-blue-900/40 text-blue-300' :
                                            'bg-slate-800 text-slate-400'
                                        }`}>
                                        {event.type}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                                <p className="text-slate-400 mb-4 leading-relaxed">{event.description}</p>

                                <div className="flex flex-wrap gap-6 text-sm font-medium text-slate-500">
                                    <span className="flex items-center gap-2">
                                        <HiCalendar className="w-4 h-4 text-indigo-400" /> {event.time}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <HiLocationMarker className="w-4 h-4 text-indigo-400" /> {event.location}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <HiUserGroup className="w-4 h-4 text-indigo-400" /> {event.attendees || 0} Intercessors
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="md:w-48 flex flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-slate-800 pt-6 md:pt-0 md:pl-8">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center mb-1">Will you join?</span>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleRSVP(event.id, true)}
                                        className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${userAttending === true
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                                            : 'bg-slate-950 text-slate-500 hover:bg-slate-800 hover:text-white'
                                            }`}
                                    >
                                        <HiCheckCircle className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleRSVP(event.id, false)}
                                        className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${userAttending === false
                                            ? 'bg-slate-800 text-white'
                                            : 'bg-slate-950 text-slate-500 hover:bg-slate-800 hover:text-white'
                                            }`}
                                    >
                                        <HiXCircle className="w-5 h-5" />
                                    </button>
                                </div>
                                {userAttending !== undefined && (
                                    <p className="text-center text-xs font-bold text-slate-500 mt-2">
                                        {userAttending ? 'Counted in.' : 'Not attending.'}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PrayerEvents;
