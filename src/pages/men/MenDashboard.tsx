import React from 'react';
import { HiFire, HiCalendar, HiUserGroup, HiArrowRight } from 'react-icons/hi';
import { motion } from 'framer-motion';

const MenDashboard: React.FC = () => {
    return (
        <div className="space-y-8 font-sans">
            {/* Hero / Verse of Day */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900 rounded-xl p-8 md:p-12 shadow-2xl relative overflow-hidden text-center md:text-left border border-slate-800"
            >
                <div className="relative z-10 max-w-3xl">
                    <span className="inline-block px-3 py-1 bg-indigo-900/50 text-indigo-400 text-xs font-black tracking-widest uppercase rounded border border-indigo-500/30 mb-6">Verse of the Day</span>
                    <blockquote className="font-serif text-3xl md:text-5xl text-white leading-tight mb-8 font-bold italic">
                        "Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged."
                    </blockquote>
                    <cite className="text-slate-400 font-bold not-italic block uppercase tracking-wide">— Joshua 1:9</cite>
                </div>
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group cursor-pointer">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                        <HiFire className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2 uppercase italic">Daily Challenge</h3>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed font-medium">Read **Romans 12** today. How does "renewing your mind" apply to your leadership?</p>
                    <span className="text-orange-600 text-xs font-bold uppercase tracking-wider flex items-center group-hover:translate-x-1 transition-transform">Accept Challenge <HiArrowRight className="ml-1" /></span>
                </div>

                <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group cursor-pointer">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <HiCalendar className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2 uppercase italic">Next Mission</h3>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed font-medium">Men's Prayer Breakfast. Saturday @ 0800 Hours. Church Hall.</p>
                    <span className="text-indigo-600 text-xs font-bold uppercase tracking-wider flex items-center group-hover:translate-x-1 transition-transform">RSVP Now <HiArrowRight className="ml-1" /></span>
                </div>

                <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group cursor-pointer">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-6 text-slate-600 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                        <HiUserGroup className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2 uppercase italic">Your Squad</h3>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed font-medium">Accountability Group "Alpha" meeting pending for Wednesday night.</p>
                    <span className="text-slate-900 text-xs font-bold uppercase tracking-wider flex items-center group-hover:translate-x-1 transition-transform">Check Status <HiArrowRight className="ml-1" /></span>
                </div>
            </div>

        </div>
    );
};

export default MenDashboard;
