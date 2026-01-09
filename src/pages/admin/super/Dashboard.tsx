import React from 'react';
import {
    HiUsers,
    HiCurrencyDollar,
    HiServer,
    HiGlobeAlt
} from 'react-icons/hi';

const SuperAdminDashboard: React.FC = () => {
    // Mock Data for now - Phase 2-3 will hook these up
    const STATS = [
        { label: 'Total Users', value: '1,248', change: '+12%', icon: <HiUsers className="w-6 h-6" />, color: 'bg-blue-500' },
        { label: 'Monthly Giving', value: '£42,500', change: '+5%', icon: <HiCurrencyDollar className="w-6 h-6" />, color: 'bg-green-500' },
        { label: 'Content Items', value: '356', change: '+24', icon: <HiServer className="w-6 h-6" />, color: 'bg-purple-500' },
        { label: 'Site Traffic', value: '15.4k', change: '+8%', icon: <HiGlobeAlt className="w-6 h-6" />, color: 'bg-orange-500' },
    ];

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {STATS.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${stat.color} shadow-lg shadow-${stat.color.replace('bg-', '')}/30`}>
                                {stat.icon}
                            </div>
                            <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                        <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions / Recent Activity Placeholder */}
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">System Health</h3>
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
                        <p className="text-gray-400">Activity Chart Placeholder</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>
                    <div className="space-y-3">
                        <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition">
                            Create System Announcement
                        </button>
                        <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition">
                            Audit User Permissions
                        </button>
                        <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition">
                            View Error Logs
                        </button>
                        <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition">
                            Manual Database Backup
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
