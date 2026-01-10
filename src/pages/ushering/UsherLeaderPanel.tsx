import React, { useState, useEffect } from 'react';
import { HiUserGroup, HiCalendar, HiCube, HiTrash, HiPlus } from 'react-icons/hi';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'react-hot-toast';
import type { UsherMember, UsherService, UsherStockItem } from '../../types/ushering';

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
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'team' && <TeamManager />}
                {activeTab === 'schedule' && <ScheduleManager />}
                {activeTab === 'stock' && <StockManager />}
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

const ScheduleManager = () => {
    // Simplified Rota Creator - In a real app, this would be complex
    const [services, setServices] = useState<UsherService[]>([]);

    useEffect(() => {
        const q = query(collection(db, 'usher_schedule'), orderBy('date', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UsherService)));
        });
        return () => unsubscribe();
    }, []);

    const createService = async () => {
        const date = prompt("Enter Date (e.g. Sunday, Jan 21):");
        if (!date) return;

        await addDoc(collection(db, 'usher_schedule'), {
            date,
            time: "09:30 AM",
            name: "Main Service",
            team: "Team Alpha",
            status: 'upcoming',
            duties: [
                { position: 'Main Entrance', assigneeName: 'Unassigned', status: 'pending' },
                { position: 'Sanctuary', assigneeName: 'Unassigned', status: 'pending' }
            ],
            createdAt: serverTimestamp()
        });
        toast.success("Service Created");
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this service?")) return;
        await deleteDoc(doc(db, 'usher_schedule', id));
        toast.success("Service Deleted");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-900 uppercase">Rota Management</h3>
                <button onClick={createService} className="bg-slate-900 text-white px-4 py-2 rounded font-bold text-sm flex items-center gap-2 hover:bg-slate-800">
                    <HiPlus /> New Service
                </button>
            </div>
            <div className="grid gap-4">
                {services.map(s => (
                    <div key={s.id} className="bg-white border border-slate-200 p-4 rounded-xl flex justify-between items-center">
                        <div>
                            <h4 className="font-bold text-slate-900">{s.date} - {s.name}</h4>
                            <p className="text-sm text-slate-500">{s.time} &bull; {s.team}</p>
                        </div>
                        <button onClick={() => handleDelete(s.id)} className="text-slate-400 hover:text-red-600"><HiTrash className="w-5 h-5" /></button>
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

export default UsherLeaderPanel;
