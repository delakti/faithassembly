
import React, { useState, useEffect } from 'react';
import { HiUserAdd, HiCalendar, HiChatAlt2, HiClipboardList, HiArrowRight, HiFire } from 'react-icons/hi';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import type { EvangelismEvent } from '../../types/evangelism';

const EvangelismDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [nextEvent, setNextEvent] = useState<EvangelismEvent | null>(null);
    const [stats, setStats] = useState({
        soulsWon: 0,
        followUps: 0,
        testimonies: 0
    });
    const [schedule, setSchedule] = useState<EvangelismEvent[]>([]);

    useEffect(() => {
        // Fetch Next Event
        const qEvent = query(collection(db, 'evangelism_events'), orderBy('date', 'asc'), where('status', '==', 'open'), limit(1));
        const unsubEvent = onSnapshot(qEvent, (snapshot) => {
            if (!snapshot.empty) {
                setNextEvent({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as EvangelismEvent);
            } else {
                setNextEvent(null);
            }
        });

        // Fetch Schedule (Next 3 events)
        const qSchedule = query(collection(db, 'evangelism_events'), orderBy('date', 'asc'), where('status', '==', 'open'), limit(3));
        const unsubSchedule = onSnapshot(qSchedule, (snapshot) => {
            setSchedule(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EvangelismEvent)));
        });

        // Fetch Stats (Real-time)
        const unsubConverts = onSnapshot(collection(db, 'evangelism_converts'), (snapshot) => {
            const allConverts = snapshot.docs.map(doc => doc.data());
            const souls = allConverts.length;
            const followUps = allConverts.filter((c: any) => c.status && c.status !== 'New').length;

            setStats(prev => ({ ...prev, soulsWon: souls, followUps: followUps }));
        });

        const unsubStories = onSnapshot(collection(db, 'evangelism_stories'), (snapshot) => {
            setStats(prev => ({ ...prev, testimonies: snapshot.size }));
        });

        return () => {
            unsubEvent();
            unsubSchedule();
            unsubConverts();
            unsubStories();
        };
    }, []);

    return (
        <div className="space-y-6 font-sans">
            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-stone-950 border-l-4 border-orange-500 p-6 shadow-lg">
                    <div className="flex items-center gap-3">
                        <HiUserAdd className="w-8 h-8 text-orange-500" />
                        <div>
                            <span className="block text-3xl font-black text-white leading-none">{stats.soulsWon}</span>
                            <span className="text-xs font-bold text-stone-500 uppercase">Souls Won</span>
                        </div>
                    </div>
                </div>
                <div className="bg-stone-950 border-l-4 border-yellow-500 p-6 shadow-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 font-black text-sm">{stats.followUps}</div>
                        <div>
                            <span className="block text-3xl font-black text-white leading-none">{stats.followUps}</span>
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
                            <span className="block text-3xl font-black text-white leading-none">{stats.testimonies}</span>
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
                        {nextEvent ? 'Active Operation' : 'Status Report'}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4 italic uppercase tracking-tight">
                        {nextEvent ? `"${nextEvent.title}"` : "Awaiting Operation"}
                    </h2>
                    <p className="text-orange-100 font-medium leading-relaxed mb-8 max-w-2xl">
                        {nextEvent ? `Mobilizing at ${nextEvent.location} on ${nextEvent.date} @ ${nextEvent.time}. ${nextEvent.urgency === 'high' ? 'High urgency deployment.' : 'Join the harvest.'}` : 'No immediate pending operations. Check back for upcoming crusade details.'}
                    </p>
                    <div className="flex gap-4">
                        {nextEvent && (
                            <button className="px-6 py-3 bg-white text-orange-600 font-black rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-2 uppercase tracking-wide text-sm shadow-lg">
                                Join Request <HiArrowRight className="w-5 h-5" />
                            </button>
                        )}
                        <button onClick={() => navigate('/evangelism/schedule')} className="px-6 py-3 bg-orange-800/30 text-white font-bold rounded-lg hover:bg-orange-800/50 transition-colors uppercase tracking-wide text-sm">
                            View Calendar
                        </button>
                    </div>
                </div>

                {/* My Assignments */}
                <div className="bg-stone-950 border border-stone-800 p-8 rounded-xl flex flex-col">
                    <h3 className="font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                        <HiClipboardList className="w-5 h-5 text-stone-500" />
                        Operation Schedule
                    </h3>

                    <div className="space-y-4 flex-1">
                        {schedule.length === 0 && <p className="text-stone-600 text-sm">No upcoming operations.</p>}
                        {schedule.map((evt, idx) => (
                            <div key={evt.id} className={`p-4 bg-stone-900 rounded-lg border-l-4 ${idx === 0 ? 'border-orange-500' : 'border-stone-700 opacity-60'}`}>
                                <span className="text-xs font-bold text-stone-500 block mb-1 uppercase">{evt.date} &bull; {evt.time}</span>
                                <span className="text-white font-bold block text-lg">{evt.title}</span>
                                <span className="text-xs text-stone-400 mt-1 block">{evt.location}</span>
                            </div>
                        ))}
                    </div>

                    <button onClick={() => navigate('/evangelism/schedule')} className="w-full mt-6 py-3 border border-stone-800 text-stone-400 font-bold uppercase text-xs rounded hover:border-orange-500 hover:text-orange-500 transition-colors">
                        Full Calendar
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-4">
                <button onClick={() => navigate('/evangelism/admin')} className="p-6 bg-stone-950 border border-stone-800 rounded-xl hover:border-green-500 transition-all text-left group">
                    <span className="text-green-500 font-bold text-xs uppercase mb-2 block">New Soul</span>
                    <span className="text-xl font-black text-white group-hover:text-green-400 transition-colors uppercase italic">Log Convert &rarr;</span>
                </button>
                <button onClick={() => navigate('/evangelism/testimonies')} className="p-6 bg-stone-950 border border-stone-800 rounded-xl hover:border-blue-500 transition-all text-left group">
                    <span className="text-blue-500 font-bold text-xs uppercase mb-2 block">Report</span>
                    <span className="text-xl font-black text-white group-hover:text-blue-400 transition-colors uppercase italic">Share Testimony &rarr;</span>
                </button>
            </div>
        </div>
    );
};

export default EvangelismDashboard;
