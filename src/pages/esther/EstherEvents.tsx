import React, { useState } from 'react';
import { HiCalendar, HiLocationMarker, HiClock, HiCheck } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const EVENTS = [
    {
        id: 1,
        title: "Women's Prayer Breakfast",
        date: "Sat, Nov 11",
        time: "9:00 AM - 11:00 AM",
        location: "Church Hall",
        image: "https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?w=800&auto=format&fit=crop&q=60",
        spots: 15
    },
    {
        id: 2,
        title: "Complete in Him - Retreat",
        date: "Fri, Dec 1 - Sun, Dec 3",
        time: "All Weekend",
        location: "Ashburnham Place",
        image: "https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?w=800&auto=format&fit=crop&q=60",
        spots: 5
    }
];

const EstherEvents: React.FC = () => {
    const [rsvpState, setRsvpState] = useState<Record<number, boolean>>({});

    const handleRSVP = (id: number) => {
        setRsvpState(prev => {
            const newState = !prev[id];
            toast.success(newState ? "You're registered! See you there." : "Registration cancelled.");
            return { ...prev, [id]: newState };
        });
    };

    return (
        <div className="space-y-8 font-sans">
            <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-rose-500 font-bold tracking-widest uppercase text-xs mb-2 block">Gatherings</span>
                <h1 className="text-4xl md:text-5xl font-serif text-rose-950 mb-4">Fellowship & Worship</h1>
                <p className="text-gray-500">
                    Come together with sisters in Christ to pray, worship, and grow. "For where two or three gather in my name..."
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {EVENTS.map((event) => (
                    <div key={event.id} className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm hover:shadow-lg transition-all flex flex-col md:flex-row gap-6 items-start">
                        {/* Date Badge (Mobile) */}
                        <div className="md:hidden flex items-center gap-2 text-rose-600 font-bold mb-2">
                            <HiCalendar className="w-5 h-5" />
                            {event.date}
                        </div>

                        <div className="w-full md:w-48 h-48 rounded-xl overflow-hidden shrink-0 relative">
                            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-rose-600 shadow-sm">
                                {event.spots} spots left
                            </div>
                        </div>

                        <div className="flex-1 w-full">
                            <h3 className="text-2xl font-serif text-rose-950 mb-2">{event.title}</h3>

                            <div className="space-y-2 text-gray-500 text-sm mb-6">
                                <div className="flex items-center gap-2">
                                    <HiCalendar className="w-4 h-4 text-rose-400" />
                                    <span>{event.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <HiClock className="w-4 h-4 text-rose-400" />
                                    <span>{event.time}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <HiLocationMarker className="w-4 h-4 text-rose-400" />
                                    <span>{event.location}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleRSVP(event.id)}
                                className={`w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${rsvpState[event.id]
                                        ? 'bg-green-50 text-green-600 border border-green-200'
                                        : 'bg-rose-500 text-white hover:bg-rose-600 shadow-md shadow-rose-200'
                                    }`}
                            >
                                {rsvpState[event.id] ? <><HiCheck className="w-5 h-5" /> Confirmed</> : 'RSVP Now'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EstherEvents;
