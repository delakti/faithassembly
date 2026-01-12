import React, { useState, useEffect } from 'react';
import { HiChat, HiPaperClip } from 'react-icons/hi';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';

const PrayerAnnouncements: React.FC = () => {
    const [intel, setIntel] = useState<any[]>([]);

    useEffect(() => {
        const q = query(collection(db, 'prayer_intel'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setIntel(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="space-y-8 font-sans text-slate-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                <div className="border-l-4 border-indigo-500 pl-6">
                    <span className="text-indigo-400 font-bold tracking-widest uppercase text-xs mb-2 block">Updates</span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">Spiritual Intel</h1>
                    <p className="text-slate-400 font-medium mt-2 max-w-2xl">
                        Stay informed on what the Spirit is saying to the church.
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Main Feed */}
                <div className="md:col-span-2 space-y-6">
                    {intel.length === 0 && (
                        <div className="p-8 text-center text-slate-500 italic bg-slate-900/30 rounded-xl border border-slate-800">
                            No active intelligence reports.
                        </div>
                    )}
                    {intel.map((post) => (
                        <div key={post.id} className={`bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 hover:border-slate-700 transition-colors ${post.priority === 'urgent' ? 'border-l-4 border-l-red-500' : ''}`}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-900/30 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/20">
                                    {post.author?.charAt(0) || 'A'}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                                        {post.author}
                                        {post.priority === 'urgent' && <span className="text-[10px] bg-red-900 text-red-400 px-2 py-0.5 rounded font-bold uppercase">Urgent</span>}
                                    </h3>
                                    <span className="text-xs text-slate-500 uppercase tracking-wide">{post.role} &bull; {post.date}</span>
                                </div>
                            </div>

                            <h2 className="text-xl font-bold text-white mb-3">{post.title}</h2>
                            <p className="text-slate-300 leading-relaxed mb-6 whitespace-pre-line">
                                {post.content}
                            </p>

                            <div className="flex items-center gap-4 text-sm font-bold text-slate-500 border-t border-slate-800 pt-4">
                                <button className="flex items-center gap-2 hover:text-indigo-400 transition-colors">
                                    <HiChat className="w-5 h-5" /> Response
                                </button>
                                {post.attachments > 0 && (
                                    <button className="flex items-center gap-2 hover:text-indigo-400 transition-colors">
                                        <HiPaperClip className="w-5 h-5" /> Resource
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-indigo-900/20 rounded-2xl p-6 border border-indigo-500/20">
                        <h3 className="font-serif font-bold text-lg text-white mb-4">Weekly Focus</h3>
                        <p className="text-slate-300 text-sm leading-relaxed mb-4">
                            This week we are praying for <strong>Families & Marriages</strong>.
                        </p>
                        <ul className="text-xs text-slate-400 list-disc list-inside space-y-1">
                            <li>Unity in the home</li>
                            <li>Prodigal children returning</li>
                            <li>Godly communication</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrayerAnnouncements;
