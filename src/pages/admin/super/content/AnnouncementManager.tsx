import React, { useState, useEffect } from 'react';
import {
    HiSpeakerphone,
    HiPlus,
    HiTrash,
    HiPencil
} from 'react-icons/hi';
import {
    getFirestore,
    collection,
    addDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp
} from 'firebase/firestore';
import { toast } from 'react-hot-toast';

interface Announcement {
    id: string;
    title: string;
    message: string;
    type: 'Info' | 'Warning' | 'Alert' | 'Success';
    audience: 'All' | 'Members' | 'Leaders' | 'Public';
    status: 'Active' | 'Draft' | 'Expired';
    date: string;
    createdAt: any;
}

const AnnouncementManager: React.FC = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        type: 'Info',
        audience: 'All',
        status: 'Active'
    });

    const db = getFirestore();
    const announcementsRef = collection(db, 'announcements');

    useEffect(() => {
        // Real-time listener for announcements
        const q = query(announcementsRef, orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Announcement[];
            setAnnouncements(data);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching announcements:", error);
            toast.error("Failed to load announcements");
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this announcement?")) return;
        try {
            await deleteDoc(doc(db, 'announcements', id));
            toast.success("Announcement deleted");
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Failed to delete");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(announcementsRef, {
                ...formData,
                date: new Date().toISOString(),
                createdAt: serverTimestamp()
            });
            toast.success("Announcement published successfully!");
            setShowModal(false);
            setFormData({
                title: '',
                message: '',
                type: 'Info',
                audience: 'All',
                status: 'Active'
            });
        } catch (error) {
            console.error("Error creating announcement:", error);
            toast.error("Failed to publish announcement");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Announcement Manager</h1>
                    <p className="text-slate-500">Create and manage church-wide announcements.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition"
                >
                    <HiPlus /> New Announcement
                </button>
            </div>

            {/* List */}
            <div className="grid gap-4">
                {loading ? (
                    <p className="text-gray-500">Loading announcements...</p>
                ) : announcements.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl border border-dashed border-gray-300 text-center">
                        <HiSpeakerphone className="mx-auto text-4xl text-gray-300 mb-2" />
                        <p className="text-gray-500">No announcements found. Create one to get started.</p>
                    </div>
                ) : (
                    announcements.map((ann) => (
                        <div key={ann.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${ann.type === 'Alert' ? 'bg-red-100 text-red-700' :
                                            ann.type === 'Warning' ? 'bg-yellow-100 text-yellow-700' :
                                                ann.type === 'Success' ? 'bg-green-100 text-green-700' :
                                                    'bg-blue-100 text-blue-700'
                                        }`}>
                                        {ann.type}
                                    </span>
                                    <span className="text-xs text-gray-400">•</span>
                                    <span className="text-xs text-gray-500">{new Date(ann.date).toLocaleDateString()}</span>
                                    <span className="text-xs text-gray-400">•</span>
                                    <span className="text-xs text-gray-500">Audience: {ann.audience}</span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{ann.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{ann.message}</p>
                            </div>
                            <div className="flex gap-2 ml-4">
                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit (Coming Soon)">
                                    <HiPencil className="text-xl" />
                                </button>
                                <button onClick={() => handleDelete(ann.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">
                                    <HiTrash className="text-xl" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in">
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="font-bold text-lg text-gray-800">New Announcement</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <HiPlus className="rotate-45 text-2xl" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    required
                                    rows={4}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                    >
                                        <option>Info</option>
                                        <option>Warning</option>
                                        <option>Alert</option>
                                        <option>Success</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Audience</label>
                                    <select
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
                                        value={formData.audience}
                                        onChange={(e) => setFormData({ ...formData, audience: e.target.value as any })}
                                    >
                                        <option>All</option>
                                        <option>Members</option>
                                        <option>Leaders</option>
                                        <option>Public</option>
                                    </select>
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition mt-2">
                                Publish Announcement
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnnouncementManager;
