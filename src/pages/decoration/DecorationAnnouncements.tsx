import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, orderBy, getDocs, addDoc, deleteDoc, doc, serverTimestamp, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { HiSpeakerphone, HiPlus, HiTrash, HiUserCircle } from 'react-icons/hi';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

interface Announcement {
    id: string;
    title: string;
    content: string;
    author: string;
    authorRole: string;
    timestamp: any;
    priority: boolean;
}

const DecorationAnnouncements: React.FC = () => {
    const auth = getAuth();
    const db = getFirestore();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLeader, setIsLeader] = useState(false);

    // Create Modal State
    const [showCreate, setShowCreate] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [isPriority, setIsPriority] = useState(false);

    useEffect(() => {
        checkRole();
        fetchAnnouncements();
    }, []);

    const checkRole = async () => {
        if (auth.currentUser) {
            const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
            if (userDoc.exists()) {
                const role = userDoc.data().role;
                if (['decor_leader', 'hospitality_leader', 'admin', 'super_admin'].includes(role)) {
                    setIsLeader(true);
                }
            }
        }
    };

    const fetchAnnouncements = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'decor_announcements'), orderBy('timestamp', 'desc'));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Announcement[];
            setAnnouncements(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load announcements");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'decor_announcements'), {
                title: newTitle,
                content: newContent,
                author: auth.currentUser?.displayName || 'Decoration Team',
                authorRole: isLeader ? 'Leader' : 'Member',
                timestamp: serverTimestamp(),
                priority: isPriority
            });
            toast.success("Announcement posted!");
            setShowCreate(false);
            setNewTitle('');
            setNewContent('');
            fetchAnnouncements();
        } catch (error) {
            console.error(error);
            toast.error("Failed to post announcement");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this announcement?")) return;
        try {
            await deleteDoc(doc(db, 'decor_announcements', id));
            setAnnouncements(prev => prev.filter(a => a.id !== id));
            toast.success("Deleted");
        } catch (error) {
            toast.error("Failed to delete");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold font-serif text-fuchsia-950">Team Messages</h1>
                    <p className="text-slate-500">Updates, inspiration, and planning notes.</p>
                </div>
                {isLeader && (
                    <button
                        onClick={() => setShowCreate(true)}
                        className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-fuchsia-700 transition"
                    >
                        <HiPlus className="w-5 h-5" /> New Post
                    </button>
                )}
            </div>

            {/* Create Modal */}
            {showCreate && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h2 className="text-xl font-bold mb-4">Post Announcement</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
                                <input
                                    className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-fuchsia-500 outline-none"
                                    value={newTitle}
                                    onChange={e => setNewTitle(e.target.value)}
                                    required
                                    placeholder="e.g., Christmas Decor Planning"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Message</label>
                                <textarea
                                    className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-fuchsia-500 outline-none h-32"
                                    value={newContent}
                                    onChange={e => setNewContent(e.target.value)}
                                    required
                                    placeholder="Brief team update..."
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="priority"
                                    checked={isPriority}
                                    onChange={e => setIsPriority(e.target.checked)}
                                    className="w-4 h-4 text-fuchsia-600 rounded"
                                />
                                <label htmlFor="priority" className="text-sm font-medium text-slate-700">Mark as High Priority</label>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-50 rounded-lg">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-fuchsia-600 text-white font-bold rounded-lg hover:bg-fuchsia-700">Post</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* List */}
            <div className="grid gap-4">
                {loading ? (
                    <div className="text-center py-12 text-slate-400">Loading messages...</div>
                ) : announcements.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                        <HiSpeakerphone className="w-12 h-12 text-slate-200 mx-auto mb-2" />
                        <p className="text-slate-500 font-medium">Quiet here so far.</p>
                        {isLeader && <p className="text-sm text-fuchsia-600 cursor-pointer" onClick={() => setShowCreate(true)}>Start the conversation</p>}
                    </div>
                ) : (
                    announcements.map(item => (
                        <div key={item.id} className={`bg-white p-6 rounded-2xl border shadow-sm relative group transition-all hover:shadow-md ${item.priority ? 'border-amber-200 bg-amber-50/30' : 'border-fuchsia-50'}`}>
                            {item.priority && (
                                <div className="absolute top-4 right-4 text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-full uppercase tracking-wider">
                                    Priority
                                </div>
                            )}

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 shrink-0">
                                    <HiUserCircle className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start pr-16">
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-900">{item.title}</h3>
                                            <p className="text-xs text-slate-500 mb-3 flex items-center gap-2">
                                                <span>{item.author} ({item.authorRole})</span>
                                                <span>•</span>
                                                <span>{item.timestamp ? format(item.timestamp.toDate(), 'PPP p') : 'Just now'}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="prose prose-sm text-slate-600 max-w-none">
                                        <p className="whitespace-pre-wrap">{item.content}</p>
                                    </div>
                                </div>
                            </div>

                            {isLeader && (
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="absolute bottom-4 right-4 p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    title="Delete Post"
                                >
                                    <HiTrash className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DecorationAnnouncements;
