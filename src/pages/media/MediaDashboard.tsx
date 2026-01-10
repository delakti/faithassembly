import React, { useState, useEffect } from 'react';
import { HiCalendar, HiServer, HiExclamationCircle, HiCheckCircle, HiArrowRight } from 'react-icons/hi';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import type { MediaBrief } from '../../types/media';

const MediaDashboard: React.FC = () => {
    const [brief, setBrief] = useState<MediaBrief | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBrief = async () => {
            try {
                const q = query(collection(db, 'media_briefs'), orderBy('date', 'desc'), limit(1));
                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    setBrief({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as MediaBrief);
                }
            } catch (error) {
                console.error("Error fetching brief:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBrief();
    }, []);

    return (
        <div className="space-y-6 font-sans">
            {/* Status Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-green-500/10 flex items-center justify-center border border-green-500/20 text-green-500">
                        <HiCheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-xs text-slate-500 font-mono uppercase block">Stream Status</span>
                        <span className="text-sm font-bold text-white">Online // Stable</span>
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-500">
                        <HiServer className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-xs text-slate-500 font-mono uppercase block">Storage</span>
                        <span className="text-sm font-bold text-white">45% Used</span>
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 text-yellow-500">
                        <HiCalendar className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-xs text-slate-500 font-mono uppercase block">Next Event</span>
                        <span className="text-sm font-bold text-white">Sunday Live</span>
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-red-500/10 flex items-center justify-center border border-red-500/20 text-red-500">
                        <HiExclamationCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-xs text-slate-500 font-mono uppercase block">Tickets</span>
                        <span className="text-sm font-bold text-white">2 Open</span>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Brief */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-8 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

                    <span className="inline-block px-2 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-mono font-bold uppercase rounded mb-4">
                        Production Brief
                    </span>
                    {loading ? (
                        <div className="animate-pulse space-y-4">
                            <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                            <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                        </div>
                    ) : brief ? (
                        <>
                            <h2 className="text-2xl font-bold text-white mb-4">{brief.title}</h2>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-2xl">
                                {brief.content}
                            </p>
                        </>
                    ) : (
                        <p className="text-slate-500 italic mb-6">No active briefs.</p>
                    )}
                    <button className="px-6 py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-500 transition-colors flex items-center gap-2 text-sm font-mono uppercase">
                        Access Assets <HiArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {/* My Rota */}
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                            Your Duties
                        </h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                                <span className="text-xs font-mono text-slate-500 block mb-1 uppercase">Sunday &bull; 09:00 AM</span>
                                <span className="text-white font-bold block">Camera 1 (Main)</span>
                            </div>
                            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 opacity-60">
                                <span className="text-xs font-mono text-slate-500 block mb-1 uppercase">Wed &bull; 07:00 PM</span>
                                <span className="text-white font-bold block">Livestream Ops</span>
                            </div>
                        </div>
                    </div>
                    <button className="w-full mt-6 py-2 border border-slate-700 text-slate-400 font-mono text-xs font-bold uppercase rounded hover:border-cyan-500 hover:text-cyan-400 transition-colors">
                        View Full Schedule
                    </button>
                </div>
            </div>

            {/* Quick Links */}
            <div className="grid md:grid-cols-3 gap-4">
                <button className="p-6 bg-slate-900 border border-slate-800 rounded-xl hover:border-cyan-500/40 hover:bg-slate-800 transition-all text-left group">
                    <span className="text-cyan-500 font-mono text-xs uppercase mb-2 block">Fault Report</span>
                    <span className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">Log Issue</span>
                </button>
                <button className="p-6 bg-slate-900 border border-slate-800 rounded-xl hover:border-cyan-500/40 hover:bg-slate-800 transition-all text-left group">
                    <span className="text-cyan-500 font-mono text-xs uppercase mb-2 block">Inventory</span>
                    <span className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">Request Gear</span>
                </button>
                <button className="p-6 bg-slate-900 border border-slate-800 rounded-xl hover:border-cyan-500/40 hover:bg-slate-800 transition-all text-left group">
                    <span className="text-cyan-500 font-mono text-xs uppercase mb-2 block">Knowledge Base</span>
                    <span className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">Tech Docs</span>
                </button>
            </div>
        </div>
    );
};

export default MediaDashboard;
