import React, { useState } from 'react';
import { HiCalendar, HiLocationMarker, HiTicket } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const MOCK_EVENTS = [
    {
        id: '1',
        title: 'Friday Night Live: GLOW',
        date: 'Friday, Oct 27 @ 7:00 PM',
        location: 'Main Auditorium',
        desc: 'Wear white or neon! A night of worship, games, and the Word. Food truck afterparty.',
        image: 'https://images.unsplash.com/photo-1545128485-c400e7702796?w=800&auto=format&fit=crop&q=60',
        attending: false
    },
    {
        id: '2',
        title: 'Squad Wars: Dodgeball',
        date: 'Saturday, Nov 4 @ 2:00 PM',
        location: 'Uxbridge Sports Centre',
        desc: 'Bring your A-game. Winning squad gets the Golden Trophy and Nando\'s vouchers.',
        image: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=800&auto=format&fit=crop&q=60',
        attending: true
    }
];

const YouthEvents: React.FC = () => {
    // In real app, this state would come from Firestore via `events` collection
    const [events, setEvents] = useState(MOCK_EVENTS);

    const toggleRSVP = (id: string) => {
        setEvents(events.map(ev => {
            if (ev.id === id) {
                const newStatus = !ev.attending;
                toast.success(newStatus ? "You're on the list! 🔥" : "RSVP Cancelled");
                return { ...ev, attending: newStatus };
            }
            return ev;
        }));
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Upcoming Hype</h1>
                    <p className="text-gray-400">Don't miss out on what God is doing.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {events.map((event) => (
                    <div key={event.id} className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden group hover:border-yellow-400 transition-all">
                        <div className="h-48 overflow-hidden relative">
                            <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
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
                            <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                                {event.desc}
                            </p>

                            <button
                                onClick={() => toggleRSVP(event.id)}
                                className={`w-full py-3 rounded-xl font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${event.attending
                                        ? 'bg-green-500 text-white hover:bg-green-600'
                                        : 'bg-yellow-400 text-black hover:bg-yellow-300'
                                    }`}
                            >
                                <HiTicket className="w-5 h-5" />
                                {event.attending ? "I'm Going!" : "RSVP Now"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default YouthEvents;
