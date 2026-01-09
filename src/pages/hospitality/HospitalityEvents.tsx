import React, { useState } from 'react';
import { HiCalendar, HiLocationMarker, HiUserGroup, HiCheckCircle, HiXCircle } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const EVENTS = [
    {
        id: 1,
        title: "Hospitality Team Training",
        date: "Saturday, Dec 02",
        time: "10:00 AM - 12:00 PM",
        location: "Fellowship Hall",
        description: "Mandatory training for all current and new volunteers. We will cover safety protocols and new menu items.",
        type: "Training",
        attendees: 24,
        attending: null as boolean | null
    },
    {
        id: 2,
        title: "Christmas Service Planning",
        date: "Tuesday, Dec 05",
        time: "07:00 PM - 08:30 PM",
        location: "Meeting Room B",
        description: "Planning session for the Christmas Eve catering. All team leaders are requested to attend.",
        type: "Meeting",
        attendees: 8,
        attending: null as boolean | null
    },
    {
        id: 3,
        title: "Volunteer Appreciation Dinner",
        date: "Friday, Dec 15",
        time: "06:00 PM - 09:00 PM",
        location: "Main Sanctuary Foyer",
        description: "A night to celebrate YOU! Come enjoy a meal served by the pastoral staff.",
        type: "Social",
        attendees: 45,
        attending: null as boolean | null
    }
];

const HospitalityEvents: React.FC = () => {
    const [events, setEvents] = useState(EVENTS);

    const handleRSVP = (id: number, status: boolean) => {
        setEvents(prev => prev.map(e => e.id === id ? { ...e, attending: status } : e));
        toast.success(status ? 'RSVP Confirmed: Going' : 'RSVP Updated: Not Going');
    };

    return (
        <div className="space-y-8 font-sans text-stone-800">
            <div className="mb-8 border-l-4 border-orange-400 pl-6">
                <span className="text-orange-500 font-bold tracking-widest uppercase text-xs mb-2 block">Gatherings</span>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900">Upcoming Events</h1>
                <p className="text-stone-500 font-medium mt-2 max-w-2xl">
                    "For where two or three gather in my name, there am I with them." — Matthew 18:20
                </p>
            </div>

            <div className="grid gap-6">
                {events.map((event) => (
                    <div key={event.id} className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-8">
                        {/* Date Block */}
                        <div className="md:w-32 flex-shrink-0 flex flex-col items-center justify-center bg-stone-50 rounded-xl border border-stone-100 p-4">
                            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest text-center">{event.date.split(',')[0]}</span>
                            <span className="text-3xl font-serif font-black text-stone-800 my-1">{event.date.split(' ')[2]}</span>
                            <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">{event.date.split(' ')[1]}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${event.type === 'Training' ? 'bg-blue-100 text-blue-700' :
                                        event.type === 'Social' ? 'bg-pink-100 text-pink-700' :
                                            'bg-stone-200 text-stone-600'
                                    }`}>
                                    {event.type}
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-stone-900 mb-2">{event.title}</h3>
                            <p className="text-stone-500 mb-4 leading-relaxed">{event.description}</p>

                            <div className="flex flex-wrap gap-6 text-sm font-medium text-stone-500">
                                <span className="flex items-center gap-2">
                                    <HiCalendar className="w-4 h-4 text-orange-400" /> {event.time}
                                </span>
                                <span className="flex items-center gap-2">
                                    <HiLocationMarker className="w-4 h-4 text-orange-400" /> {event.location}
                                </span>
                                <span className="flex items-center gap-2">
                                    <HiUserGroup className="w-4 h-4 text-orange-400" /> {event.attendees} Attending
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="md:w-48 flex flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-stone-100 pt-6 md:pt-0 md:pl-8">
                            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest text-center mb-1">Are you going?</span>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleRSVP(event.id, true)}
                                    className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${event.attending === true
                                            ? 'bg-green-600 text-white shadow-lg shadow-green-200'
                                            : 'bg-stone-50 text-stone-400 hover:bg-green-50 hover:text-green-600'
                                        }`}
                                >
                                    <HiCheckCircle className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleRSVP(event.id, false)}
                                    className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${event.attending === false
                                            ? 'bg-red-600 text-white shadow-lg shadow-red-200'
                                            : 'bg-stone-50 text-stone-400 hover:bg-red-50 hover:text-red-600'
                                        }`}
                                >
                                    <HiXCircle className="w-5 h-5" />
                                </button>
                            </div>
                            {event.attending !== null && (
                                <p className="text-center text-xs font-bold text-stone-400 mt-2">
                                    {event.attending ? 'You are going!' : 'You declined.'}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HospitalityEvents;
