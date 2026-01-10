import React, { useState, useEffect } from 'react';
import { HiClock, HiUser, HiTrash, HiCheck, HiLockClosed } from 'react-icons/hi';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'react-hot-toast';
import type { PrayerRequest, PrayerSlot } from '../../types/prayer';

const PrayerLeaderPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState('requests');

    return (
        <div className="space-y-8 font-sans">
            <div>
                <span className="text-indigo-400 font-bold tracking-widest uppercase text-xs mb-2 block">Admin Panel</span>
                <h1 className="text-4xl font-serif font-bold text-white">Prayer Leadership</h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-indigo-900/50 pb-1 overflow-x-auto">
                <TabButton
                    active={activeTab === 'requests'}
                    onClick={() => setActiveTab('requests')}
                    icon={<HiUser className="w-5 h-5" />}
                    label="Prayer Requests"
                />
                <TabButton
                    active={activeTab === 'schedule'}
                    onClick={() => setActiveTab('schedule')}
                    icon={<HiClock className="w-5 h-5" />}
                    label="Watch Schedule"
                />
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'requests' && <RequestManager />}
                {activeTab === 'schedule' && <ScheduleManager />}
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
    <button
        onClick={onClick}
        className={`pb-4 px-4 text-sm font-bold uppercase transition-colors whitespace-nowrap ${active ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}
    >
        <div className="flex items-center gap-2">
            {icon} {label}
        </div>
    </button>
);

// --- Sub-Components ---

const RequestManager = () => {
    const [requests, setRequests] = useState<PrayerRequest[]>([]);

    useEffect(() => {
        const q = query(collection(db, 'prayer_requests'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PrayerRequest)));
        });
        return () => unsubscribe();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this request?")) return;
        await deleteDoc(doc(db, 'prayer_requests', id));
        toast.success("Request Deleted");
    };

    const toggleAnswered = async (id: string, current: boolean) => {
        await updateDoc(doc(db, 'prayer_requests', id), { answered: !current });
        toast.success(current ? "Unmarked Answered" : "Marked Answered");
    };

    return (
        <div className="space-y-4">
            <h3 className="font-bold text-white mb-4 uppercase italic">Manage Prayer Wall</h3>
            {requests.length === 0 && <p className="text-slate-500 italic">No requests logged.</p>}
            {requests.map(r => (
                <div key={r.id} className={`bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm ${r.answered ? 'border-green-500/30 bg-green-900/10' : ''}`}>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-white">{r.author}</h4>
                            {r.isPrivate && <HiLockClosed className="w-4 h-4 text-slate-500" title="Private" />}
                            <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{r.category}</span>
                            {r.answered && <span className="text-xs bg-green-900 text-green-400 px-2 py-0.5 rounded-full font-bold">Answered!</span>}
                        </div>
                        <p className="text-sm text-slate-300 line-clamp-1">{r.content}</p>
                        <p className="text-xs text-slate-500 mt-1">{r.date} &bull; {r.praying} Prayer Warriors</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => toggleAnswered(r.id, r.answered)} className={`p-2 rounded border transition-colors ${r.answered ? 'bg-green-600 border-green-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-green-400'}`} title="Mark Answered">
                            <HiCheck className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(r.id)} className="p-2 bg-slate-800 border border-slate-700 rounded text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                            <HiTrash className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

const ScheduleManager = () => {
    const [slots, setSlots] = useState<PrayerSlot[]>([]);
    const [newSlot, setNewSlot] = useState({
        day: 'Monday', time: '06:00 AM - 07:00 AM', focus: 'General Intercession'
    });

    useEffect(() => {
        const q = query(collection(db, 'prayer_slots'), orderBy('day', 'asc')); // Ideally order by a numeric day index
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setSlots(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PrayerSlot)));
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'prayer_slots'), {
                ...newSlot,
                status: 'Open',
                assignedTo: null,
                createdAt: serverTimestamp()
            });
            toast.success("Slot Created");
            setNewSlot({ day: 'Monday', time: '', focus: 'General Intercession' });
        } catch (error) {
            toast.error("Failed to create slot");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this slot?")) return;
        await deleteDoc(doc(db, 'prayer_slots', id));
        toast.success("Slot Deleted");
    };

    const handleClearAssignee = async (id: string) => {
        await updateDoc(doc(db, 'prayer_slots', id), {
            assignedTo: null,
            status: 'Open'
        });
        toast.success("Watchman Released");
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl shadow-sm h-fit">
                <h3 className="font-bold text-white mb-4 uppercase italic">Add Watch Slot</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <select value={newSlot.day} onChange={e => setNewSlot({ ...newSlot, day: e.target.value })} className="w-full bg-slate-950 border border-slate-800 text-white p-2 rounded" required>
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                    <input type="text" placeholder="Time Range (e.g. 06:00 AM - 07:00 AM)" value={newSlot.time} onChange={e => setNewSlot({ ...newSlot, time: e.target.value })} className="w-full bg-slate-950 border border-slate-800 text-white p-2 rounded" required />
                    <input type="text" placeholder="Prayer Focus" value={newSlot.focus} onChange={e => setNewSlot({ ...newSlot, focus: e.target.value })} className="w-full bg-slate-950 border border-slate-800 text-white p-2 rounded" required />

                    <button className="w-full py-3 bg-indigo-600 text-white font-bold uppercase rounded hover:bg-indigo-700">Add Slot</button>
                </form>
            </div>
            <div className="space-y-4">
                {slots.map(s => (
                    <div key={s.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className={`w-2 h-12 rounded-full ${s.status === 'Assigned' ? 'bg-indigo-500' : 'bg-slate-700'}`}></div>
                            <div>
                                <h4 className="font-bold text-white">{s.day} &bull; {s.time}</h4>
                                <p className="text-sm text-indigo-300">{s.focus}</p>
                                <p className="text-xs text-slate-500 mt-1">
                                    Status: <span className={s.status === 'Assigned' ? 'text-indigo-400 font-bold' : 'text-slate-400'}>{s.status}</span>
                                    {s.assignedTo && ` - ${s.assignedTo}`}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {s.assignedTo && (
                                <button onClick={() => handleClearAssignee(s.id)} className="text-slate-500 hover:text-indigo-400 text-xs uppercase font-bold px-2">Release</button>
                            )}
                            <button onClick={() => handleDelete(s.id)} className="text-slate-600 hover:text-red-600"><HiTrash className="w-5 h-5" /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PrayerLeaderPanel;
