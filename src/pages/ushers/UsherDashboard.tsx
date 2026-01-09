import React from 'react';
import { HiCalendar, HiUserGroup, HiClipboardCheck, HiEmojiHappy } from 'react-icons/hi';
import { motion } from 'framer-motion';

const UsherDashboard: React.FC = () => {
    return (
        <div className="space-y-8 font-sans">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                    <span className="text-4xl font-black text-blue-600 mb-1">12</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Duty</span>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                    <span className="text-4xl font-black text-green-600 mb-1">98%</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Punctuality</span>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                    <span className="text-4xl font-black text-purple-600 mb-1">3</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Upcoming Swaps</span>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                    <span className="text-4xl font-black text-orange-600 mb-1">45</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Team Size</span>
                </div>
            </div>

            {/* Next Duty Card */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 rounded-xl overflow-hidden text-white flex flex-col md:flex-row shadow-xl"
            >
                <div className="p-8 md:p-10 flex-1">
                    <span className="inline-block px-3 py-1 bg-blue-600 text-white text-[10px] font-bold tracking-widest uppercase rounded mb-4">Next Assignment</span>
                    <h2 className="text-3xl font-bold mb-2">Sunday Morning Service</h2>
                    <p className="text-slate-400 mb-6 flex items-center gap-2">
                        <HiCalendar className="w-5 h-5 text-blue-500" /> Sunday, Nov 19 @ 08:30 AM
                    </p>
                    <div className="flex gap-8">
                        <div>
                            <span className="text-[10px] uppercase tracking-widest text-slate-500 block mb-1">Post</span>
                            <span className="font-bold text-lg">Main Sanctuary - Left Aisle</span>
                        </div>
                        <div>
                            <span className="text-[10px] uppercase tracking-widest text-slate-500 block mb-1">Team Leader</span>
                            <span className="font-bold text-lg">Deacon James</span>
                        </div>
                    </div>
                </div>
                <div className="bg-blue-900 p-8 md:w-64 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                        <HiClipboardCheck className="w-8 h-8 text-white" />
                    </div>
                    <button className="w-full py-3 bg-white text-blue-900 font-bold rounded shadow hover:bg-blue-50 transition-colors">
                        Confirm Duty
                    </button>
                    <p className="text-blue-300 text-xs mt-3">Please confirm 48h prior.</p>
                </div>
            </motion.div>

            {/* Quick Actions Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 p-8 rounded-xl hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                            <HiUserGroup className="w-6 h-6" />
                        </div>
                        <HiEmojiHappy className="w-6 h-6 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Headcount Submission</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-4">
                        Submit attendance counts for your section during the sermon.
                    </p>
                    <span className="text-blue-600 text-sm font-bold group-hover:underline">Submit Report →</span>
                </div>

                <div className="bg-white border border-slate-200 p-8 rounded-xl hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <HiCalendar className="w-6 h-6" />
                        </div>
                        <HiEmojiHappy className="w-6 h-6 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Request Swap</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-4">
                        Can't make it? Request a covering or swap shifts with another team member.
                    </p>
                    <span className="text-blue-600 text-sm font-bold group-hover:underline">Find Cover →</span>
                </div>
            </div>
        </div>
    );
};

export default UsherDashboard;
