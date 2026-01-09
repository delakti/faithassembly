import React, { useState } from 'react';
import { HiPlus, HiLockClosed, HiHand, HiCheck, HiGlobe } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const REQUESTS = [
    {
        id: 1,
        author: "Sister Mary",
        category: "Healing",
        date: "2 hours ago",
        content: "Please pray for my brother undergoing surgery tomorrow. Pray for the surgeon's hands and a swift recovery.",
        praying: 12,
        isPrivate: true,
        answered: false
    },
    {
        id: 2,
        author: "Pastor Solomon",
        category: "Church Growth",
        date: "Yesterday",
        content: "Let us intercede for the upcoming evangelism outreach. Pray for softened hearts and harvest of souls.",
        praying: 45,
        isPrivate: false,
        answered: false
    },
    {
        id: 3,
        author: "Anonymous",
        category: "Deliverance",
        date: "3 days ago",
        content: "Praying for a breakthrough in a family situation involving addiction. Asking for God's intervention.",
        praying: 28,
        isPrivate: true,
        answered: false
    }
];

const PrayerRequests: React.FC = () => {
    const [requests, setRequests] = useState(REQUESTS);

    const handlePray = (id: number) => {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, praying: r.praying + 1 } : r));
        toast.success('Prayer recorded. Heaven hears.');
    };

    return (
        <div className="space-y-8 font-sans text-slate-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                <div className="border-l-4 border-indigo-500 pl-6">
                    <span className="text-indigo-400 font-bold tracking-widest uppercase text-xs mb-2 block">Intercession</span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">Prayer Wall</h1>
                    <p className="text-slate-400 font-medium mt-2 max-w-2xl">
                        "Bear one another's burdens, and so fulfill the law of Christ." — Galatians 6:2
                    </p>
                </div>
                <button className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-900/30 hover:bg-indigo-500 transition-colors flex items-center gap-2">
                    <HiPlus className="w-5 h-5" /> Share Burden
                </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {requests.map((req) => (
                    <div key={req.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col relative group hover:border-indigo-500/30 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold border border-slate-700">
                                    {req.author.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">{req.author}</h3>
                                    <span className="text-xs text-slate-500 uppercase tracking-wide">{req.date}</span>
                                </div>
                            </div>
                            {req.isPrivate ? (
                                <HiLockClosed className="w-4 h-4 text-slate-600" title="Private Request" />
                            ) : (
                                <HiGlobe className="w-4 h-4 text-slate-600" title="Public Request" />
                            )}
                        </div>

                        <div className="mb-6 flex-1">
                            <span className="inline-block px-2 py-1 bg-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider rounded mb-3">
                                {req.category}
                            </span>
                            <p className="text-slate-300 leading-relaxed text-sm">
                                {req.content}
                            </p>
                        </div>

                        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                            <span className="text-xs font-bold text-indigo-400 flex items-center gap-1">
                                <HiHand className="w-4 h-4" /> {req.praying} Praying
                            </span>
                            <button
                                onClick={() => handlePray(req.id)}
                                className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-2"
                            >
                                <HiCheck className="w-3 h-3" /> I Prayed
                            </button>
                        </div>
                    </div>
                ))}

                {/* Add New Placeholder/Cta */}
                <div className="bg-slate-950 border border-dashed border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-indigo-500/30 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-slate-500 mb-4 group-hover:text-indigo-400 transition-colors">
                        <HiPlus className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-white mb-2">Submit a Request</h3>
                    <p className="text-slate-500 text-sm max-w-xs">
                        Share a testimony or a prayer point with the team. Confidentiality is maintained.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrayerRequests;
