import React from 'react';
import { HiLocationMarker, HiSpeakerphone, HiUserGroup } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const MAJOR_EVENTS = [
    {
        id: 1,
        title: "Praise in the Park",
        type: "Open Air Crusade",
        date: "Jul 15, 2026",
        location: "Victoria Park",
        target: "500 Souls",
        status: "Planning"
    },
    {
        id: 2,
        title: "Easter Passion Play",
        type: "Street Drama",
        date: "Apr 04, 2026",
        location: "City Square",
        target: "200 Souls",
        status: "Confirmed"
    },
    {
        id: 3,
        title: "Effective Soul Winning",
        type: "Training Seminar",
        date: "Feb 20, 2026",
        location: "Main Sanctuary",
        target: "All Evangelists",
        status: "Registration Open"
    }
];

const EvangelismEvents: React.FC = () => {

    const handleRegister = (title: string) => {
        toast.success(`Registered for: ${title}`);
    };

    return (
        <div className="space-y-8 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <span className="text-orange-500 font-bold text-xs mb-2 block tracking-widest uppercase">Big Calendar</span>
                    <h1 className="text-3xl font-black text-white uppercase italic tracking-tight">Major Campaigns</h1>
                </div>
            </div>

            <div className="grid gap-6">
                {MAJOR_EVENTS.map((event) => (
                    <div key={event.id} className="bg-gradient-to-r from-stone-950 to-stone-900 border border-stone-800 rounded-xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 hover:border-orange-500/30 transition-all group">
                        <div className="flex items-start gap-6">
                            <div className="hidden md:flex flex-col items-center justify-center w-24 h-24 bg-stone-950 border-2 border-orange-600/30 rounded-xl text-center group-hover:border-orange-500 transition-colors">
                                <span className="text-xs font-black text-orange-600 uppercase tracking-wider">{event.date.split(' ')[0]}</span>
                                <span className="text-3xl font-black text-white">{event.date.split(' ')[1].replace(',', '')}</span>
                                <span className="text-xs font-bold text-stone-500">{event.date.split(' ')[2]}</span>
                            </div>

                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="inline-block px-2 py-0.5 rounded bg-orange-900/20 text-orange-500 border border-orange-500/20 text-[10px] font-bold uppercase tracking-wider">
                                        {event.type}
                                    </span>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${event.status === 'Confirmed' ? 'text-green-500' : 'text-stone-500'
                                        }`}>- {event.status}</span>
                                </div>
                                <h3 className="text-2xl font-black text-white mb-3 uppercase italic group-hover:text-orange-400 transition-colors ">{event.title}</h3>
                                <div className="flex flex-wrap items-center gap-6 text-sm text-stone-400 font-bold">
                                    <span className="flex items-center gap-2"><HiLocationMarker className="w-4 h-4 text-stone-600" /> {event.location}</span>
                                    <span className="flex items-center gap-2"><HiUserGroup className="w-4 h-4 text-stone-600" /> Target: {event.target}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => handleRegister(event.title)}
                            className="px-8 py-4 bg-white text-stone-950 font-black uppercase tracking-widest text-xs rounded hover:bg-orange-500 hover:text-white transition-all shadow-xl hover:shadow-orange-500/20 flex items-center justify-center gap-2"
                        >
                            <HiSpeakerphone className="w-4 h-4" /> RSVP
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EvangelismEvents;
