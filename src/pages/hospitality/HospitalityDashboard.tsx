import React from 'react';
import { HiCalendar, HiUserGroup, HiChat, HiEmojiHappy } from 'react-icons/hi';
import { motion } from 'framer-motion';

const HospitalityDashboard: React.FC = () => {
    return (
        <div className="space-y-8 font-sans">
            {/* Main Welcome Card */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm flex flex-col md:flex-row relative"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-bl-full -mr-8 -mt-8 opacity-50"></div>

                <div className="p-8 md:p-12 flex-1 relative z-10">
                    <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-[10px] font-bold tracking-widest uppercase rounded-full mb-4">You are Needed</span>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-4">Ready to Serve?</h2>
                    <p className="text-stone-500 text-lg leading-relaxed max-w-xl mb-8">
                        "Hospitality is simply an opportunity to show love and care." Your next opportunity to create a welcoming atmosphere is coming up.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="px-6 py-3 bg-stone-800 text-white font-bold rounded-xl shadow hover:bg-stone-900 transition-colors flex items-center justify-center gap-2">
                            <HiCalendar className="w-5 h-5" /> View My Rota
                        </button>
                        <button className="px-6 py-3 bg-white text-stone-600 border border-stone-200 font-bold rounded-xl hover:bg-stone-50 transition-colors">
                            Swap Shift
                        </button>
                    </div>
                </div>

                <div className="bg-orange-50 p-8 md:w-80 border-l border-orange-100 flex flex-col justify-center">
                    <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
                        <HiCalendar className="w-5 h-5 text-orange-500" /> Next On Duty
                    </h3>
                    <div className="space-y-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-100">
                            <span className="text-xs font-bold text-orange-500 uppercase tracking-wide block mb-1">Sunday, Nov 19</span>
                            <span className="text-lg font-bold text-stone-800 block">Morning Service</span>
                            <span className="text-stone-500 text-sm">Coffee Team &bull; 08:00 AM</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Quick Actions Grid */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white border border-stone-200 p-8 rounded-2xl hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors mb-6">
                        <HiUserGroup className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-stone-800 mb-2">Team Directory</h3>
                    <p className="text-stone-500 text-sm leading-relaxed mb-4">
                        Connect with other volunteers and team leaders.
                    </p>
                    <span className="text-green-600 text-sm font-bold group-hover:underline">Meet the Family →</span>
                </div>

                <div className="bg-white border border-stone-200 p-8 rounded-2xl hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors mb-6">
                        <HiChat className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-stone-800 mb-2">Notices</h3>
                    <p className="text-stone-500 text-sm leading-relaxed mb-4">
                        Important updates regarding upcoming events and menu changes.
                    </p>
                    <span className="text-blue-600 text-sm font-bold group-hover:underline">Read Updates →</span>
                </div>

                <div className="bg-white border border-stone-200 p-8 rounded-2xl hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 group-hover:bg-yellow-500 group-hover:text-white transition-colors mb-6">
                        <HiEmojiHappy className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-stone-800 mb-2">New Volunteer?</h3>
                    <p className="text-stone-500 text-sm leading-relaxed mb-4">
                        Access training materials and the hospitality handbook.
                    </p>
                    <span className="text-yellow-600 text-sm font-bold group-hover:underline">Get Started →</span>
                </div>
            </div>
        </div>
    );
};

export default HospitalityDashboard;
