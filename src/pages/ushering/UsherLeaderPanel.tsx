import React, { useState, useEffect } from 'react';
import { HiUserGroup, HiCalendar, HiCube, HiTrash, HiSpeakerphone, HiAcademicCap } from 'react-icons/hi';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'react-hot-toast';
import type { UsherMember, UsherStockItem } from '../../types/ushering';
import UsherRota from './UsherRota';

const UsherLeaderPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState('team');

    return (
        <div className="space-y-8 font-sans">
            <div>
                <span className="text-amber-600 font-bold tracking-widest uppercase text-xs mb-2 block">Head Usher Control</span>
                <h1 className="text-3xl font-serif font-bold text-slate-900">Department Management</h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-200 pb-1 overflow-x-auto">
                <TabButton
                    active={activeTab === 'team'}
                    onClick={() => setActiveTab('team')}
                    icon={<HiUserGroup className="w-5 h-5" />}
                    label="Squad Directory"
                />
                <TabButton
                    active={activeTab === 'schedule'}
                    onClick={() => setActiveTab('schedule')}
                    icon={<HiCalendar className="w-5 h-5" />}
                    label="Duty Rota"
                />
                <TabButton
                    active={activeTab === 'stock'}
                    onClick={() => setActiveTab('stock')}
                    icon={<HiCube className="w-5 h-5" />}
                    label="Inventory"
                />
                <TabButton
                    active={activeTab === 'briefs'}
                    onClick={() => setActiveTab('briefs')}
                    icon={<HiSpeakerphone className="w-5 h-5" />}
                    label="Briefs"
                />
                <TabButton
                    active={activeTab === 'trainings'}
                    onClick={() => setActiveTab('trainings')}
                    icon={<HiAcademicCap className="w-5 h-5" />}
                    label="Trainings"
                />
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'team' && <TeamManager />}
                {activeTab === 'schedule' && <UsherRota />}
                {activeTab === 'stock' && <StockManager />}
                {activeTab === 'briefs' && <BriefManager />}
                {activeTab === 'trainings' && <TrainingManager />}
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
    <button
        onClick={onClick}
        className={`pb-4 px-4 text-sm font-bold uppercase transition-colors whitespace-nowrap ${active ? 'text-amber-600 border-b-2 border-amber-500' : 'text-slate-400 hover:text-slate-600'}`}
    >
        <div className="flex items-center gap-2">
            {icon} {label}
        </div>
    </button>
);

// --- Sub-Components ---

