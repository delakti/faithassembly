import React, { useState, useEffect } from 'react';
import { HiSpeakerphone, HiLightningBolt, HiExclamation } from 'react-icons/hi';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';

const EvangelismAnnouncements: React.FC = () => {
    const [briefs, setBriefs] = useState<any[]>([]);

    useEffect(() => {
        const q = query(collection(db, 'evangelism_briefs'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setBriefs(snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    // If date is manually entered string use it, else format createdAt
                    displayDate: data.date || (data.createdAt?.toDate ? data.createdAt.toDate().toLocaleDateString() : 'Just now')
                };
            }));
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="space-y-8 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <span className="text-orange-500 font-bold text-xs mb-2 block tracking-widest uppercase">Field Intel</span>
                    <h1 className="text-3xl font-black text-white uppercase italic tracking-tight">Campaign Briefs</h1>
                </div>
            </div>

            <div className="space-y-4">
                {briefs.length === 0 && (
                    <div className="py-12 text-center border border-dashed border-stone-800 rounded-xl">
                        <p className="text-stone-500 italic">No current intel briefs.</p>
                    </div>
                )}
                {briefs.map((item) => (
                    <div key={item.id} className="bg-stone-950 border border-stone-800 rounded-xl p-6 md:p-8 relative overflow-hidden group hover:border-orange-500/50 transition-all">
                        {item.priority === 'critical' && (
                            <div className="absolute top-0 right-0 p-4">
                                <span className="flex items-center gap-1 text-red-500 text-[10px] font-bold font-mono uppercase tracking-widest border border-red-900/50 bg-red-900/10 px-2 py-1 rounded animate-pulse">
                                    <HiExclamation className="w-3 h-3" /> Action Required
                                </span>
                            </div>
                        )}

                        <div className="flex items-start gap-4 mb-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center border-2 flex-shrink-0 ${item.priority === 'critical' ? 'bg-red-500/10 border-red-500 text-red-500' :
                                item.priority === 'warning' ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500' :
                                    'bg-stone-800 border-stone-700 text-stone-500'
                                }`}>
                                {item.priority === 'critical' ? <HiLightningBolt className="w-6 h-6" /> : <HiSpeakerphone className="w-6 h-6" />}
                            </div>
                            <div>
                                <h3 className={`text-xl font-bold mb-1 uppercase italic ${item.priority === 'critical' ? 'text-red-500' : 'text-white'
                                    }`}>{item.title}</h3>
                                <div className="flex items-center gap-3 text-xs font-bold text-stone-500 uppercase tracking-wide">
                                    <span>{item.displayDate}</span>
                                    <span>&bull;</span>
                                    <span className="text-stone-400">From: {item.author}</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-stone-300 leading-relaxed text-sm md:text-base border-l-4 border-stone-800 pl-6 ml-6 whitespace-pre-wrap">
                            {item.content}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EvangelismAnnouncements;
