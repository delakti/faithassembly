import React from 'react';
import { Link } from 'react-router-dom';
import { HiUserGroup, HiCurrencyPound, HiCalendar, HiSpeakerphone, HiChevronRight, HiClock } from 'react-icons/hi';

const UsherDashboard: React.FC = () => {
    return (
        <div className="space-y-8 font-sans">
            {/* Header / Welcome */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">Station Overview</h1>
                    <p className="text-slate-500 font-medium mt-1">Order and Hospitality. Welcome back, Officer.</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">
                    <HiClock className="w-5 h-5 text-amber-600" />
                    <span className="font-bold text-slate-700 text-sm">Sunday Service: 09:30 AM (Active)</span>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Attendance */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <HiUserGroup className="w-24 h-24 text-slate-900" />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Total Attendance</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-slate-900">482</span>
                        <span className="text-xs font-bold text-green-500 bg-green-50 px-1.5 py-0.5 rounded border border-green-100">+12%</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-2">vs. last week</p>
                </div>

                {/* Offering Status */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <HiCurrencyPound className="w-24 h-24 text-amber-500" />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Offering Status</span>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-slate-900">Auditing...</span>
                    </div>
                    <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5">
                        <div className="bg-amber-500 h-1.5 rounded-full w-2/3 animate-pulse"></div>
                    </div>
                    <p className="text-sm text-slate-500 mt-2">2/3 counts confirmed</p>
                </div>

                {/* Next Duty */}
                <div className="bg-slate-900 p-6 rounded-xl shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <HiCalendar className="w-24 h-24 text-white" />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">My Assignment</span>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-white">Left Aisle (Front)</span>
                        <span className="text-sm font-medium text-amber-500 mt-1">Team Alpha • Week B</span>
                    </div>
                    <Link to="/ushering/schedule" className="mt-4 block w-full text-center text-xs font-bold text-white border border-slate-700 bg-slate-800 px-3 py-2 rounded hover:bg-slate-700 transition-colors">
                        View Rota
                    </Link>
                </div>

                {/* Open Tasks */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">Pending Actions</span>
                    <div className="space-y-3">
                        <Link to="/ushering/attendance" className="flex items-center justify-between text-sm group cursor-pointer">
                            <span className="text-slate-700 flex items-center gap-2 group-hover:text-amber-600 transition-colors">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span> Sign Count Sheet
                            </span>
                            <HiChevronRight className="text-slate-400 group-hover:text-amber-600 transition-colors" />
                        </Link>
                        <Link to="/ushering/stock" className="flex items-center justify-between text-sm group cursor-pointer">
                            <span className="text-slate-700 flex items-center gap-2 group-hover:text-amber-600 transition-colors">
                                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Stock Check (Env.)
                            </span>
                            <HiChevronRight className="text-slate-400 group-hover:text-amber-600 transition-colors" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Briefs / Notices */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-serif font-bold text-slate-900 text-lg flex items-center gap-2">
                        <HiSpeakerphone className="text-amber-600" /> Briefings
                    </h3>
                    <Link to="/ushering/announcements" className="text-sm font-bold text-amber-600 hover:text-amber-700">View All</Link>
                </div>
                <div className="divide-y divide-slate-100">
                    <div className="p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3 mb-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-600 border border-red-200">Urgent</span>
                            <span className="text-xs text-slate-400 font-medium">10 mins ago</span>
                        </div>
                        <p className="text-slate-900 font-medium">Overflow car park is now full. Redirect all traffic to Side B.</p>
                    </div>
                    <div className="p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3 mb-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-600 border border-blue-200">Info</span>
                            <span className="text-xs text-slate-400 font-medium">Yesterday</span>
                        </div>
                        <p className="text-slate-900 font-medium">New communion tray protocols are effective immediately. Please review the doc.</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default UsherDashboard;
