import React, { useState, useEffect } from 'react';
import { HiChatAlt2, HiHeart, HiPencilAlt } from 'react-icons/hi';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import type { WallPost } from '../../types/esther';
import WallPostModal from './WallPostModal';

const EstherForum: React.FC = () => {
    const [threads, setThreads] = useState<WallPost[]>([]);
    const [activeTab, setActiveTab] = useState<'all' | 'prayer' | 'testimony'>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'esther_wall'), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WallPost));
            setThreads(posts);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching wall posts:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredThreads = threads.filter(thread => {
        if (activeTab === 'all') return true;
        if (activeTab === 'prayer') return thread.category === 'Prayer Request';
        if (activeTab === 'testimony') return thread.category === 'Testimony';
        return true;
    });

    const formatTime = (timestamp: any) => {
        if (!timestamp) return 'Just now';
        const date = timestamp.toDate();
        const now = new Date();
        const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="grid lg:grid-cols-3 gap-8 font-sans h-[calc(100vh-140px)]">
            {/* Main Feed */}
            <div className="lg:col-span-2 flex flex-col h-full bg-white rounded-3xl border border-rose-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-rose-50 flex justify-between items-center bg-rose-50/30">
                    <h2 className="text-2xl font-serif text-rose-950">Prayer Wall & Testimonies</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'all' ? 'bg-rose-500 text-white' : 'text-gray-500 hover:bg-rose-50'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setActiveTab('prayer')}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'prayer' ? 'bg-rose-500 text-white' : 'text-gray-500 hover:bg-rose-50'}`}
                        >
                            Prayers
                        </button>
                        <button
                            onClick={() => setActiveTab('testimony')}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'testimony' ? 'bg-rose-500 text-white' : 'text-gray-500 hover:bg-rose-50'}`}
                        >
                            Testimonies
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {loading ? (
                        <div className="text-center py-12 text-gray-400">Loading posts...</div>
                    ) : filteredThreads.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">No posts yet. Be the first to share!</div>
                    ) : (
                        filteredThreads.map((thread) => (
                            <div key={thread.id} className="border-b border-gray-100 pb-6 last:border-0 hover:bg-gray-50/50 p-4 rounded-xl transition-colors">
                                <div className="flex items-start gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold shrink-0 ${thread.author === 'Anonymous' ? 'bg-gray-200 text-gray-500' : 'bg-rose-100 text-rose-600'}`}>
                                        {thread.author[0]}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <h3 className="font-bold text-gray-900">{thread.author}</h3>
                                            <span className="text-xs text-gray-400">{formatTime(thread.createdAt)}</span>
                                        </div>
                                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-2 ${thread.category === 'Testimony' ? 'bg-green-50 text-green-600' : 'bg-purple-50 text-purple-600'
                                            }`}>
                                            {thread.category}
                                        </span>
                                        <h4 className="font-serif text-lg text-rose-950 mb-2">{thread.title}</h4>
                                        <p className="text-gray-600 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                                            {thread.content}
                                        </p>
                                        <div className="flex gap-6 text-gray-400 text-sm">
                                            <button className="flex items-center hover:text-rose-500 transition-colors">
                                                <HiHeart className="w-5 h-5 mr-1" /> {thread.likes} Praying
                                            </button>
                                            <button className="flex items-center hover:text-blue-500 transition-colors">
                                                <HiChatAlt2 className="w-5 h-5 mr-1" /> {thread.comments} Comments
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Sidebar / Post New */}
            <div className="flex flex-col gap-6">
                <div className="bg-rose-600 text-white rounded-3xl p-8 text-center shadow-lg shadow-rose-200">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur">
                        <HiPencilAlt className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-serif mb-2">Share Your Heart</h3>
                    <p className="text-rose-100 text-sm mb-6">
                        Have a testimony of God's goodness? Need sisters to stand in the gap for you?
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full py-3 bg-white text-rose-600 font-bold rounded-xl hover:bg-rose-50 transition-colors shadow-sm"
                    >
                        Post to Wall
                    </button>
                </div>

                <div className="bg-white rounded-3xl border border-rose-100 p-6 flex-1">
                    <h3 className="text-gray-900 font-bold text-sm uppercase tracking-widest mb-4">Community Guidelines</h3>
                    <ul className="space-y-3 text-sm text-gray-500 list-disc list-inside leading-relaxed">
                        <li>Be kind, courteous, and respectful to all sisters.</li>
                        <li>Respect privacy. What is shared here stays here.</li>
                        <li>Focus on uplifting and encouraging one another.</li>
                        <li>No solicitation or self-promotion.</li>
                    </ul>
                </div>
            </div>

            {isModalOpen && (
                <WallPostModal
                    onClose={() => setIsModalOpen(false)}
                    onPostCreated={() => {
                        // Real-time listener handles the update, but we could add a toast here if we wanted extra feedback
                    }}
                />
            )}
        </div>
    );
};

export default EstherForum;
