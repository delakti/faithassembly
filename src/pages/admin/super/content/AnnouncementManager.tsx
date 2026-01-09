import React, { useState } from 'react';
import {
    HiSpeakerphone,
    HiPlus,
    HiTrash,
    HiPencil,
    HiEye
} from 'react-icons/hi';

interface Announcement {
    id: number;
    title: string;
    message: string;
    type: 'Info' | 'Warning' | 'Alert' | 'Success';
    audience: 'All' | 'Members' | 'Leaders' | 'Public';
    status: 'Active' | 'Draft' | 'Expired';
    date: string;
}

const AnnouncementManager: React.FC = () => {
    // Mock Data
    const [announcements, setAnnouncements] = useState<Announcement[]>([
        { id: 1, title: 'Easter Service Update', message: 'Service starts at 9 AM sharp.', type: 'Info', audience: 'All', status: 'Active', date: '2024-03-20' },
        { id: 2, title: 'Server Maintenance', message: 'Portal will be down on Friday night.', type: 'Warning', audience: 'Members', status: 'Active', date: '2024-03-25' },
        { id: 3, title: 'Leadership Meeting', message: 'Monthly sync rescheduled.', type: 'Alert', audience: 'Leaders', status: 'Draft', date: '2024-04-01' },
    ]);

    const [isEditing, setIsEditing] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const [currentAnnouncement, setCurrentAnnouncement] = useState<Partial<Announcement>>({});

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this announcement?')) {
            setAnnouncements(prev => prev.filter(a => a.id !== id));
        }
    };

    const getBadgeColor = (type: string) => {
        switch (type) {
            case 'Info': return 'bg-sky-100 text-sky-700';
            case 'Warning': return 'bg-amber-100 text-amber-700';
            case 'Alert': return 'bg-rose-100 text-rose-700';
            case 'Success': return 'bg-emerald-100 text-emerald-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Announcement Manager</h1>
                    <p className="text-slate-500">Create and manage global notifications.</p>
                </div>
                <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-sm"
                >
                    <HiPlus className="w-5 h-5" />
                    New Announcement
                </button>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600">Title</th>
                            <th className="p-4 font-semibold text-slate-600">Type</th>
                            <th className="p-4 font-semibold text-slate-600">Audience</th>
                            <th className="p-4 font-semibold text-slate-600">Status</th>
                            <th className="p-4 font-semibold text-slate-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {announcements.map((ann) => (
                            <tr key={ann.id} className="hover:bg-slate-50">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                            <HiSpeakerphone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">{ann.title}</p>
                                            <p className="text-xs text-slate-500 truncate w-48">{ann.message}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getBadgeColor(ann.type)}`}>
                                        {ann.type}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-600 text-sm">{ann.audience}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${ann.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                        ann.status === 'Draft' ? 'bg-gray-50 text-gray-600 border-gray-200' :
                                            'bg-rose-50 text-rose-600 border-rose-200'
                                        }`}>
                                        {ann.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <button className="p-2 text-slate-400 hover:text-sky-600 transition"><HiEye className="w-5 h-5" /></button>
                                    <button className="p-2 text-slate-400 hover:text-amber-600 transition"><HiPencil className="w-5 h-5" /></button>
                                    <button onClick={() => handleDelete(ann.id)} className="p-2 text-slate-400 hover:text-rose-600 transition"><HiTrash className="w-5 h-5" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {announcements.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        <HiSpeakerphone className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No announcements found.</p>
                    </div>
                )}
            </div>

            {/* Mock Editor Modal would go here */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-lg font-bold mb-4">New Announcement</h3>
                        <p className="text-slate-500 mb-6">This is a mock editor. Functionality to be connected to backend.</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                            <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Save Draft</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnnouncementManager;
