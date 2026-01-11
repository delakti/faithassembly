import React, { useState, useEffect } from 'react';
import {
    HiSpeakerphone,
    HiPlus,
    HiTrash,
    HiPencil,
    HiEye,
    HiCheck,
    HiX
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
    serverTimestamp,
    updateDoc
} from 'firebase/firestore';
import { toast } from 'react-hot-toast';

interface Announcement {
    id: string;
    title: string;
    message: string;
    type: 'Info' | 'Warning' | 'Alert' | 'Success';
    audience: 'All' | 'Members' | 'Leaders' | 'Public';
    status: 'Active' | 'Draft' | 'Expired';
    date: string; // Stored as ISO string or timestamp
}

const AnnouncementManager: React.FC = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState<'Info' | 'Warning' | 'Alert' | 'Success'>('Info');
    const [audience, setAudience] = useState<'All' | 'Members' | 'Leaders' | 'Public'>('All');
    const [status, setStatus] = useState<'Active' | 'Draft'>('Active');

    const db = getFirestore();

    // 1. Fetch Real Announcements
    useEffect(() => {
        const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Announcement[];
            setAnnouncements(data);
        });
        return () => unsubscribe();
    }, [db]);

    // 2. Create Announcement
    const handleCreate = async () => {
        if (!title || !message) return toast.error("Title and message required");

        try {
            await addDoc(collection(db, 'announcements'), {
                title,
                message,
                type,
                audience,
                status,
                date: new Date().toISOString().split('T')[0],
                createdAt: serverTimestamp()
            });
            toast.success("Announcement created!");
            setIsEditing(false);
            resetForm();
        } catch (error) {
            console.error(error);
            toast.error("Failed to create announcement");
        }
    };

    // 3. Delete Announcement
    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this announcement?')) {
            try {
                await deleteDoc(doc(db, 'announcements', id));
                toast.success("Announcement deleted");
            } catch (error) {
                toast.error("Failed to delete");
            }
        }
    };

    const resetForm = () => {
        setTitle('');
        setMessage('');
        setType('Info');
        setAudience('All');
        setStatus('Active');
    };

    const getBadgeColor = (type: string) => {
        switch (type) {
            case 'Info': return 'bg-sky-100 text-sky-700';
            case 'Warning': return 'bg-amber-100 text-amber-700';
            case 'Alert': return 'bg-rose-100 text-rose-700';
            case 'Success': return 'bg-emerald-100 text-emerald-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Announcement Manager</h1>
                    <p className="text-slate-500">Create and manage global notifications.</p>
                </div>
                <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-sm"
                >
                    <HiPlus className="w-5 h-5" />
                    New Announcement
                </button>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600">Title</th>
                            <th className="p-4 font-semibold text-slate-600">Type</th>
                            <th className="p-4 font-semibold text-slate-600">Audience</th>
                            <th className="p-4 font-semibold text-slate-600">Status</th>
                            <th className="p-4 font-semibold text-slate-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {announcements.map((ann) => (
                            <tr key={ann.id} className="hover:bg-slate-50">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                            <HiSpeakerphone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">{ann.title}</p>
                                            <p className="text-xs text-slate-500 truncate w-48">{ann.message}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getBadgeColor(ann.type)}`}>
                                        {ann.type}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-600 text-sm">{ann.audience}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${ann.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                        ann.status === 'Draft' ? 'bg-gray-50 text-gray-600 border-gray-200' :
                                            'bg-rose-50 text-rose-600 border-rose-200'
                                        }`}>
                                        {ann.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <button onClick={() => handleDelete(ann.id)} className="p-2 text-slate-300 hover:text-rose-600 transition">
                                        <HiTrash className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {announcements.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        <HiSpeakerphone className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No announcements found.</p>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-lg font-bold mb-4">New Announcement</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <input
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="w-full border p-2 rounded-lg"
                                    placeholder="e.g. Easter Service"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Message</label>
                                <textarea
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    className="w-full border p-2 rounded-lg"
                                    rows={3}
                                    placeholder="Details..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Type</label>
                                    <select
                                        value={type}
                                        onChange={e => setType(e.target.value as any)}
                                        className="w-full border p-2 rounded-lg"
                                    >
                                        <option value="Info">Info</option>
                                        <option value="Warning">Warning</option>
                                        <option value="Alert">Alert</option>
                                        <option value="Success">Success</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Audience</label>
                                    <select
                                        value={audience}
                                        onChange={e => setAudience(e.target.value as any)}
                                        className="w-full border p-2 rounded-lg"
                                    >
                                        <option value="All">All</option>
                                        <option value="Members">Members</option>
                                        <option value="Leaders">Leaders</option>
                                        <option value="Public">Public</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreate}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                                Post Announcement
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnnouncementManager;
