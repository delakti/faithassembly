import React, { useState, useEffect } from 'react';
import { HiUserGroup, HiCalendar, HiSparkles, HiTrash, HiPlus } from 'react-icons/hi';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'react-hot-toast';
import type { HospitalityMember, HospitalityEvent, HospitalityShift } from '../../types/hospitality';

const HospitalityLeaderPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState('team');

    return (
        <div className="space-y-8 font-sans">
            <div>
                <span className="text-orange-600 font-bold tracking-widest uppercase text-xs mb-2 block">Team Lead Control</span>
                <h1 className="text-3xl font-serif font-bold text-stone-900">Department Management</h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-stone-200 pb-1 overflow-x-auto">
                <TabButton
                    active={activeTab === 'team'}
                    onClick={() => setActiveTab('team')}
                    icon={<HiUserGroup className="w-5 h-5" />}
                    label="Team Directory"
                />
                <TabButton
                    active={activeTab === 'shifts'}
                    onClick={() => setActiveTab('shifts')}
                    icon={<HiCalendar className="w-5 h-5" />}
                    label="Shift Rota"
                />
                <TabButton
                    active={activeTab === 'events'}
                    onClick={() => setActiveTab('events')}
                    icon={<HiSparkles className="w-5 h-5" />}
                    label="Events & Training"
                />
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'team' && <TeamManager />}
                {activeTab === 'shifts' && <ShiftManager />}
                {activeTab === 'events' && <EventManager />}
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
    <button
        onClick={onClick}
        className={`pb-4 px-4 text-sm font-bold uppercase transition-colors whitespace-nowrap ${active ? 'text-orange-600 border-b-2 border-orange-500' : 'text-stone-400 hover:text-stone-600'}`}
    >
        <div className="flex items-center gap-2">
            {icon} {label}
        </div>
    </button>
);

// --- Sub-Components ---

