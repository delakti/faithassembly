import React from 'react';
import { HiLocationMarker, HiClock, HiUserGroup, HiHand, HiCheckCircle, HiFire } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const OUTREACH_EVENTS = [
    {
        id: 1,
        title: "City Centre Blitz",
        type: "Street Evangelism",
        date: "Saturday, Dec 09",
        time: "10:00 AM - 01:00 PM",
        location: "High Street (Meet at Clock Tower)",
        teamLead: "Pastor Mark",
        slots: 20,
        filled: 12,
        status: "open",
        urgency: "high"
    },
    {
        id: 2,
        title: "Market Day Tract Distribution",
        type: "Tract Sharing",
        date: "Tuesday, Dec 12",
        time: "11:00 AM - 02:00 PM",
        location: "Central Market Entrance",
        teamLead: "Sister Sarah",
        slots: 8,
        filled: 8,
        status: "full",
        urgency: "medium"
    },
    {
        id: 3,
        title: "Estate Prayer Walk",
        type: "Prayer Walk",
        date: "Thursday, Dec 14",
        time: "06:00 PM - 08:00 PM",
        location: "Oakwood Estate",
        teamLead: "Brother James",
        slots: 10,
        filled: 4,
        status: "open",
        urgency: "low"
    }
];

const EvangelismSchedule: React.FC = () => {

    const handleVolunteer = (title: string) => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 1000)),
            {
                loading: 'Joining Squad...',
                success: `You have joined: ${title}`,
                error: 'Could not join',
            }
        );
    };

    return (
        <div className="space-y-8 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <span className="text-orange-500 font-bold text-xs mb-2 block tracking-widest uppercase">Mobilization</span>
                    <h1 className="text-3xl font-black text-white uppercase italic tracking-tight">Outreach Calendar</h1>
                </div>
            </div>

            <div className="space-y-4">
                {OUTREACH_EVENTS.map((event) => (
                    <div key={event.id} className="bg-stone-950 border border-stone-800 rounded-xl overflow-hidden group hover:border-orange-500/50 transition-all relative">
                        {/* Urgency Strip */}
                        <div className={`absolute left-0 top-0 bottom-0 w-2 ${event.urgency === 'high' ? 'bg-orange-600' :
                            event.urgency === 'medium' ? 'bg-yellow-500' :
                                'bg-blue-500'
                            }`}></div>

                        <div className="p-6 pl-8 flex flex-col md:flex-row gap-6 md:items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${event.urgency === 'high' ? 'bg-orange-900/30 text-orange-500 border border-orange-500/20' :
                                        event.urgency === 'medium' ? 'bg-yellow-900/30 text-yellow-500 border border-yellow-500/20' :
                                            'bg-blue-900/30 text-blue-500 border border-blue-500/20'
                                        }`}>
                                        {event.type}
                                    </span>
                                    {event.urgency === 'high' && (
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-orange-500 uppercase animate-pulse">
                                            <HiFire className="w-3 h-3" /> Urgent Need
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors uppercase">{event.title}</h3>
                                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-400 font-bold">
                                    <span className="flex items-center gap-2"><HiClock className="w-4 h-4 text-stone-600" /> {event.date} &bull; {event.time}</span>
                                    <span className="flex items-center gap-2"><HiLocationMarker className="w-4 h-4 text-stone-600" /> {event.location}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-stone-800 pt-4 md:pt-0">
                                <div className="text-right">
                                    <span className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Squad Strength</span>
                                    <div className="flex items-center gap-2">
                                        <HiUserGroup className="w-4 h-4 text-stone-400" />
                                        <span className={`text-lg font-black ${event.status === 'full' ? 'text-green-500' : 'text-white'}`}>
                                            {event.filled} <span className="text-stone-600 text-sm">/ {event.slots}</span>
                                        </span>
                                    </div>
                                </div>

                                {event.status === 'open' ? (
                                    <button
                                        onClick={() => handleVolunteer(event.title)}
                                        className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-black uppercase text-sm rounded-lg shadow-lg hover:shadow-orange-600/20 transition-all flex items-center gap-2 whitespace-nowrap"
                                    >
                                        <HiHand className="w-4 h-4" /> Volunteer
                                    </button>
                                ) : (
                                    <button disabled className="px-6 py-3 bg-stone-900 text-stone-500 border border-stone-800 font-bold uppercase text-sm rounded-lg flex items-center gap-2 cursor-not-allowed whitespace-nowrap">
                                        <HiCheckCircle className="w-4 h-4" /> Squad Full
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EvangelismSchedule;
