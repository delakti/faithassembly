import React from 'react';
import { HiUserGroup, HiPlusCircle, HiChartBar, HiClipboardList } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const YouthLeaderPanel: React.FC = () => {
    // Mock Stats
    const STATS = [
        { label: 'Weekly Attendance', value: '85', change: '+12%', icon: <HiChartBar className="w-6 h-6" />, color: 'bg-green-500' },
        { label: 'Active Groups', value: '8', change: '+1', icon: <HiUserGroup className="w-6 h-6" />, color: 'bg-blue-500' },
        { label: 'Prayer Requests', value: '14', change: 'New', icon: <HiClipboardList className="w-6 h-6" />, color: 'bg-purple-500' },
    ];

    return (
        <div className="space-y-8">
            <div className="bg-red-600/10 border border-red-600/20 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center text-red-100">
                <div className="mb-4 md:mb-0">
                    <h2 className="text-2xl font-black italic uppercase">Leader Control Layer</h2>
                    <p className="opacity-80">Restricted access for Youth Leaders & Admins only.</p>
                </div>
                <button
                    onClick={() => toast.success('Report generated!')}
                    className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg font-bold transition-colors"
                >
                    Generate Report
                </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {STATS.map((stat, idx) => (
                    <div key={idx} className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <span className="bg-gray-800 text-green-400 text-xs px-2 py-1 rounded font-bold">{stat.change}</span>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                        <p className="text-gray-400 text-sm">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                        <HiPlusCircle className="w-5 h-5 mr-2 text-yellow-400" />
                        Quick Actions
                    </h3>
                    <div className="space-y-3">
                        {['Post Announcement', 'Create Event', 'Manage Squads', 'Review Reports'].map((action, i) => (
                            <button
                                key={i}
                                onClick={() => toast('Feature coming soon!')}
                                className="w-full text-left px-4 py-4 bg-black border border-gray-800 hover:border-yellow-400 rounded-xl text-gray-300 hover:text-white transition-all font-medium"
                            >
                                {action}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Recent Reports</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex items-center justify-between border-b border-gray-800 pb-4 last:border-0 last:pb-0">
                                <div>
                                    <p className="text-white font-bold">Inappropriate Comment</p>
                                    <p className="text-xs text-gray-500">Reported by Sarah J.</p>
                                </div>
                                <button className="text-xs bg-red-600/20 text-red-500 px-3 py-1 rounded-full font-bold hover:bg-red-600 hover:text-white transition-colors">
                                    Review
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default YouthLeaderPanel;
