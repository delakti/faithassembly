import React, { useState } from 'react';
import { HiClock, HiLocationMarker, HiCheck, HiX } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

interface WorshipEvent {
    id: number;
    title: string;
    type: string;
    date: string;
    time: string;
    location: string;
    setlist: string[];
    attending: boolean | null;
}

const EVENTS: WorshipEvent[] = [
    {
        id: 1,
        title: "Midweek Rehearsal",
        type: "Rehearsal",
        date: "Thursday, Nov 16",
        time: "19:00 - 21:00",
        location: "Main Sanctuary",
        setlist: ["Way Maker", "Goodness of God", "Firm Foundation"],
        attending: null
    },
    {
        id: 2,
        title: "Sunday Celebration",
        type: "Service",
        date: "Sunday, Nov 19",
        time: "08:30 Call Time",
        location: "Green Room",
        setlist: ["Way Maker", "Goodness of God", "Firm Foundation", "The Blessing"],
        attending: null
    },
    {
        id: 3,
        title: "Christmas Special Recording",
        type: "Special Event",
        date: "Friday, Dec 01",
        time: "18:00 - 22:00",
        location: "Studio B",
        setlist: ["O Holy Night", "Joy to the World"],
        attending: null
    }
];

const WorshipEvents: React.FC = () => {
    const [events, setEvents] = useState<WorshipEvent[]>(EVENTS);

    const handleRsvp = (id: number, status: boolean) => {
        setEvents(events.map(e => e.id === id ? { ...e, attending: status } : e));
        toast.success(status ? "Attendance Confirmed" : "Absence Noted");
    };

    return (
        <div className="space-y-8 font-sans text-gray-200">
            <div className="mb-12 border-l-4 border-yellow-500 pl-6">
                <span className="text-yellow-500 font-bold tracking-widest uppercase text-xs mb-2 block">Call Sheet</span>
                <h1 className="text-4xl md:text-5xl font-serif text-white">The Stage</h1>
                <p className="text-gray-400 font-medium mt-2 max-w-2xl">
                    Rehearsals, soundchecks, and service flows. Please confirm your availability 48 hours in advance.
                </p>
            </div>

            <div className="space-y-6">
                {events.map((event) => (
                    <div key={event.id} className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6 md:p-8 hover:border-white/20 transition-all flex flex-col md:flex-row gap-6 relative overflow-hidden group">
                        {/* Status Indicator Stripe */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${event.type === 'Rehearsal' ? 'bg-purple-500' :
                            event.type === 'Service' ? 'bg-yellow-500' : 'bg-pink-500'
                            }`}></div>

                        {/* Date Block */}
                        <div className="md:w-32 flex-shrink-0 flex flex-col justify-center items-center bg-black/30 rounded-xl p-4 border border-white/5">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{event.date.split(',')[0]}</span>
                            <span className="text-2xl font-bold text-white">{event.date.split(' ')[2]}</span>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">{event.date.split(' ')[1]}</span>
                        </div>

                        {/* Details */}
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider mb-2 ${event.type === 'Rehearsal' ? 'bg-purple-500/20 text-purple-400' :
                                    event.type === 'Service' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-pink-500/20 text-pink-400'
                                    }`}>
                                    {event.type}
                                </span>
                            </div>
                            <h3 className="text-2xl font-serif text-white mb-2">{event.title}</h3>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-6">
                                <div className="flex items-center gap-2">
                                    <HiClock className="w-4 h-4 text-gray-500" />
                                    {event.time}
                                </div>
                                <div className="flex items-center gap-2">
                                    <HiLocationMarker className="w-4 h-4 text-gray-500" />
                                    {event.location}
                                </div>
                            </div>

                            <div className="bg-black/20 rounded-lg p-4 mb-6">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Setlist</span>
                                <div className="flex flex-wrap gap-2">
                                    {event.setlist.map((song, idx) => (
                                        <span key={idx} className="text-xs font-medium text-gray-300 bg-white/5 px-2 py-1 rounded border border-white/5">
                                            {song}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="md:w-48 flex flex-col justify-center gap-3">
                            {event.attending === null ? (
                                <>
                                    <button
                                        onClick={() => handleRsvp(event.id, true)}
                                        className="w-full py-3 bg-white text-black font-bold uppercase tracking-widest text-xs rounded hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <HiCheck className="w-4 h-4" /> Confirm
                                    </button>
                                    <button
                                        onClick={() => handleRsvp(event.id, false)}
                                        className="w-full py-3 bg-transparent border border-white/20 text-gray-400 font-bold uppercase tracking-widest text-xs rounded hover:border-red-500 hover:text-red-500 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <HiX className="w-4 h-4" /> Decline
                                    </button>
                                </>
                            ) : (
                                <div className={`w-full py-4 text-center font-bold uppercase tracking-widest text-xs rounded border ${event.attending
                                    ? 'bg-green-500/10 border-green-500/50 text-green-400'
                                    : 'bg-red-500/10 border-red-500/50 text-red-400'
                                    }`}>
                                    {event.attending ? 'Confirmed' : 'Declined'}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorshipEvents;
