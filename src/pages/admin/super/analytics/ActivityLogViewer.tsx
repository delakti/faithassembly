import React, { useState } from 'react';
import {
    HiExclamationCircle,
    HiCheckCircle,
    HiInformationCircle,
    HiSearch,
    HiFilter
} from 'react-icons/hi';

const ActivityLogViewer: React.FC = () => {
    // Mock Data
    const mockLogs = [
        { id: 1, user: 'Admin User', action: 'Updated Site Settings', module: 'System', timestamp: '2024-01-20 10:30 AM', status: 'success' },
        { id: 2, user: 'John Doe', action: 'Failed Login Attempt', module: 'Auth', timestamp: '2024-01-20 10:15 AM', status: 'error' },
        { id: 3, user: 'Sarah Smith', action: 'Created New Event', module: 'Events', timestamp: '2024-01-20 09:45 AM', status: 'success' },
        { id: 4, user: 'System', action: 'Backup Completed', module: 'System', timestamp: '2024-01-20 02:00 AM', status: 'info' },
        { id: 5, user: 'Admin User', action: 'Deleted User: guest_12', module: 'Users', timestamp: '2024-01-19 04:20 PM', status: 'warning' },
    ];

    const [logs] = useState(mockLogs);
    // const [filter, setFilter] = useState('all'); // Future feature

    const getIcon = (status: string) => {
        switch (status) {
            case 'success': return <HiCheckCircle className="w-5 h-5 text-emerald-500" />;
            case 'error': return <HiExclamationCircle className="w-5 h-5 text-rose-500" />;
            case 'warning': return <HiExclamationCircle className="w-5 h-5 text-amber-500" />;
            default: return <HiInformationCircle className="w-5 h-5 text-sky-500" />;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[600px]">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">System Activity Log</h2>
                    <p className="text-slate-500 text-sm">Monitor user actions and system events.</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search logs..."
                            className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none w-64"
                        />
                        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-slate-600 text-sm hover:bg-slate-50">
                        <HiFilter className="w-4 h-4" />
                        Filter
                    </button>
                </div>
            </div>

            {/* Logs List */}
            <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 sticky top-0 z-10">
                        <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <th className="p-4 border-b border-slate-100">Status</th>
                            <th className="p-4 border-b border-slate-100">User</th>
                            <th className="p-4 border-b border-slate-100">Action</th>
                            <th className="p-4 border-b border-slate-100">Module</th>
                            <th className="p-4 border-b border-slate-100">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        {getIcon(log.status)}
                                        <span className={`text-xs font-bold uppercase ${log.status === 'success' ? 'text-emerald-600' :
                                            log.status === 'error' ? 'text-rose-600' :
                                                log.status === 'warning' ? 'text-amber-600' : 'text-sky-600'
                                            }`}>
                                            {log.status}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-4 font-medium text-slate-800">{log.user}</td>
                                <td className="p-4 text-slate-600">{log.action}</td>
                                <td className="p-4">
                                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium">
                                        {log.module}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-500 text-sm font-mono">{log.timestamp}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center text-sm text-slate-500">
                <span>Showing {logs.length} events</span>
                <div className="flex gap-2">
                    <button className="px-3 py-1 border border-slate-200 rounded bg-white disabled:opacity-50" disabled>Previous</button>
                    <button className="px-3 py-1 border border-slate-200 rounded bg-white hover:bg-slate-50">Next</button>
                </div>
            </div>
        </div>
    );
};

export default ActivityLogViewer;
