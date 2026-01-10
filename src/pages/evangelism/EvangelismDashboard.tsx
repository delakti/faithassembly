
import React, { useState, useEffect } from 'react';
import { HiUserAdd, HiCalendar, HiChatAlt2, HiClipboardList, HiArrowRight, HiFire } from 'react-icons/hi';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import type { EvangelismEvent } from '../../types/evangelism';

const EvangelismDashboard: React.FC = () => {
    const [nextEvent, setNextEvent] = useState<EvangelismEvent | null>(null);

    useEffect(() => {
        const fetchNextEvent = async () => {
            try {
                const q = query(collection(db, 'evangelism_events'), orderBy('date', 'asc'), limit(1));
                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    setNextEvent({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as EvangelismEvent);
                }
            } catch (error) {
                console.error("Error fetching next event:", error);
            }
        };

        fetchNextEvent();
    }, []);

    return (
        <div className="space-y-6 font-sans">
            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-stone-950 border-l-4 border-orange-500 p-6 shadow-lg">
                    <div className="flex items-center gap-3">
                        <HiUserAdd className="w-8 h-8 text-orange-500" />
                        <div>
                            <span className="block text-3xl font-black text-white leading-none">12</span>
                            <span className="text-xs font-bold text-stone-500 uppercase">Souls Won (Week)</span>
                        </div>
                    </div>
                </div>
                <div className="bg-stone-950 border-l-4 border-yellow-500 p-6 shadow-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 font-black text-sm">34</div>
                        <div>
                            <span className="block text-3xl font-black text-white leading-none">34</span>
                            <span className="text-xs font-bold text-stone-500 uppercase">Follow-Ups</span>
                        </div>
                    </div>
                </div>
                <div className="bg-stone-950 border-l-4 border-blue-500 p-6 shadow-lg">
                    <div className="flex items-center gap-3">
                        <HiCalendar className="w-8 h-8 text-blue-500" />
                        <div>
                            <span className="block text-xl font-black text-white leading-none">{nextEvent ? nextEvent.date.split(',')[0] : 'TBA'}</span>
                            <span className="text-xs font-bold text-stone-500 uppercase">Next Outreach</span>
                        </div>
                    </div>
                </div>
                <div className="bg-stone-950 border-l-4 border-green-500 p-6 shadow-lg">
                    <div className="flex items-center gap-3">
                        <HiChatAlt2 className="w-8 h-8 text-green-500" />
                        <div>
                            <span className="block text-3xl font-black text-white leading-none">5</span>
                            <span className="text-xs font-bold text-stone-500 uppercase">New Testimonies</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Brief */}
                <div className="lg:col-span-2 bg-gradient-to-br from-orange-600 to-red-700 rounded-xl p-8 relative overflow-hidden shadow-2xl">
                    <HiFire className="absolute -right-10 -bottom-10 w-64 h-64 text-white opacity-10" />

                    <span className="inline-block px-3 py-1 bg-white/20 text-white text-[10px] font-bold uppercase rounded mb-4 backdrop-blur-sm">
                        Urgent Campaign
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4 italic uppercase tracking-tight">
                        {nextEvent ? `"${nextEvent.title}"` : "Awaiting Operation"}
                    </h2>
                    <p className="text-orange-100 font-medium leading-relaxed mb-8 max-w-2xl">
                        {nextEvent ? `Mobilizing at ${nextEvent.location} on ${nextEvent.date} @ ${nextEvent.time}. ${nextEvent.urgency === 'high' ? 'High urgency deployment.' : 'Join the harvest.'}` : 'No immediate pending operations.'}
                    </p>
                    <div className="flex gap-4">
                        <button className="px-6 py-3 bg-white text-orange-600 font-black rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-2 uppercase tracking-wide text-sm shadow-lg">
                            Join Request <HiArrowRight className="w-5 h-5" />
                        </button>
                        <button className="px-6 py-3 bg-orange-800/30 text-white font-bold rounded-lg hover:bg-orange-800/50 transition-colors uppercase tracking-wide text-sm">
                            View Map
                        </button>
                    </div>
                </div>

                {/* My Assignments */}
                <div className="bg-stone-950 border border-stone-800 p-8 rounded-xl flex flex-col">
                    <h3 className="font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                        <HiClipboardList className="w-5 h-5 text-stone-500" />
                        My Schedule
                    </h3>

                    <div className="space-y-4 flex-1">
                        <div className="p-4 bg-stone-900 rounded-lg border-l-4 border-orange-500">
                            <span className="text-xs font-bold text-stone-500 block mb-1 uppercase">Sat, Dec 09 &bull; 10:00 AM</span>
                            <span className="text-white font-bold block text-lg">Street Evangelism</span>
                            <span className="text-xs text-stone-400 mt-1 block">Team Alpha @ High Street</span>
                        </div>
                        <div className="p-4 bg-stone-900 rounded-lg border-l-4 border-stone-700 opacity-60">
                            <span className="text-xs font-bold text-stone-500 block mb-1 uppercase">Tue, Dec 12 &bull; 06:00 PM</span>
                            <span className="text-white font-bold block text-lg">Follow-Up Calls</span>
                            <span className="text-xs text-stone-400 mt-1 block">Remote / Phone</span>
                        </div>
                    </div>

                    <button className="w-full mt-6 py-3 border border-stone-800 text-stone-400 font-bold uppercase text-xs rounded hover:border-orange-500 hover:text-orange-500 transition-colors">
                        Full Calendar
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-4">
                <button className="p-6 bg-stone-950 border border-stone-800 rounded-xl hover:border-green-500 transition-all text-left group">
                    <span className="text-green-500 font-bold text-xs uppercase mb-2 block">New Soul</span>
                    <span className="text-xl font-black text-white group-hover:text-green-400 transition-colors uppercase italic">Log Convert &rarr;</span>
                </button>
                <button className="p-6 bg-stone-950 border border-stone-800 rounded-xl hover:border-blue-500 transition-all text-left group">
                    <span className="text-blue-500 font-bold text-xs uppercase mb-2 block">Report</span>
                    <span className="text-xl font-black text-white group-hover:text-blue-400 transition-colors uppercase italic">Share Testimony &rarr;</span>
                </button>
            </div>
        </div>
    );
};

export default EvangelismDashboard;
