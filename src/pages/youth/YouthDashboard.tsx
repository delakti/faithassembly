import React, { useState, useEffect } from 'react';
import { HiCalendar, HiChatAlt2, HiPlay } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { collection, query, orderBy, limit, onSnapshot, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import type { YouthFeedPost, YouthEvent } from '../../types/youth';
import { format } from 'date-fns';
import { formatDistanceToNow } from 'date-fns';

const YouthDashboard: React.FC = () => {
    const [feedPosts, setFeedPosts] = useState<YouthFeedPost[]>([]);
    const [nextEvent, setNextEvent] = useState<YouthEvent | null>(null);

    useEffect(() => {
        // Fetch Feed
        const q = query(collection(db, 'youth_feed'), orderBy('createdAt', 'desc'), limit(5));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setFeedPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as YouthFeedPost)));
        });

        // Fetch Next Event
        const fetchNextEvent = async () => {
            const now = new Date().toISOString();
            const eventsQ = query(
                collection(db, 'youth_events'),
                where('date', '>=', now),
                orderBy('date', 'asc'),
                limit(1)
            );
            const snapshot = await getDocs(eventsQ);
            if (!snapshot.empty) {
                setNextEvent({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as YouthEvent);
            }
        };

        fetchNextEvent();
        return () => unsubscribe();
    }, []);

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "EEE, MMM do @ h:mm a");
        } catch {
            return dateString;
        }
    };

    const formatTimeAgo = (timestamp: any) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return formatDistanceToNow(date, { addSuffix: true });
    };

    return (
        <div className="space-y-8">
            {/* Welcome Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-purple-900/50"
            >
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-4xl md:text-5xl font-black italic mb-4">WHAT'S GOOD? 👋</h1>
                    <p className="text-lg text-purple-100 font-medium mb-8">
                        Welcome to the fam. Check out what's happening this week, connect with your squad, and stay fired up.
                    </p>
                    <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-bold hover:bg-yellow-400 hover:text-black transition-all transform hover:scale-105 shadow-lg">
                        View Schedule
                    </button>
                </div>
                {/* Decorative Elements */}
                <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 transform origin-bottom-right"></div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Stats / Quick Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:border-yellow-400/50 transition-colors group"
                >
                    <div className="w-12 h-12 bg-yellow-400/20 text-yellow-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-yellow-400 group-hover:text-black transition-all">
                        <HiCalendar className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Next Event</h3>
                    {nextEvent ? (
                        <>
                            <p className="text-gray-400 text-sm">{nextEvent.title}</p>
                            <p className="text-white font-bold mt-1">{formatDate(nextEvent.date)}</p>
                        </>
                    ) : (
                        <p className="text-gray-500 text-sm">No upcoming events.</p>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:border-purple-400/50 transition-colors group"
                >
                    <div className="w-12 h-12 bg-purple-400/20 text-purple-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-400 group-hover:text-white transition-all">
                        <HiChatAlt2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Squad Chat</h3>
                    <p className="text-gray-400 text-sm">3 new messages</p>
                    <p className="text-white font-bold mt-1">High School Boys</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:border-pink-400/50 transition-colors group"
                >
                    <div className="w-12 h-12 bg-pink-400/20 text-pink-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-pink-400 group-hover:text-white transition-all">
                        <HiPlay className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Latest Word</h3>
                    <p className="text-gray-400 text-sm">Pastor Tim</p>
                    <p className="text-white font-bold mt-1">"Unstoppable Faith"</p>
                </motion.div>
            </div>

            {/* Announcement Feed */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8">
                <h3 className="text-2xl font-black text-white italic mb-6 uppercase">The Feed</h3>
                <div className="space-y-6">
                    {feedPosts.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No new updates. Stay tuned!</p>
                    )}
                    {feedPosts.map((post) => (
                        <div key={post.id} className="flex gap-4 border-b border-gray-800 pb-6 last:border-0 last:pb-0">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold shrink-0">
                                {post.author.charAt(0)}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-white">{post.author}</span>
                                    <span className="text-xs text-gray-500">{formatTimeAgo(post.createdAt)}</span>
                                </div>
                                <p className="text-gray-300 leading-relaxed">
                                    {post.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default YouthDashboard;
