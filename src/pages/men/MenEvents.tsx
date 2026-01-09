import React, { useState } from 'react';
import { HiCalendar, HiLocationMarker, HiClock, HiCheck, HiShieldCheck } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const EVENTS = [
    {
        id: 1,
        title: "Men's Prayer Breakfast",
        objective: "Spiritual Fortification",
        date: "Sat, Nov 11",
        time: "0800 Hours",
        location: "Church Hall",
        image: "https://images.unsplash.com/photo-1543807568-1ec2520deb7b?w=800&auto=format&fit=crop&q=60",
        spots: 24
    },
    {
        id: 2,
        title: "Operation: Community Outreach",
        objective: "Service & Evangelism",
        date: "Sat, Dec 02",
        time: "1000 Hours",
        location: "City Center",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60",
        spots: 10
    }
];

const MenEvents: React.FC = () => {
    const [rsvpState, setRsvpState] = useState<Record<number, boolean>>({});

    const handleRSVP = (id: number) => {
        setRsvpState(prev => {
            const newState = !prev[id];
            toast.success(newState ? "Mission Accepted. Stand by for details." : "Mission Aborted.");
            return { ...prev, [id]: newState };
        });
    };

    return (
        <div className="space-y-8 font-sans">
            <div className="mb-12 border-l-4 border-indigo-600 pl-6">
                <span className="text-indigo-600 font-bold tracking-widest uppercase text-xs mb-2 block">Active Operations</span>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic">Missions</h1>
                <p className="text-slate-500 font-medium mt-2 max-w-2xl">
                    "Here I am, send me!" Deploy for upcoming gatherings, service projects, and prayer summits.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {EVENTS.map((event) => (
                    <div key={event.id} className="bg-white rounded-xl border border-slate-200 shadow-lg hover:shadow-2xl transition-all group flex flex-col overflow-hidden">

                        <div className="h-64 overflow-hidden relative">
                            <img src={event.image} alt={event.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 contrast-125" />
                            <div className="absolute top-0 right-0 bg-indigo-600 text-white px-4 py-2 font-black uppercase tracking-wider text-xs rounded-bl-xl shadow-lg">
                                {event.spots} Slots Open
                            </div>
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-slate-900 to-transparent p-6 pt-12">
                                <h3 className="text-2xl font-black text-white uppercase italic tracking-wide">{event.title}</h3>
                            </div>
                        </div>

                        <div className="p-8 flex-1 flex flex-col bg-slate-50">
                            <div className="mb-6">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Mission Objective</span>
                                <p className="text-indigo-700 font-bold text-lg flex items-center">
                                    <HiShieldCheck className="w-5 h-5 mr-2" />
                                    {event.objective}
                                </p>
                            </div>

                            <div className="space-y-3 text-slate-600 font-medium text-sm mb-8 bg-white p-4 rounded-lg border border-slate-200">
                                <div className="flex items-center gap-3">
                                    <HiCalendar className="w-5 h-5 text-indigo-500" />
                                    <span className="uppercase tracking-wide">{event.date}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <HiClock className="w-5 h-5 text-indigo-500" />
                                    <span className="uppercase tracking-wide">{event.time}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <HiLocationMarker className="w-5 h-5 text-indigo-500" />
                                    <span className="uppercase tracking-wide">{event.location}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleRSVP(event.id)}
                                className={`w-full py-4 rounded-lg font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg ${rsvpState[event.id]
                                        ? 'bg-green-600 text-white shadow-green-500/30'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/30'
                                    }`}
                            >
                                {rsvpState[event.id] ? <><HiCheck className="w-5 h-5" /> Mission Confirmed</> : 'Accept Mission'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MenEvents;
