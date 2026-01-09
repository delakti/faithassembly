import React from 'react';
import { HiCalendar, HiMusicNote, HiMicrophone } from 'react-icons/hi';
import { motion } from 'framer-motion';

const WorshipDashboard: React.FC = () => {
    return (
        <div className="space-y-10 font-sans">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl h-80 flex items-center border border-white/10 group"
            >
                <div className="absolute inset-0">
                    <img src="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=1600&auto=format&fit=crop&q=80" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" alt="Concert" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
                </div>

                <div className="relative z-10 p-10 md:p-14 max-w-2xl">
                    <span className="inline-block px-3 py-1 bg-purple-600/30 text-purple-300 text-[10px] font-bold tracking-[0.2em] uppercase rounded border border-purple-500/30 mb-6 backdrop-blur-md">Upcoming Service</span>
                    <h2 className="text-4xl md:text-5xl font-serif text-white mb-4 leading-tight">Sunday Celebration Service</h2>
                    <p className="text-gray-300 text-lg mb-8 font-light">Setlist: Trust in God, Goodness of God, Way Maker (Key of G)</p>
                    <div className="flex gap-4">
                        <button className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors text-xs uppercase tracking-widest">
                            View Setlist
                        </button>
                        <button className="px-6 py-3 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-colors backdrop-blur text-xs uppercase tracking-widest border border-white/20">
                            Confirm Attendance
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Quick Actions Grid */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-neutral-900/50 backdrop-blur border border-white/10 p-8 rounded-2xl hover:border-yellow-500/50 transition-colors group cursor-pointer">
                    <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-6 group-hover:bg-yellow-500 group-hover:text-black transition-all text-yellow-500">
                        <HiCalendar className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">Rehearsals</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">Thursday Night Practice @ 19:00. Main Auditorium.</p>
                </div>

                <div className="bg-neutral-900/50 backdrop-blur border border-white/10 p-8 rounded-2xl hover:border-purple-500/50 transition-colors group cursor-pointer">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:bg-purple-500 group-hover:text-white transition-all text-purple-500">
                        <HiMusicNote className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">New Songs</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">"I Speak Jesus" added to library. Listen to the demo track now.</p>
                </div>

                <div className="bg-neutral-900/50 backdrop-blur border border-white/10 p-8 rounded-2xl hover:border-pink-500/50 transition-colors group cursor-pointer">
                    <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-6 group-hover:bg-pink-500 group-hover:text-white transition-all text-pink-500">
                        <HiMicrophone className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">Vocal Training</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">Technique workshop for Sopranos this Saturday at 10am.</p>
                </div>
            </div>
        </div>
    );
};

export default WorshipDashboard;
