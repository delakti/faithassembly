import React, { useState } from 'react';
import { HiCheck, HiSpeakerphone } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

interface Brief {
    id: string;
    title: string;
    content: string;
    sender: string;
    timestamp: string;
    isPriority: boolean;
    isNew: boolean;
    read: boolean;
}

const UsherBriefs: React.FC = () => {
    // Mock Data - In real app, fetch from Firestore 'usher_briefs'
    const [briefs, setBriefs] = useState<Brief[]>([
        {
            id: '1',
            title: 'Uniform Protocol Update',
            content: 'Starting Sunday Feb 4th, all ushers are required to wear the new gold lapel pins. Please collect yours from the vestry before service.',
            sender: 'Head Usher',
            timestamp: '2 days ago',
            isPriority: true,
            isNew: true,
            read: false
        },
        {
            id: '2',
            title: 'Special Guests - Annual Convention',
            content: 'We are expecting a delegation from the HQ church this Sunday. Please reserve the first 3 rows in the center section for them.',
            sender: "Senior Pastor's Office",
            timestamp: 'Yesterday',
            isPriority: true,
            isNew: true,
            read: false
        },
        {
            id: '3',
            title: 'Monthly Training Workshop',
            content: "The next training session on 'Emergency Evacuation Procedures' is scheduled for Saturday at 10 AM. Attendance is mandatory for Squad Leaders.",
            sender: 'Training Coordinator',
            timestamp: '3 days ago',
            isPriority: false,
            isNew: false,
            read: true
        }
    ]);

    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const markAsRead = (id: string) => {
        setBriefs(prev => prev.map(b => b.id === id ? { ...b, read: true, isNew: false } : b));
        toast.success("Marked as read");
        // In real app, update Firestore user sub-collection or similar
    };

    const filteredBriefs = filter === 'all' ? briefs : briefs.filter(b => !b.read);
    const unreadCount = briefs.filter(b => !b.read).length;

    return (
        <div className="space-y-8 font-sans pb-20 max-w-5xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">Service Briefs</h1>
                    <p className="text-slate-500 font-medium mt-1">Important updates and instructions for the team.</p>
                </div>
                <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${filter === 'all' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        All Briefs
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={`px-4 py-2 text-sm font-bold rounded-md transition-all flex items-center gap-2 ${filter === 'unread' ? 'bg-amber-100 text-amber-900' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Unread Only
                        {unreadCount > 0 && <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
                    </button>
                </div>
            </header>

            <div className="space-y-4">
                {filteredBriefs.length > 0 ? (
                    filteredBriefs.map(brief => (
                        <div
                            key={brief.id}
                            className={`p-6 rounded-2xl border transition-all ${brief.read ? 'bg-white border-slate-200' : 'bg-white border-amber-300 shadow-md shadow-amber-100/50 ring-1 ring-amber-300'}`}
                        >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-none ${brief.isPriority ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                        <HiSpeakerphone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 flex-wrap mb-1">
                                            <h3 className={`text-lg font-bold ${brief.read ? 'text-slate-800' : 'text-slate-900'}`}>{brief.title}</h3>
                                            {brief.isNew && !brief.read && <span className="bg-amber-100 text-amber-800 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-amber-200">New</span>}
                                            {brief.isPriority && <span className="bg-red-100 text-red-800 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-red-200 flex items-center gap-1">High Priority</span>}
                                        </div>
                                        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                                            <span>From: {brief.sender}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                            <span className="flex items-center gap-1 text-slate-500">
                                                {brief.timestamp}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {!brief.read && (
                                    <button
                                        onClick={() => markAsRead(brief.id)}
                                        className="flex-none px-3 py-1.5 text-xs font-bold uppercase text-amber-600 hover:bg-amber-50 rounded-lg transition-colors flex items-center gap-1"
                                    >
                                        <HiCheck className="w-4 h-4" /> Mark as Read
                                    </button>
                                )}
                            </div>
                            <p className="text-slate-600 leading-relaxed ml-16 text-sm md:text-base border-t border-slate-50 pt-4 md:border-none md:pt-0">
                                {brief.content}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                        <HiSpeakerphone className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-slate-900 font-bold text-lg">No briefs found</h3>
                        <p className="text-slate-500">You are all caught up!</p>
                        <button onClick={() => setFilter('all')} className="mt-4 text-amber-600 font-bold hover:underline text-sm">View All Briefs</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsherBriefs;
