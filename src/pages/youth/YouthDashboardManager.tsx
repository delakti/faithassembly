import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { toast } from 'react-hot-toast';
import { HiTrash, HiPaperAirplane } from 'react-icons/hi';
import type { YouthFeedPost } from '../../types/youth';

const YouthDashboardManager: React.FC = () => {
    const [newPost, setNewPost] = useState('');
    const [posts, setPosts] = useState<YouthFeedPost[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const q = query(collection(db, 'youth_feed'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as YouthFeedPost)));
        });
        return () => unsubscribe();
    }, []);

    const handlePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPost.trim()) return;

        setLoading(true);
        try {
            await addDoc(collection(db, 'youth_feed'), {
                content: newPost,
                author: auth.currentUser?.displayName || 'Youth Leader',
                role: 'Youth Leader',
                createdAt: serverTimestamp()
            });
            toast.success('Announcement posted!');
            setNewPost('');
        } catch (error) {
            console.error('Error posting:', error);
            toast.error('Failed to post');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this post?')) return;
        try {
            await deleteDoc(doc(db, 'youth_feed', id));
            toast.success('Post deleted');
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
                <h2 className="text-2xl font-black text-white italic uppercase mb-6">Post Update</h2>
                <form onSubmit={handlePost}>
                    <textarea
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        placeholder="What's happening? (New event info, retreat details, scripture...)"
                        className="w-full bg-black border border-gray-800 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 h-32 mb-4"
                    />
                    <button
                        type="submit"
                        disabled={loading || !newPost.trim()}
                        className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wide flex items-center gap-2 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Posting...' : <><HiPaperAirplane className="w-5 h-5 transform rotate-90" /> Post Announcement</>}
                    </button>
                </form>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
                <h2 className="text-2xl font-black text-white italic uppercase mb-6">Active Feed</h2>
                <div className="space-y-4">
                    {posts.length === 0 && <p className="text-gray-500">No active posts.</p>}
                    {posts.map((post) => (
                        <div key={post.id} className="bg-black border border-gray-800 rounded-xl p-6 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-purple-400 font-bold">{post.author}</span>
                                    <span className="text-gray-600 text-xs uppercase border border-gray-700 px-1 rounded">{post.role}</span>
                                </div>
                                <p className="text-gray-300">{post.content}</p>
                            </div>
                            <button
                                onClick={() => handleDelete(post.id)}
                                className="text-gray-600 hover:text-red-500 p-2"
                            >
                                <HiTrash className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default YouthDashboardManager;
