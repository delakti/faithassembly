import React from 'react';
import { HiLocationMarker, HiUserGroup, HiClock } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const EVENTS = [
    {
        id: 1,
        title: "OBS Advanced Workshop",
        date: "Dec 10, 2025",
        time: "07:00 PM - 09:00 PM",
        location: "Media Suite",
        type: "Training",
        attendees: 8
    },
    {
        id: 2,
        title: "Christmas Service Tech Rehearsal",
        date: "Dec 15, 2025",
        time: "06:00 PM - 10:00 PM",
        location: "Main Sanctuary",
        type: "Rehearsal",
        attendees: 24
    },
    {
        id: 3,
        title: "New Gear Setup: SoundGrid",
        date: "Jan 05, 2026",
        time: "10:00 AM - 04:00 PM",
        location: "Audio Booth",
        type: "Setup",
        attendees: 4
    }
];

const MediaEvents: React.FC = () => {

    const handleRSVP = (title: string) => {
        toast.success(`RSVP Confirmed for: ${title}`);
    };

    return (
        <div className="space-y-8 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <span className="text-cyan-500 font-mono font-bold text-xs mb-2 block tracking-widest uppercase">Schedule & Training</span>
                    <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Upcoming Events</h1>
                </div>
            </div>

            <div className="grid gap-4">
                {EVENTS.map((event) => (
                    <div key={event.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-cyan-500/30 transition-all">
                        <div className="flex items-start gap-6">
                            <div className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center flex-shrink-0">
                                <span className="text-xs font-bold text-cyan-500 uppercase">{event.date.split(' ')[0]}</span>
                                <span className="text-2xl font-bold text-white">{event.date.split(' ')[1].replace(',', '')}</span>
                            </div>

                            <div>
                                <span className="inline-block px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono uppercase font-bold mb-2">
                                    {event.type}
                                </span>
                                <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                                    <span className="flex items-center gap-1"><HiClock className="w-4 h-4 text-slate-600" /> {event.time}</span>
                                    <span className="flex items-center gap-1"><HiLocationMarker className="w-4 h-4 text-slate-600" /> {event.location}</span>
                                    <span className="flex items-center gap-1"><HiUserGroup className="w-4 h-4 text-slate-600" /> {event.attendees} Attending</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => handleRSVP(event.title)}
                            className="px-6 py-3 bg-cyan-900/20 text-cyan-400 border border-cyan-500/20 font-bold rounded-lg hover:bg-cyan-500 hover:text-white hover:border-cyan-500 transition-all font-mono uppercase text-sm whitespace-nowrap"
                        >
                            RSVP Now
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MediaEvents;