const TeamManager = () => {
    const [members, setMembers] = useState<HospitalityMember[]>([]);
    const [newMember, setNewMember] = useState({
        name: '', role: 'Volunteer', team: 'Greeting', phone: '', email: '', status: 'active'
    });

    useEffect(() => {
        const q = query(collection(db, 'hospitality_team'), orderBy('name', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HospitalityMember)));
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'hospitality_team'), {
                ...newMember,
                createdAt: serverTimestamp()
            });
            toast.success("Member Added");
            setNewMember({ name: '', role: 'Volunteer', team: 'Greeting', phone: '', email: '', status: 'active' });
        } catch (error) {
            toast.error("Failed to add member");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this member?")) return;
        await deleteDoc(doc(db, 'hospitality_team', id));
        toast.success("Member Removed");
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white border border-stone-200 p-6 rounded-xl shadow-sm h-fit">
                <h3 className="font-bold text-stone-900 mb-4 uppercase">Register Volunteer</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Full Name" value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })} className="w-full bg-stone-50 border border-stone-200 p-2 rounded" required />
                    <div className="grid grid-cols-2 gap-4">
                        <select value={newMember.role} onChange={e => setNewMember({ ...newMember, role: e.target.value })} className="w-full bg-stone-50 border border-stone-200 p-2 rounded">
                            <option value="Team Lead">Team Lead</option>
                            <option value="Volunteer">Volunteer</option>
                            <option value="Trainee">Trainee</option>
                        </select>
                        <select value={newMember.team} onChange={e => setNewMember({ ...newMember, team: e.target.value })} className="w-full bg-stone-50 border border-stone-200 p-2 rounded">
                            <option value="Greeting">Greeting</option>
                            <option value="Coffee">Coffee</option>
                            <option value="Cooking">Cooking</option>
                            <option value="Setup">Setup</option>
                        </select>
                    </div>
                    <input type="text" placeholder="Phone" value={newMember.phone} onChange={e => setNewMember({ ...newMember, phone: e.target.value })} className="w-full bg-stone-50 border border-stone-200 p-2 rounded" required />
                    <input type="email" placeholder="Email" value={newMember.email} onChange={e => setNewMember({ ...newMember, email: e.target.value })} className="w-full bg-stone-50 border border-stone-200 p-2 rounded" required />
                    <button className="w-full py-3 bg-orange-600 text-white font-bold uppercase rounded hover:bg-orange-700">Add Member</button>
                </form>
            </div>
            <div className="space-y-4">
                {members.map(m => (
                    <div key={m.id} className="bg-white border border-stone-200 p-4 rounded-xl flex justify-between items-center shadow-sm">
                        <div>
                            <h4 className="font-bold text-stone-900">{m.name}</h4>
                            <p className="text-sm text-orange-600 font-bold">{m.role} &bull; {m.team} Team</p>
                        </div>
                        <button onClick={() => handleDelete(m.id)} className="text-stone-400 hover:text-red-600"><HiTrash className="w-5 h-5" /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ShiftManager = () => {
    const [shifts, setShifts] = useState<HospitalityShift[]>([]);

    useEffect(() => {
        const q = query(collection(db, 'hospitality_schedule'), orderBy('date', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setShifts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HospitalityShift)));
        });
        return () => unsubscribe();
    }, []);

    const createShift = async () => {
        const date = prompt("Enter Date (e.g. Sunday, Nov 19):");
        if (!date) return;
        const event = prompt("Event Name (e.g. Morning Service):") || "Service";

        await addDoc(collection(db, 'hospitality_schedule'), {
            date,
            event,
            time: "08:00 AM",
            role: "Volunteer",
            location: "Main Foyer",
            status: 'Pending',
            team: [],
            createdAt: serverTimestamp()
        });
        toast.success("Shift Created");
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this shift?")) return;
        await deleteDoc(doc(db, 'hospitality_schedule', id));
        toast.success("Shift Deleted");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-stone-900 uppercase">Rota Management</h3>
                <button onClick={createShift} className="bg-stone-900 text-white px-4 py-2 rounded font-bold text-sm flex items-center gap-2 hover:bg-stone-800">
                    <HiPlus /> New Shift
                </button>
            </div>
            <div className="grid gap-4">
                {shifts.map(s => (
                    <div key={s.id} className="bg-white border border-stone-200 p-4 rounded-xl flex justify-between items-center">
                        <div>
                            <h4 className="font-bold text-stone-900">{s.date} - {s.event}</h4>
                            <p className="text-sm text-stone-500">{s.time} &bull; {s.location}</p>
                        </div>
                        <button onClick={() => handleDelete(s.id)} className="text-stone-400 hover:text-red-600"><HiTrash className="w-5 h-5" /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const EventManager = () => {
    const [events, setEvents] = useState<HospitalityEvent[]>([]);

    useEffect(() => {
        const q = query(collection(db, 'hospitality_events'), orderBy('date', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HospitalityEvent)));
        });
        return () => unsubscribe();
    }, []);

    const createEvent = async () => {
        const title = prompt("Event Title:");
        if (!title) return;

        await addDoc(collection(db, 'hospitality_events'), {
            title,
            date: "Saturday, TBD",
            time: "10:00 AM",
            location: "Main Hall",
            description: "New event description...",
            type: "Training",
            attendees: 0,
            createdAt: serverTimestamp()
        });
        toast.success("Event Created");
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this event?")) return;
        await deleteDoc(doc(db, 'hospitality_events', id));
        toast.success("Event Deleted");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-stone-900 uppercase">Events & Training</h3>
                <button onClick={createEvent} className="bg-orange-600 text-white px-4 py-2 rounded font-bold text-sm flex items-center gap-2 hover:bg-orange-700">
                    <HiPlus /> New Event
                </button>
            </div>
            <div className="grid gap-4">
                {events.map(e => (
                    <div key={e.id} className="bg-white border border-stone-200 p-4 rounded-xl flex justify-between items-center">
                        <div>
                            <h4 className="font-bold text-stone-900">{e.title}</h4>
                            <p className="text-sm text-stone-500">{e.type} &bull; {e.date}</p>
                        </div>
                        <button onClick={() => handleDelete(e.id)} className="text-stone-400 hover:text-red-600"><HiTrash className="w-5 h-5" /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HospitalityLeaderPanel;
