import React, { useState, useEffect } from 'react';
import { HiDocumentText, HiSpeakerphone, HiUsers, HiTrash } from 'react-icons/hi';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'react-hot-toast';
import type { MediaTeamGroup } from '../../types/media';

const MediaLeaderPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState('briefs');

    return (
        <div className="space-y-8 font-sans">
            <div>
                <span className="text-cyan-500 font-mono font-bold text-xs mb-2 block tracking-widest uppercase">Admin Panel</span>
                <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Media Leadership</h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-800 pb-1">
                <button
                    onClick={() => setActiveTab('briefs')}
                    className={`pb-4 px-4 text-sm font-bold uppercase transition-colors ${activeTab === 'briefs' ? 'text-cyan-500 border-b-2 border-cyan-500' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <div className="flex items-center gap-2">
                        <HiDocumentText className="w-5 h-5" /> Production Briefs
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('announcements')}
                    className={`pb-4 px-4 text-sm font-bold uppercase transition-colors ${activeTab === 'announcements' ? 'text-cyan-500 border-b-2 border-cyan-500' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <div className="flex items-center gap-2">
                        <HiSpeakerphone className="w-5 h-5" /> Tech Intel
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('team')}
                    className={`pb-4 px-4 text-sm font-bold uppercase transition-colors ${activeTab === 'team' ? 'text-cyan-500 border-b-2 border-cyan-500' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <div className="flex items-center gap-2">
                        <HiUsers className="w-5 h-5" /> Crew Manifest
                    </div>
                </button>
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'briefs' && <BriefManager />}
                {activeTab === 'announcements' && <AnnouncementManager />}
                {activeTab === 'team' && <TeamManager />}
            </div>
        </div>
    );
};

// --- Sub-Components ---

const BriefManager = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [series, setSeries] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'media_briefs'), {
                title,
                content,
                series,
                date: serverTimestamp()
            });
            toast.success("New Brief Published");
            setTitle('');
            setContent('');
            setSeries('');
        } catch (error) {
            toast.error("Failed to publish brief");
        }
    };

    return (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl max-w-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Publish New Production Brief</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-mono font-bold text-slate-500 mb-2 uppercase">Brief Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500"
                        placeholder="e.g. Preparation for Kingdom Come Series"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-mono font-bold text-slate-500 mb-2 uppercase">Series Context</label>
                    <input
                        type="text"
                        value={series}
                        onChange={(e) => setSeries(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500"
                        placeholder="e.g. Kingdom Come"
                    />
                </div>
                <div>
                    <label className="block text-xs font-mono font-bold text-slate-500 mb-2 uppercase">Brief Content</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 h-32"
                        placeholder="Detailed instructions for the team..."
                        required
                    />
                </div>
                <button type="submit" className="w-full py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-500 transition-colors uppercase font-mono text-sm">
                    Publish Brief
                </button>
            </form>
        </div>
    );
};

const AnnouncementManager = () => {
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [newPost, setNewPost] = useState({ title: '', content: '', priority: 'low' });

    useEffect(() => {
        const q = query(collection(db, 'media_announcements'), orderBy('date', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'media_announcements'), {
                ...newPost,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                createdAt: serverTimestamp(),
                author: 'Admin'
            });
            setNewPost({ title: '', content: '', priority: 'low' });
            toast.success("Announcement Posted");
        } catch (error) {
            toast.error("Failed to post");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this announcement?")) return;
        await deleteDoc(doc(db, 'media_announcements', id));
        toast.success("Deleted");
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl h-fit">
                <h3 className="font-bold text-white mb-4">Post Tech Intel</h3>
                <form onSubmit={handleAdd} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Title"
                        value={newPost.title}
                        onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                        required
                    />
                    <select
                        value={newPost.priority}
                        onChange={e => setNewPost({ ...newPost, priority: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                    </select>
                    <textarea
                        placeholder="Content"
                        value={newPost.content}
                        onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white h-24"
                        required
                    />
                    <button className="w-full py-2 bg-green-600 text-white font-bold rounded hover:bg-green-500">Post</button>
                </form>
            </div>

            <div className="space-y-4">
                {announcements.map(a => (
                    <div key={a.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`w-2 h-2 rounded-full ${a.priority === 'high' ? 'bg-red-500' : a.priority === 'medium' ? 'bg-cyan-500' : 'bg-slate-500'}`}></span>
                                <h4 className="font-bold text-white">{a.title}</h4>
                            </div>
                            <p className="text-slate-400 text-sm line-clamp-2">{a.content}</p>
                        </div>
                        <button onClick={() => handleDelete(a.id)} className="text-slate-600 hover:text-red-500">
                            <HiTrash className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TeamManager = () => {
    // Simplified team view for MVP
    const [teams, setTeams] = useState<MediaTeamGroup[]>([]);

    useEffect(() => {
        const q = query(collection(db, 'media_teams'), orderBy('name', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setTeams(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MediaTeamGroup)));
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map(team => (
                <div key={team.id} className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                        <h3 className="font-bold text-white">{team.name}</h3>
                        <span className="text-xs text-slate-500 uppercase">Lead: {team.lead}</span>
                    </div>
                    <ul className="space-y-2">
                        {team.members?.map((m, i) => (
                            <li key={i} className="text-sm text-slate-300 flex justify-between">
                                <span>{m.name}</span>
                                <span className="text-xs text-slate-500">{m.role}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t border-slate-800 text-center">
                        <p className="text-xs text-slate-600 italic">Editing coming soon</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MediaLeaderPanel;
