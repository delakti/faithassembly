import React from 'react';
import { Link } from 'react-router-dom';
import {
    HiUsers,
    HiCurrencyDollar,
    HiServer,
    HiGlobeAlt,
    HiSpeakerphone,
    HiUserGroup,
    HiHeart,
    HiMusicNote,
    HiChatAlt2,
    HiVideoCamera,
    HiArrowRight,
    HiShieldCheck
} from 'react-icons/hi';

const SuperAdminDashboard: React.FC = () => {
    // Mock Data for now - Phase 2-3 will hook these up
    const STATS = [
        { label: 'Total Users', value: '1,248', change: '+12%', icon: <HiUsers className="w-6 h-6" />, color: 'bg-blue-500' },
        { label: 'Monthly Giving', value: '£42,500', change: '+5%', icon: <HiCurrencyDollar className="w-6 h-6" />, color: 'bg-green-500' },
        { label: 'Content Items', value: '356', change: '+24', icon: <HiServer className="w-6 h-6" />, color: 'bg-purple-500' },
        { label: 'Site Traffic', value: '15.4k', change: '+8%', icon: <HiGlobeAlt className="w-6 h-6" />, color: 'bg-orange-500' },
    ];

    const PORTALS = [
        { name: 'Evangelism', path: '/evangelism/dashboard', icon: <HiSpeakerphone className="w-6 h-6" />, color: 'bg-red-500', desc: 'Outreach & Souls' },
        { name: 'Ushers', path: '/ushering/dashboard', icon: <HiShieldCheck className="w-6 h-6" />, color: 'bg-amber-500', desc: 'Order & Security' },
        { name: 'Hospitality', path: '/hospitality/dashboard', icon: <HiHeart className="w-6 h-6" />, color: 'bg-pink-500', desc: 'Welcome & Care' },
        { name: 'Worship', path: '/worship/dashboard', icon: <HiMusicNote className="w-6 h-6" />, color: 'bg-purple-500', desc: 'Music & Creative' },
        { name: 'Prayer', path: '/prayer/dashboard', icon: <HiChatAlt2 className="w-6 h-6" />, color: 'bg-blue-500', desc: 'Intercession' },
        { name: 'Media', path: '/media/dashboard', icon: <HiVideoCamera className="w-6 h-6" />, color: 'bg-indigo-500', desc: 'Production & Tech' },
        { name: 'Men', path: '/men/dashboard', icon: <HiUserGroup className="w-6 h-6" />, color: 'bg-slate-700', desc: 'The Brotherhood' },
        { name: 'Esther', path: '/esther/dashboard', icon: <HiUserGroup className="w-6 h-6" />, color: 'bg-rose-500', desc: 'Women of Faith' },
        { name: 'Youth', path: '/youth/dashboard', icon: <HiUserGroup className="w-6 h-6" />, color: 'bg-yellow-500', desc: 'Next Gen' },
        { name: 'Members', path: '/members/dashboard', icon: <HiUsers className="w-6 h-6" />, color: 'bg-cyan-500', desc: 'Community Hub' },
    ];

    return (
        <div className="space-y-8 font-sans">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">System Overview</h1>
                    <p className="text-slate-500 text-sm">Welcome back, Super Admin.</p>
                </div>
                <div className="text-xs font-bold bg-red-100 text-red-600 px-3 py-1 rounded-full uppercase tracking-widest border border-red-200">
                    Master Control
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {STATS.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${stat.color} shadow-lg shadow-opacity-20`}>
                                {stat.icon}
                            </div>
                            <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wide mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Ministry Portals Grid */}
            <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <HiUserGroup className="text-slate-400" /> Ministry Portals
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {PORTALS.map((portal, idx) => (
                        <Link
                            key={idx}
                            to={portal.path}
                            className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all group relative overflow-hidden"
                        >
                            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
                                {React.cloneElement(portal.icon as React.ReactElement, { className: 'w-24 h-24' })}
                            </div>

                            <div className="relative z-10">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${portal.color} mb-4 shadow-md`}>
                                    {portal.icon}
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{portal.name}</h4>
                                <p className="text-sm text-slate-500 mt-1">{portal.desc}</p>

                                <div className="mt-4 flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:text-amber-500 transition-colors">
                                    Access Portal <HiArrowRight className="ml-1 w-3 h-3" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Quick Actions / Recent Activity Placeholder */}
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">System Health</h3>
                    <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-medium">Activity Chart Placeholder</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h3>
                    <div className="space-y-3">
                        <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-700 transition flex items-center justify-between group">
                            Create Announcement
                            <HiArrowRight className="text-slate-300 group-hover:text-slate-500" />
                        </button>
                        <Link to="/admin/super/groups" className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-700 transition flex items-center justify-between group">
                            Manage Groups
                            <HiArrowRight className="text-slate-300 group-hover:text-slate-500" />
                        </Link>
                        <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-700 transition flex items-center justify-between group">
                            Audit User Permissions
                            <HiArrowRight className="text-slate-300 group-hover:text-slate-500" />
                        </button>
                        <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-700 transition flex items-center justify-between group">
                            Manual Database Backup
                            <HiArrowRight className="text-slate-300 group-hover:text-slate-500" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
