import React from 'react';
import { HiClock, HiSparkles, HiShieldCheck, HiArrowRight } from 'react-icons/hi';
import { motion } from 'framer-motion';

const PrayerDashboard: React.FC = () => {
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
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">Pray for Healing</h2>
                    <p className="text-slate-400 text-lg leading-relaxed max-w-xl mb-8">
                        The pastoral team has requested focused intercession for Sister Elizabeth's recovery. Let us stand in the gap today.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-900/30 hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2">
                            <HiSparkles className="w-5 h-5" /> View Request
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
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center group cursor-pointer hover:border-indigo-500/50 transition-colors">
                            <div>
                                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide block mb-1">Today &bull; 06:00 AM</span>
                                <span className="text-lg font-bold text-slate-200 block">Morning Glory</span>
                            </div>
                            <HiArrowRight className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                        </div>
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center group cursor-pointer hover:border-indigo-500/50 transition-colors">
                            <div>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Tomorrow &bull; 12:00 AM</span>
                                <span className="text-lg font-bold text-slate-200 block">Midnight Watch</span>
                            </div>
                            <HiArrowRight className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                        </div>
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
                    <button className="w-full py-3 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 hover:text-white transition-colors">
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
