import React, { useState, useEffect } from 'react';
import { HiMusicNote, HiUserGroup, HiCalendar, HiTrash, HiPlus } from 'react-icons/hi';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'react-hot-toast';
import type { WorshipSong, WorshipMember, WorshipEvent } from '../../types/worship';

const WorshipLeaderPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState('library');

    return (
        <div className="space-y-8 font-sans">
            <div>
                <span className="text-pink-600 font-bold tracking-widest uppercase text-xs mb-2 block">Director Control</span>
                <h1 className="text-3xl font-serif font-bold text-slate-900">Department Management</h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-200 pb-1 overflow-x-auto">
                <TabButton
                    active={activeTab === 'library'}
                    onClick={() => setActiveTab('library')}
                    icon={<HiMusicNote className="w-5 h-5" />}
                    label="Song Library"
                />
                <TabButton
                    active={activeTab === 'team'}
                    onClick={() => setActiveTab('team')}
                    icon={<HiUserGroup className="w-5 h-5" />}
                    label="Team Roster"
                />
                <TabButton
                    active={activeTab === 'events'}
                    onClick={() => setActiveTab('events')}
                    icon={<HiCalendar className="w-5 h-5" />}
                    label="Call Sheets"
                />
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'library' && <LibraryManager />}
                {activeTab === 'team' && <TeamManager />}
                {activeTab === 'events' && <EventManager />}
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
    <button
        onClick={onClick}
        className={`pb-4 px-4 text-sm font-bold uppercase transition-colors whitespace-nowrap ${active ? 'text-pink-600 border-b-2 border-pink-500' : 'text-slate-400 hover:text-slate-600'}`}
    >
        <div className="flex items-center gap-2">
            {icon} {label}
        </div>
    </button>
);

// --- Sub-Components ---

