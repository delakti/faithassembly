import React, { useState } from 'react';
import { HiSpeakerphone, HiClock, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const MOCK_ANNOUNCEMENTS = [
    {
        id: 1,
        title: "Uniform Protocol Update",
        content: "Starting Sunday Feb 4th, all ushers are required to wear the new gold lapel pins. Please collect yours from the vestry before service.",
        author: "Head Usher",
        date: "2 days ago",
        priority: "high",
        read: false
    },
    {
        id: 2,
        title: "Special Guests - Annual Convention",
        content: "We are expecting a delegation from the HQ church this Sunday. Please reserve the first 3 rows in the center section for them.",
        author: "Senior Pastor's Office",
        date: "Yesterday",
        priority: "high",
        read: false
    },
    {
        id: 3,
        title: "Monthly Training Workshop",
        content: "The next training session on 'Emergency Evacuation Procedures' is scheduled for Saturday at 10 AM. Attendance is mandatory for Squad Leaders.",
        author: "Training Coordinator",
        date: "3 days ago",
        priority: "normal",
        read: true
    }
];

const UsherAnnouncements: React.FC = () => {
    const [briefs, setBriefs] = useState(MOCK_ANNOUNCEMENTS);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const markAsRead = (id: number) => {
        setBriefs(prev => prev.map(b => b.id === id ? { ...b, read: true } : b));
        toast.success("Marked as read");
    };

    const filteredBriefs = filter === 'all'
        ? briefs
        : briefs.filter(b => !b.read);

    return (
        <div className="max-w-4xl mx-auto font-sans text-slate-900 space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">Service Briefs</h1>
                    <p className="text-slate-500 font-medium">Important updates and instructions for the team.</p>
                </div>
                <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${filter === 'all' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        All Briefs
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${filter === 'unread' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Unread Only
                        {briefs.filter(b => !b.read).length > 0 && (
                            <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                {briefs.filter(b => !b.read).length}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            <div className="grid gap-6">
                {filteredBriefs.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <HiCheckCircle className="w-12 h-12 text-green-200 mx-auto mb-4" />
                        <h3 className="text-slate-900 font-bold text-lg">All Caught Up!</h3>
                        <p className="text-slate-500 text-sm">You have no unread briefing notes.</p>
                    </div>
                ) : (
                    filteredBriefs.map(brief => (
                        <div
                            key={brief.id}
                            className={`group relative bg-white p-6 rounded-xl border transition-all hover:shadow-md ${brief.read ? 'border-slate-200 opacity-75 hover:opacity-100' : 'border-amber-200 shadow-sm border-l-4 border-l-amber-500'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${brief.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                        <HiSpeakerphone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-lg text-slate-900">{brief.title}</h3>
                                            {!brief.read && <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">New</span>}
                                            {brief.priority === 'high' && <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide flex items-center gap-1"><HiExclamationCircle /> High Priority</span>}
                                        </div>
                                        <p className="text-xs text-slate-400 font-medium flex items-center gap-4 mt-1">
                                            <span>From: {brief.author}</span>
                                            <span className="flex items-center gap-1"><HiClock className="w-3 h-3" /> {brief.date}</span>
                                        </p>
                                    </div>
                                </div>
                                {!brief.read && (
                                    <button
                                        onClick={() => markAsRead(brief.id)}
                                        className="text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline flex items-center gap-1"
                                    >
                                        <HiCheckCircle /> Mark as Read
                                    </button>
                                )}
                            </div>

                            <div className="pl-13 ml-0 md:ml-13 border-t border-slate-50 pt-4">
                                <p className="text-slate-600 leading-relaxed text-sm">{brief.content}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default UsherAnnouncements;
