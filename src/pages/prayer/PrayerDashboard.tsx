import React, { useState, useEffect } from 'react';
import { HiClock, HiSparkles, HiShieldCheck, HiArrowRight } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { collection, query, orderBy, where, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';

const PrayerDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [urgentFocus, setUrgentFocus] = useState<any>(null);
    const [upcomingSlots, setUpcomingSlots] = useState<any[]>([]);

    useEffect(() => {
        // Fetch Urgent Focus (Latest high priority Intel)
        const qUrgent = query(
            collection(db, 'prayer_intel'),
            where('priority', '==', 'urgent'),
            orderBy('createdAt', 'desc'),
            limit(1)
        );
        const unsubscribeUrgent = onSnapshot(qUrgent, (snapshot) => {
            if (!snapshot.empty) {
                setUrgentFocus({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
            } else {
                setUrgentFocus(null);
            }
        });

        // Fetch Upcoming Slots (Just fetching first 2 sorted by day/time for now - simplified)
        // Ideally we'd query by actual time, but for this demo we'll just show the first few slots.
        const qSlots = query(collection(db, 'prayer_slots'), orderBy('day', 'asc'), limit(2));
        const unsubscribeSlots = onSnapshot(qSlots, (snapshot) => {
            setUpcomingSlots(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => {
            unsubscribeUrgent();
            unsubscribeSlots();
        };
    }, []);

    return (
        <div className="space-y-8 font-sans">
            {/* Main Alert Card */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-indigo-900/20 rounded-2xl overflow-hidden border border-indigo-500/30 shadow-sm flex flex-col md:flex-row relative"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                <div className="p-8 md:p-12 flex-1 relative z-10">
                    <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold tracking-widest uppercase rounded-full mb-4 border border-indigo-500/30">Urgent Focus</span>

                    {urgentFocus ? (
                        <>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">{urgentFocus.title}</h2>
                            <p className="text-slate-400 text-lg leading-relaxed max-w-xl mb-8 line-clamp-3">
                                {urgentFocus.content}
                            </p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">Pray for the Church</h2>
                            <p className="text-slate-400 text-lg leading-relaxed max-w-xl mb-8">
                                Stand in the gap for the body of Christ. Let us intercede for unity, strength, and revival in our midst.
                            </p>
                        </>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button onClick={() => navigate('/prayer/announcements')} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-900/30 hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2">
                            <HiSparkles className="w-5 h-5" /> {urgentFocus ? 'View Details' : 'View Intel'}
                        </button>
                        <button className="px-6 py-3 bg-transparent text-slate-300 border border-slate-700 font-bold rounded-xl hover:bg-slate-800 transition-colors">
                            Mark as Prayed
                        </button>
                    </div>
                </div>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Watch Schedule */}
                <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl">
                    <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                        <HiClock className="w-5 h-5 text-indigo-400" /> The Watch
                    </h3>
                    <div className="space-y-4">
                        {upcomingSlots.length > 0 ? (
                            upcomingSlots.map(slot => (
                                <div key={slot.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center group cursor-pointer hover:border-indigo-500/50 transition-colors">
                                    <div>
                                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide block mb-1">{slot.day} &bull; {slot.time}</span>
                                        <span className="text-lg font-bold text-slate-200 block">{slot.focus}</span>
                                    </div>
                                    <HiArrowRight className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-500 italic">No active watch slots.</p>
                        )}
                        <button onClick={() => navigate('/prayer/schedule')} className="w-full text-center text-xs text-slate-500 font-bold uppercase hover:text-indigo-400 mt-2">View Full Schedule</button>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl flex flex-col justify-between">
                    <div>
                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-6 border border-slate-700">
                            <HiShieldCheck className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">My Commitment</h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-4">
                            Track your prayer hours and manage your assigned slots for the month.
                        </p>
                    </div>
                    <button onClick={() => navigate('/prayer/schedule')} className="w-full py-3 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 hover:text-white transition-colors">
                        Manage Schedule
                    </button>
                </div>

                {/* Daily Word Context */}
                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-8 rounded-2xl flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
                    <h3 className="font-serif font-bold text-white text-xl mb-4 relative z-10">Scripture of the Day</h3>
                    <blockquote className="text-indigo-200 italic leading-relaxed mb-4 relative z-10">
                        "If my people, who are called by my name, will humble themselves and pray and seek my face and turn from their wicked ways, then I will hear from heaven..."
                    </blockquote>
                    <cite className="text-xs font-bold text-indigo-400 uppercase tracking-widest not-italic relative z-10">— 2 Chronicles 7:14</cite>
                </div>
            </div>
        </div>
    );
};

export default PrayerDashboard;
