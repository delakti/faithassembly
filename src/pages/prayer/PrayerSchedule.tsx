import React, { useState } from 'react';
import { HiClock, HiCalendar, HiCheckCircle, HiRefresh, HiUser } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const WATCH_SLOTS = [
    {
        id: 1,
        day: "Monday",
        time: "06:00 AM - 07:00 AM",
        focus: "Morning Glory",
        status: "Assigned",
        assignedTo: "You"
    },
    {
        id: 2,
        day: "Wednesday",
        time: "12:00 PM - 01:00 PM",
        focus: "Midday Intercession",
        status: "Open",
        assignedTo: null
    },
    {
        id: 3,
        day: "Friday",
        time: "11:00 PM - 12:00 AM",
        focus: "Night Vigil",
        status: "Assigned",
        assignedTo: "Brother James"
    },
    {
        id: 4,
        day: "Sunday",
        time: "08:30 AM - 09:00 AM",
        focus: "Pre-Service Prayer",
        status: "Open",
        assignedTo: null
    }
];

const PrayerSchedule: React.FC = () => {
    const [slots, setSlots] = useState(WATCH_SLOTS);

    const handleCommit = (id: number) => {
        setSlots(prev => prev.map(s => s.id === id ? { ...s, status: 'Assigned', assignedTo: 'You' } : s));
        toast.success('You have taken the watch.');
    };

    const handleRelease = (id: number) => {
        setSlots(prev => prev.map(s => s.id === id ? { ...s, status: 'Open', assignedTo: null } : s));
        toast('Watch slot released.', { icon: '🕊️' });
    };

    return (
        <div className="space-y-8 font-sans text-slate-200">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div className="border-l-4 border-indigo-500 pl-6">
                    <span className="text-indigo-400 font-bold tracking-widest uppercase text-xs mb-2 block">Weekly Rota</span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">The Watch</h1>
                    <p className="text-slate-400 font-medium mt-2 max-w-2xl">
                        "I have posted watchmen on your walls, Jerusalem; they will never be silent day or night." — Isaiah 62:6
                    </p>
                </div>
            </div>

            <div className="grid gap-4">
                {slots.map((slot) => (
                    <div key={slot.id} className={`border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 transition-all ${slot.status === 'Assigned' && slot.assignedTo === 'You'
                            ? 'bg-indigo-900/20 border-indigo-500/50 shadow-lg shadow-indigo-900/20'
                            : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                        }`}>

                        <div className="flex-shrink-0 w-16 h-16 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center">
                            <HiClock className={`w-8 h-8 ${slot.status === 'Assigned' && slot.assignedTo === 'You' ? 'text-indigo-400' : 'text-slate-600'}`} />
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                                <span className="text-lg font-bold text-white">{slot.day} &bull; {slot.time}</span>
                                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block md:inline w-fit mx-auto md:mx-0 ${slot.status === 'Assigned' ? 'bg-slate-800 text-slate-400' : 'bg-green-900/30 text-green-400'
                                    }`}>
                                    {slot.status}
                                </span>
                            </div>
                            <p className="text-indigo-200 font-medium">{slot.focus}</p>
                            {slot.assignedTo && (
                                <p className="text-xs text-slate-500 mt-2 flex items-center justify-center md:justify-start gap-1">
                                    <HiUser className="w-3 h-3" /> Watchman: {slot.assignedTo}
                                </p>
                            )}
                        </div>

                        <div className="flex-shrink-0 w-full md:w-auto">
                            {slot.status === 'Open' ? (
                                <button
                                    onClick={() => handleCommit(slot.id)}
                                    className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2"
                                >
                                    <HiCheckCircle className="w-5 h-5" /> Stand in Gap
                                </button>
                            ) : (
                                slot.assignedTo === 'You' && (
                                    <button
                                        onClick={() => handleRelease(slot.id)}
                                        className="w-full md:w-auto px-6 py-3 bg-slate-800 text-slate-400 font-bold rounded-xl hover:text-red-400 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <HiRefresh className="w-5 h-5" /> Release Slot
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="font-bold text-white mb-1">Need coverage?</h3>
                    <p className="text-slate-500 text-sm">If you cannot make your assigned watch, please release it early so others may stand in.</p>
                </div>
                <button className="text-indigo-400 font-bold text-sm hover:text-indigo-300 transition-colors flex items-center gap-2">
                    <HiCalendar className="w-5 h-5" /> View Full Calendar
                </button>
            </div>
        </div>
    );
};

export default PrayerSchedule;
