import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { HiPlus, HiTrash, HiMail, HiSpeakerphone } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

interface Announcement {
    id: string;
    title: string;
    content: string;
    createdAt: any;
    authorName: string;
}

const HouseAdminCommunication: React.FC = () => {
    const db = getFirestore();
    const auth = getAuth();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(false);

    // Mock data for initial dev
    const mockAnnouncements: Announcement[] = [
        { id: '1', title: 'Monthly Leaders Meeting', content: 'Please attend the mandatory meeting this Friday.', createdAt: { seconds: Date.now() / 1000 }, authorName: 'Superintendent' },
        { id: '2', title: 'New Reporting Guidelines', content: 'Please submit PDF reports by the 5th of each month.', createdAt: { seconds: (Date.now() - 86400000) / 1000 }, authorName: 'Admin' },
    ];

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const q = query(collection(db, 'house_announcements'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.empty ? mockAnnouncements : querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Announcement[];
            setAnnouncements(data);
        } catch (error) {
            console.error("Error fetching announcements:", error);
            setAnnouncements(mockAnnouncements);
        }
    };

    const handlePost = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!auth.currentUser) throw new Error("Not authenticated");

            await addDoc(collection(db, 'house_announcements'), {
                title,
                content,
                createdAt: serverTimestamp(),
                authorId: auth.currentUser.uid,
                authorName: auth.currentUser.displayName || 'Superintendent'
            });

            toast.success("Announcement Posted");
            setTitle('');
            setContent('');
            fetchAnnouncements();
        } catch (error) {
            console.error(error);
            toast.error("Failed to post");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this announcement?")) return;
        try {
            await deleteDoc(doc(db, 'house_announcements', id));
            toast.success("Deleted");
            fetchAnnouncements();
        } catch (error) {
            toast.error("Failed to delete");
        }
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Communication Center</h2>
                <p className="text-gray-500 text-sm">Manage announcements for House Fellowship Leaders.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Announcement */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-indigo-50 shadow-sm">
                        <h3 className="font-bold text-lg text-indigo-900 mb-4 flex items-center gap-2">
                            <HiPlus className="w-5 h-5" /> New Announcement
                        </h3>
                        <form onSubmit={handlePost} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="e.g. Upcoming Training"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Message</label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none"
                                    placeholder="Write your message here..."
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 disabled:opacity-50"
                            >
                                {loading ? 'Posting...' : 'Post Announcement'}
                            </button>
                        </form>
                    </div>

                    <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-6 rounded-2xl text-white shadow-lg">
                        <h3 className="font-bold text-lg mb-2">Need to email everyone?</h3>
                        <p className="text-indigo-100 text-sm mb-4">Click below to open your default email client with all leaders in BCC.</p>
                        <a
                            href="mailto:?bcc=leader1@faithassembly.org,leader2@faithassembly.org&subject=House Fellowship Update"
                            className="bg-white text-indigo-700 px-4 py-2 rounded-lg font-bold text-sm inline-flex items-center gap-2 hover:bg-indigo-50 transition-colors"
                        >
                            <HiMail className="w-4 h-4" /> Compose Email
                        </a>
                    </div>
                </div>

                {/* Announcement List */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                        <HiSpeakerphone className="w-5 h-5 text-indigo-500" /> Recent Announcements
                    </h3>

                    <div className="space-y-4">
                        {announcements.map((post) => (
                            <div key={post.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative group">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-lg text-gray-900">{post.title}</h4>
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                        title="Delete"
                                    >
                                        <HiTrash className="w-5 h-5" />
                                    </button>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>
                                <div className="flex justify-between items-center text-xs text-gray-400 border-t border-gray-50 pt-4">
                                    <span className="font-medium bg-gray-50 px-2 py-1 rounded text-gray-500">Posted by {post.authorName}</span>
                                    <span>{post.createdAt?.seconds ? format(new Date(post.createdAt.seconds * 1000), 'PPP p') : 'Just now'}</span>
                                </div>
                            </div>
                        ))}

                        {announcements.length === 0 && (
                            <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                <p className="text-gray-400">No announcements yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HouseAdminCommunication;
