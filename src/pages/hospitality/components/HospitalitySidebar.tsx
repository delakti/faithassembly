import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase';

const HospitalitySidebar: React.FC = () => {
    const [content, setContent] = useState<any>({
        verse: { text: "Share with the Lord's people who are in need. Practice hospitality.", reference: "Romans 12:13" },
        discussions: []
    });

    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'hospitality_content', 'sidebar'), (doc) => {
            if (doc.exists()) {
                setContent(doc.data());
            }
        });
        return () => unsub();
    }, []);

    return (
        <div className="space-y-6">
            {/* Team Verse */}
            <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl">
                <h3 className="font-serif font-bold text-xl text-stone-900 mb-4">Team Verse</h3>
                <p className="text-stone-600 italic mb-4 leading-relaxed">
                    "{content.verse?.text || "Share with the Lord's people who are in need. Practice hospitality."}"
                </p>
                <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">— {content.verse?.reference || "Romans 12:13"}</span>
            </div>

            {/* Discussions */}
            <div className="bg-white border border-stone-200 p-6 rounded-2xl">
                <h3 className="font-bold text-stone-900 uppercase text-xs tracking-widest mb-4">Active Discussions</h3>
                <div className="space-y-4">
                    {content.discussions?.map((disc: any) => (
                        <div key={disc.id} className="border-b border-stone-100 pb-4 last:border-0 last:pb-0">
                            <h4 className="font-bold text-stone-800 text-sm hover:text-orange-600 cursor-pointer">{disc.title}</h4>
                            <p className="text-xs text-stone-400 mt-1">{disc.meta}</p>
                        </div>
                    ))}
                    {(!content.discussions || content.discussions.length === 0) && (
                        <p className="text-xs text-stone-400 italic">No active discussions.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HospitalitySidebar;