const TeamManager = () => {
    const [members, setMembers] = useState<UsherMember[]>([]);
    const [newMember, setNewMember] = useState({
        name: '', role: 'Usher', phone: '', email: '', team: 'Team Alpha', status: 'active'
    });

    useEffect(() => {
        const q = query(collection(db, 'usher_team'), orderBy('name', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UsherMember)));
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'usher_team'), {
                ...newMember,
                createdAt: serverTimestamp()
            });
            toast.success("Member Added");
            setNewMember({ name: '', role: 'Usher', phone: '', email: '', team: 'Team Alpha', status: 'active' });
        } catch (error) {
            toast.error("Failed to add member");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this member?")) return;
        await deleteDoc(doc(db, 'usher_team', id));
        toast.success("Member Removed");
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm h-fit">
                <h3 className="font-bold text-slate-900 mb-4 uppercase">Register Officer</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Full Name" value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-2 rounded" required />
                    <div className="grid grid-cols-2 gap-4">
                        <select value={newMember.role} onChange={e => setNewMember({ ...newMember, role: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-2 rounded">
                            <option value="Head Usher">Head Usher</option>
                            <option value="Senior Usher">Senior Usher</option>
                            <option value="Usher">Usher</option>
                            <option value="Trainee">Trainee</option>
                        </select>
                        <select value={newMember.team} onChange={e => setNewMember({ ...newMember, team: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-2 rounded">
                            <option value="Team Alpha">Team Alpha</option>
                            <option value="Team Beta">Team Beta</option>
                            <option value="Midweek Squad">Midweek Squad</option>
                        </select>
                    </div>
                    <input type="text" placeholder="Phone" value={newMember.phone} onChange={e => setNewMember({ ...newMember, phone: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-2 rounded" required />
                    <input type="email" placeholder="Email" value={newMember.email} onChange={e => setNewMember({ ...newMember, email: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-2 rounded" required />
                    <button className="w-full py-3 bg-amber-600 text-white font-bold uppercase rounded hover:bg-amber-700">Add Member</button>
                </form>
            </div>
            <div className="space-y-4">
                {members.map(m => (
                    <div key={m.id} className="bg-white border border-slate-200 p-4 rounded-xl flex justify-between items-center shadow-sm">
                        <div>
                            <h4 className="font-bold text-slate-900">{m.name}</h4>
                            <p className="text-sm text-amber-600 font-bold">{m.role} &bull; {m.team}</p>
                            <p className="text-xs text-slate-500">{m.phone}</p>
                        </div>
                        <button onClick={() => handleDelete(m.id)} className="text-slate-400 hover:text-red-600"><HiTrash className="w-5 h-5" /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const StockManager = () => {
    const [stock, setStock] = useState<UsherStockItem[]>([]);
    const [newItem, setNewItem] = useState({ name: '', category: 'Stationery', quantity: 0, minLevel: 10 });

    useEffect(() => {
        const q = query(collection(db, 'usher_stock'), orderBy('name', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setStock(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UsherStockItem)));
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'usher_stock'), {
                ...newItem,
                status: newItem.quantity <= newItem.minLevel ? 'low' : 'good',
                createdAt: serverTimestamp()
            });
            toast.success("Item Added");
            setNewItem({ name: '', category: 'Stationery', quantity: 0, minLevel: 10 });
        } catch (error) {
            toast.error("Failed to add item");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this item?")) return;
        await deleteDoc(doc(db, 'usher_stock', id));
        toast.success("Item Deleted");
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm h-fit">
                <h3 className="font-bold text-slate-900 mb-4 uppercase">Add Inventory Item</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Item Name" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-2 rounded" required />
                    <select value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-2 rounded">
                        <option value="Stationery">Stationery</option>
                        <option value="Sacraments">Sacraments</option>
                        <option value="Uniform">Uniform</option>
                        <option value="Hygiene">Hygiene</option>
                    </select>
                    <div className="grid grid-cols-2 gap-4">
                        <input type="number" placeholder="Quantity" value={newItem.quantity} onChange={e => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 p-2 rounded" required />
                        <input type="number" placeholder="Min Level" value={newItem.minLevel} onChange={e => setNewItem({ ...newItem, minLevel: parseInt(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 p-2 rounded" required />
                    </div>
                    <button className="w-full py-3 bg-amber-600 text-white font-bold uppercase rounded hover:bg-amber-700">Add Stock</button>
                </form>
            </div>
            <div className="space-y-4">
                {stock.map(s => (
                    <div key={s.id} className="bg-white border border-slate-200 p-4 rounded-xl flex justify-between items-center shadow-sm">
                        <div>
                            <h4 className="font-bold text-slate-900">{s.name}</h4>
                            <p className="text-sm text-slate-500">Qty: {s.quantity} | Min: {s.minLevel}</p>
                        </div>
                        <button onClick={() => handleDelete(s.id)} className="text-slate-400 hover:text-red-600"><HiTrash className="w-5 h-5" /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const BriefManager = () => {
    const [briefs, setBriefs] = useState<any[]>([]);
    const [newBrief, setNewBrief] = useState({ title: '', content: '', sender: 'Head Usher', isPriority: false });

    useEffect(() => {
        const q = query(collection(db, 'usher_briefs'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setBriefs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'usher_briefs'), {
                ...newBrief,
                createdAt: serverTimestamp(),
                timestamp: 'Just now', // Ideally calculate properly or use server time for display
                isNew: true
            });
            toast.success("Brief Posted");
            setNewBrief({ title: '', content: '', sender: 'Head Usher', isPriority: false });
        } catch (error) {
            toast.error("Failed to post brief");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this brief?")) return;
        await deleteDoc(doc(db, 'usher_briefs', id));
        toast.success("Brief Deleted");
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm h-fit">
                <h3 className="font-bold text-slate-900 mb-4 uppercase">Post Service Brief</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Title" value={newBrief.title} onChange={e => setNewBrief({ ...newBrief, title: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-2 rounded" required />
                    <textarea placeholder="Content" value={newBrief.content} onChange={e => setNewBrief({ ...newBrief, content: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-2 rounded h-24" required />
                    <div className="flex items-center gap-4">
                        <select value={newBrief.sender} onChange={e => setNewBrief({ ...newBrief, sender: e.target.value })} className="bg-slate-50 border border-slate-200 p-2 rounded flex-1">
                            <option value="Head Usher">Head Usher</option>
                            <option value="Pastor's Office">Pastor's Office</option>
                            <option value="Admin">Admin</option>
                        </select>
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            <input type="checkbox" checked={newBrief.isPriority} onChange={e => setNewBrief({ ...newBrief, isPriority: e.target.checked })} className="w-4 h-4 text-amber-600 rounded" />
                            High Priority
                        </label>
                    </div>
                    <button className="w-full py-3 bg-amber-600 text-white font-bold uppercase rounded hover:bg-amber-700">Post Brief</button>
                </form>
            </div>
            <div className="space-y-4">
                {briefs.map(b => (
                    <div key={b.id} className="bg-white border border-slate-200 p-4 rounded-xl flex justify-between items-start shadow-sm">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-slate-900">{b.title}</h4>
                                {b.isPriority && <span className="bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded">URGENT</span>}
                            </div>
                            <p className="text-sm text-slate-500 line-clamp-2">{b.content}</p>
                            <p className="text-xs text-slate-400 mt-2">From: {b.sender}</p>
                        </div>
                        <button onClick={() => handleDelete(b.id)} className="text-slate-400 hover:text-red-600"><HiTrash className="w-5 h-5" /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TrainingManager = () => {
    const [trainings, setTrainings] = useState<any[]>([]);
    const [newTraining, setNewTraining] = useState({
        title: '', date: '', time: '', location: '', description: '', type: 'live', mandatory: false
    });

    useEffect(() => {
        const q = query(collection(db, 'usher_trainings'), orderBy('date', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setTrainings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'usher_trainings'), {
                ...newTraining,
                createdAt: serverTimestamp()
            });
            toast.success("Training Added");
            setNewTraining({ title: '', date: '', time: '', location: '', description: '', type: 'live', mandatory: false });
        } catch (error) {
            toast.error("Failed to add training");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this training?")) return;
        await deleteDoc(doc(db, 'usher_trainings', id));
        toast.success("Training Deleted");
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm h-fit">
                <h3 className="font-bold text-slate-900 mb-4 uppercase">Schedule Training</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Title" value={newTraining.title} onChange={e => setNewTraining({ ...newTraining, title: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-2 rounded" required />
                    <textarea placeholder="Description" value={newTraining.description} onChange={e => setNewTraining({ ...newTraining, description: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-2 rounded h-20" required />
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Date (e.g. Sat, Feb 10)" value={newTraining.date} onChange={e => setNewTraining({ ...newTraining, date: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-2 rounded" required />
                        <input type="text" placeholder="Time" value={newTraining.time} onChange={e => setNewTraining({ ...newTraining, time: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-2 rounded" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Location" value={newTraining.location} onChange={e => setNewTraining({ ...newTraining, location: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-2 rounded" required />
                        <select value={newTraining.type} onChange={e => setNewTraining({ ...newTraining, type: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-2 rounded">
                            <option value="live">Live In-Person</option>
                            <option value="online">Online / Zoom</option>
                        </select>
                    </div>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <input type="checkbox" checked={newTraining.mandatory} onChange={e => setNewTraining({ ...newTraining, mandatory: e.target.checked })} className="w-4 h-4 text-amber-600 rounded" />
                        Mandatory Attendance
                    </label>
                    <button className="w-full py-3 bg-amber-600 text-white font-bold uppercase rounded hover:bg-amber-700">Schedule Session</button>
                </form>
            </div>
            <div className="space-y-4">
                {trainings.map(t => (
                    <div key={t.id} className="bg-white border border-slate-200 p-4 rounded-xl flex justify-between items-start shadow-sm">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-slate-900">{t.title}</h4>
                                {t.mandatory && <span className="bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded">MANDATORY</span>}
                            </div>
                            <p className="text-sm text-slate-500">{t.date} @ {t.time}</p>
                            <p className="text-xs text-slate-400">{t.location} • {t.type}</p>
                        </div>
                        <button onClick={() => handleDelete(t.id)} className="text-slate-400 hover:text-red-600"><HiTrash className="w-5 h-5" /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UsherLeaderPanel;
