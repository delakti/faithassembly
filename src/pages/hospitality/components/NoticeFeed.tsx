import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase';
import { HiMail, HiSparkles } from 'react-icons/hi';

const NoticeFeed: React.FC = () => {
    const [notices, setNotices] = useState<any[]>([]);

    useEffect(() => {
        const q = query(collection(db, 'hospitality_notices'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setNotices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    if (notices.length === 0) {
        return (
            <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center py-12">
                <p className="text-stone-400 italic">No notices posted yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {notices.map((notice) => (
                <div key={notice.id} className="bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-sm animate-fade-in">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                            {notice.author?.charAt(0) || 'A'}
                        </div>
                        <div>
                            <h4 className="font-bold text-stone-900 text-sm">{notice.author || 'Team Lead'}</h4>
                            <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">
                                {notice.role || 'Admin'} • {notice.createdAt ? new Date(notice.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                            </p>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-stone-900 mb-2">{notice.title}</h3>
                    <p className="text-stone-600 leading-relaxed mb-6 whitespace-pre-wrap">{notice.content}</p>

                    <div className="pt-4 border-t border-stone-100 flex gap-6 text-xs font-bold text-stone-400 uppercase tracking-widest">
                        <span className="flex items-center gap-2 hover:text-stone-600 cursor-pointer">
                            <HiMail className="w-4 h-4" /> {notice.commentsCount || 0} Comments
                        </span>
                        <span className="flex items-center gap-2 hover:text-stone-600 cursor-pointer">
                            <HiSparkles className="w-4 h-4" /> {notice.attachmentsCount || 0} Attachments
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NoticeFeed;
