import React, { useState } from 'react';
import { HiCalendar, HiLocationMarker, HiUserGroup, HiCheckCircle, HiXCircle } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const EVENTS = [
    {
        id: 1,
        title: "All-Night Vigil",
        date: "Friday, Dec 01",
        time: "10:00 PM - 05:00 AM",
        location: "Main Sanctuary",
        description: "A time of intense intercession for the upcoming year. We will be praying through the watches of the night.",
        type: "Vigil",
        attendees: 42,
        attending: null as boolean | null
    },
    {
        id: 2,
        title: "Prophetic Training",
        date: "Saturday, Dec 09",
        time: "10:00 AM - 02:00 PM",
        location: "Hall B",
        description: "Equipping the saints to hear the voice of God. Open to all intercessors.",
        type: "Workshop",
        attendees: 15,
        attending: null as boolean | null
    },
    {
        id: 3,
        title: "Pre-Service War Room",
        date: "Sunday, Dec 03",
        time: "08:00 AM - 08:45 AM",
        location: "Prayer Room",
        description: "Covering the Sunday service, the word, and the worship in prayer.",
        type: "Weekly",
        attendees: 8,
        attending: null as boolean | null
    }
];

const PrayerEvents: React.FC = () => {
    const [events, setEvents] = useState(EVENTS);

    const handleRSVP = (id: number, status: boolean) => {
        setEvents(prev => prev.map(e => e.id === id ? { ...e, attending: status } : e));
        toast.success(status ? 'Attendance Confirmed' : 'Updated: Not Attending');
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
                {events.map((event) => (
                    <div key={event.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 hover:border-indigo-500/30 transition-all group">
                        {/* Date Block */}
                        <div className="md:w-32 flex-shrink-0 flex flex-col items-center justify-center bg-slate-950 rounded-xl border border-slate-800 p-4 group-hover:border-indigo-500/30 transition-colors">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">{event.date.split(',')[0]}</span>
                            <span className="text-3xl font-serif font-black text-white my-1">{event.date.split(' ')[2]}</span>
                            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{event.date.split(' ')[1]}</span>
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
                                    <HiUserGroup className="w-4 h-4 text-indigo-400" /> {event.attendees} Intercessors
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="md:w-48 flex flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-slate-800 pt-6 md:pt-0 md:pl-8">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center mb-1">Will you join?</span>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleRSVP(event.id, true)}
                                    className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${event.attending === true
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                                            : 'bg-slate-950 text-slate-500 hover:bg-slate-800 hover:text-white'
                                        }`}
                                >
                                    <HiCheckCircle className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleRSVP(event.id, false)}
                                    className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${event.attending === false
                                            ? 'bg-slate-800 text-white'
                                            : 'bg-slate-950 text-slate-500 hover:bg-slate-800 hover:text-white'
                                        }`}
                                >
                                    <HiXCircle className="w-5 h-5" />
                                </button>
                            </div>
                            {event.attending !== null && (
                                <p className="text-center text-xs font-bold text-slate-500 mt-2">
                                    {event.attending ? 'Counted in.' : 'Not attending.'}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PrayerEvents;