const LibraryManager = () => {
    const [songs, setSongs] = useState<WorshipSong[]>([]);
    const [newSong, setNewSong] = useState({
        title: '', artist: '', key: 'C', tempo: 'Mid', theme: 'Worship',
        lyrics: false, chords: false, demo: false
    });

    useEffect(() => {
        const q = query(collection(db, 'worship_songs'), orderBy('title', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setSongs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorshipSong)));
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'worship_songs'), {
                ...newSong,
                createdAt: serverTimestamp()
            });
            toast.success("Song Added");
            setNewSong({ title: '', artist: '', key: 'C', tempo: 'Mid', theme: 'Worship', lyrics: false, chords: false, demo: false });
        } catch (error) {
            toast.error("Failed to add song");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this song?")) return;
        await deleteDoc(doc(db, 'worship_songs', id));
        toast.success("Song Deleted");
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm h-fit">
                <h3 className="font-bold text-slate-900 mb-4 uppercase">Add New Song</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Title" value={newSong.title} onChange={e => setNewSong({ ...newSong, title: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-2 rounded" required />
                    <input type="text" placeholder="Artist" value={newSong.artist} onChange={e => setNewSong({ ...newSong, artist: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-2 rounded" required />
                    <div className="grid grid-cols-2 gap-4">
                        <select value={newSong.key} onChange={e => setNewSong({ ...newSong, key: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-2 rounded">
                            {['C', 'G', 'D', 'A', 'E', 'B', 'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F'].map(k => <option key={k} value={k}>{k}</option>)}
                        </select>
                        <select value={newSong.tempo} onChange={e => setNewSong({ ...newSong, tempo: e.target.value } as any)} className="w-full bg-slate-50 border border-slate-200 p-2 rounded">
                            <option value="Slow">Slow</option>
                            <option value="Mid">Mid</option>
                            <option value="Up">Up</option>
                        </select>
                    </div>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={newSong.lyrics} onChange={e => setNewSong({ ...newSong, lyrics: e.target.checked })} /> Lyrics</label>
                        <label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={newSong.chords} onChange={e => setNewSong({ ...newSong, chords: e.target.checked })} /> Chords</label>
                        <label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={newSong.demo} onChange={e => setNewSong({ ...newSong, demo: e.target.checked })} /> Demo</label>
                    </div>
                    <button className="w-full py-3 bg-pink-600 text-white font-bold uppercase rounded hover:bg-pink-700">Add Song</button>
                </form>
            </div>
            <div className="space-y-4">
                {songs.map(s => (
                    <div key={s.id} className="bg-white border border-slate-200 p-4 rounded-xl flex justify-between items-center shadow-sm">
                        <div>
                            <h4 className="font-bold text-slate-900">{s.title}</h4>
                            <p className="text-sm text-slate-500">{s.artist} &bull; Key: {s.key}</p>
                        </div>
                        <button onClick={() => handleDelete(s.id)} className="text-slate-400 hover:text-red-600"><HiTrash className="w-5 h-5" /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TeamManager = () => {
    const [members, setMembers] = useState<WorshipMember[]>([]);
    const [newMember, setNewMember] = useState({
        name: '', role: 'Member', section: 'Vocals', part: '', email: '', phone: '', status: 'active'
    });

    useEffect(() => {
        const q = query(collection(db, 'worship_team'), orderBy('name', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorshipMember)));
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'worship_team'), {
                ...newMember,
                createdAt: serverTimestamp()
            });
            toast.success("Member Added");
            setNewMember({ name: '', role: 'Member', section: 'Vocals', part: '', email: '', phone: '', status: 'active' });
        } catch (error) {
            toast.error("Failed to add member");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this member?")) return;
        await deleteDoc(doc(db, 'worship_team', id));
        toast.success("Member Removed");
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm h-fit">
                <h3 className="font-bold text-slate-900 mb-4 uppercase">Register Member</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Full Name" value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-2 rounded" required />
                    <div className="grid grid-cols-2 gap-4">
                        <select value={newMember.role} onChange={e => setNewMember({ ...newMember, role: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-2 rounded">
                            <option value="Worship Leader">Worship Leader</option>
                            <option value="Musical Director">MD</option>
                            <option value="Section Leader">Section Leader</option>
                            <option value="Member">Member</option>
                        </select>
                        <select value={newMember.section} onChange={e => setNewMember({ ...newMember, section: e.target.value } as any)} className="w-full bg-slate-50 border border-slate-200 p-2 rounded">
                            <option value="Vocals">Vocals</option>
                            <option value="Band">Band</option>
                            <option value="Tech">Tech</option>
                            <option value="Media">Media</option>
                        </select>
                    </div>
                    <input type="text" placeholder="Part (e.g. Alto, Drums)" value={newMember.part} onChange={e => setNewMember({ ...newMember, part: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-2 rounded" required />
                    <input type="email" placeholder="Email" value={newMember.email} onChange={e => setNewMember({ ...newMember, email: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-2 rounded" required />
                    <button className="w-full py-3 bg-pink-600 text-white font-bold uppercase rounded hover:bg-pink-700">Add Member</button>
                </form>
            </div>
            <div className="space-y-4">
                {members.map(m => (
                    <div key={m.id} className="bg-white border border-slate-200 p-4 rounded-xl flex justify-between items-center shadow-sm">
                        <div>
                            <h4 className="font-bold text-slate-900">{m.name}</h4>
                            <p className="text-sm text-pink-600 font-bold">{m.part} &bull; {m.section}</p>
                        </div>
                        <button onClick={() => handleDelete(m.id)} className="text-slate-400 hover:text-red-600"><HiTrash className="w-5 h-5" /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const EventManager = () => {
    const [events, setEvents] = useState<WorshipEvent[]>([]);

    useEffect(() => {
        const q = query(collection(db, 'worship_events'), orderBy('date', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorshipEvent)));
        });
        return () => unsubscribe();
    }, []);

    const createEvent = async () => {
        const title = prompt("Event Title:");
        if (!title) return;

        await addDoc(collection(db, 'worship_events'), {
            title,
            type: "Service",
            date: "Sunday, TBD",
            time: "08:30 Call Time",
            location: "Sanctuary",
            setlist: [],
            attendees: 0,
            createdAt: serverTimestamp()
        });
        toast.success("Event Created");
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this event?")) return;
        await deleteDoc(doc(db, 'worship_events', id));
        toast.success("Event Deleted");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-900 uppercase">Call Sheets</h3>
                <button onClick={createEvent} className="bg-slate-900 text-white px-4 py-2 rounded font-bold text-sm flex items-center gap-2 hover:bg-slate-800">
                    <HiPlus /> New Event
                </button>
            </div>
            <div className="grid gap-4">
                {events.map(e => (
                    <div key={e.id} className="bg-white border border-slate-200 p-4 rounded-xl flex justify-between items-center">
                        <div>
                            <h4 className="font-bold text-slate-900">{e.title}</h4>
                            <p className="text-sm text-slate-500">{e.date} &bull; {e.type}</p>
                        </div>
                        <button onClick={() => handleDelete(e.id)} className="text-slate-400 hover:text-red-600"><HiTrash className="w-5 h-5" /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorshipLeaderPanel;
