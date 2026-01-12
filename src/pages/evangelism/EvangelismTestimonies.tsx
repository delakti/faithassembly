import React, { useState, useEffect } from 'react';
import { HiChat, HiHeart, HiShare, HiPencilAlt, HiX } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, updateDoc, doc, increment } from 'firebase/firestore';
import { db } from '../../firebase';
import { getAuth } from 'firebase/auth';

const EvangelismTestimonies: React.FC = () => {
    const [stories, setStories] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newStory, setNewStory] = useState({ title: '', content: '' });
    const [liked, setLiked] = useState<string[]>([]);
    const auth = getAuth();

    useEffect(() => {
        const q = query(collection(db, 'evangelism_stories'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setStories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    const handlePost = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const user = auth.currentUser;
            const authorName = user?.displayName || "Anonymous Evangelist";

            await addDoc(collection(db, 'evangelism_stories'), {
                ...newStory,
                author: authorName,
                likes: 0,
                comments: 0,
                createdAt: serverTimestamp(),
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
            });

            toast.success("Testimony Shared!");
            setIsModalOpen(false);
            setNewStory({ title: '', content: '' });
        } catch (error) {
            toast.error("Failed to share testimony");
        }
    };

    const handleLike = async (id: string, _currentLikes: number) => {
        if (liked.includes(id)) return;

        try {
            const storyRef = doc(db, 'evangelism_stories', id);
            await updateDoc(storyRef, {
                likes: increment(1)
            });
            setLiked([...liked, id]);
            toast.success("Amen!");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-8 font-sans relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <span className="text-orange-500 font-bold text-xs mb-2 block tracking-widest uppercase">Field Reports</span>
                    <h1 className="text-3xl font-black text-white uppercase italic tracking-tight">Testimonies</h1>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-sm rounded-lg shadow-lg hover:shadow-blue-600/20 transition-all flex items-center gap-2 whitespace-nowrap"
                >
                    <HiPencilAlt className="w-5 h-5" /> Share Report
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {stories.length === 0 && (
                    <div className="col-span-full py-12 text-center border border-dashed border-stone-800 rounded-xl">
                        <p className="text-stone-500 italic">No testimonies reported yet. Be the first!</p>
                    </div>
                )}
                {stories.map((story) => (
                    <div key={story.id} className="bg-stone-950 border border-stone-800 rounded-xl p-6 md:p-8 flex flex-col gap-4 hover:border-orange-500/30 transition-all">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center font-bold text-stone-500 uppercase">
                                    {story.author?.charAt(0) || 'A'}
                                </div>
                                <div>
                                    <span className="block text-white font-bold text-sm">{story.author}</span>
                                    <span className="block text-stone-500 text-xs font-mono uppercase">{story.date}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-white mb-2 italic">"{story.title}"</h3>
                            <p className="text-stone-400 leading-relaxed text-sm whitespace-pre-wrap">
                                {story.content}
                            </p>
                        </div>

                        <div className="mt-auto pt-6 border-t border-stone-800 flex items-center gap-6">
                            <button
                                onClick={() => handleLike(story.id, story.likes)}
                                className={`flex items-center gap-2 text-sm font-bold transition-colors ${liked.includes(story.id) ? 'text-orange-500' : 'text-stone-500 hover:text-orange-500'}`}
                            >
                                <HiHeart className="w-5 h-5" />
                                {story.likes || 0}
                            </button>
                            <button className="flex items-center gap-2 text-sm font-bold text-stone-500 hover:text-white transition-colors">
                                <HiChat className="w-5 h-5" />
                                {story.comments || 0}
                            </button>
                            <button className="flex items-center gap-2 text-sm font-bold text-stone-500 hover:text-white transition-colors ml-auto">
                                <HiShare className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-stone-900 w-full max-w-lg rounded-2xl border border-stone-800 shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-stone-800 flex justify-between items-center bg-stone-950">
                            <h3 className="text-xl font-black text-white italic uppercase">Share Report</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-stone-500 hover:text-white"><HiX className="w-6 h-6" /></button>
                        </div>
                        <form onSubmit={handlePost} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-stone-500 uppercase mb-2">Headline</label>
                                <input
                                    type="text"
                                    placeholder="E.g. Miracle on High Street"
                                    className="w-full bg-stone-950 border border-stone-800 rounded p-3 text-white font-bold focus:border-orange-500 focus:outline-none"
                                    value={newStory.title}
                                    onChange={e => setNewStory({ ...newStory, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-stone-500 uppercase mb-2">The Testimony</label>
                                <textarea
                                    placeholder="What did God do?"
                                    className="w-full bg-stone-950 border border-stone-800 rounded p-3 text-white h-32 focus:border-orange-500 focus:outline-none"
                                    value={newStory.content}
                                    onChange={e => setNewStory({ ...newStory, content: e.target.value })}
                                    required
                                />
                            </div>
                            <button className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-widest rounded transition-all">
                                Submit Report
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EvangelismTestimonies;
