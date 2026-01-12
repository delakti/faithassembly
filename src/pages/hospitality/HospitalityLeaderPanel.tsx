import React, { useState, useEffect } from 'react';
import { HiUserGroup, HiCalendar, HiSparkles, HiTrash, HiPlus } from 'react-icons/hi';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { ref, get } from 'firebase/database';
import { db, database } from '../../firebase';
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

    // Search State
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searching, setSearching] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState<any | null>(null);

    // Form State for selected worker
    const [role, setRole] = useState('Volunteer');
    const [team, setTeam] = useState('Greeting');

    useEffect(() => {
        const q = query(collection(db, 'hospitality_team'), orderBy('name', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HospitalityMember)));
        });
        return () => unsubscribe();
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        setSearching(true);
        setSelectedWorker(null);
        try {
            // Updated to use Realtime Database
            const donorsRef = ref(database, 'donor');
            const snapshot = await get(donorsRef);

            if (snapshot.exists()) {
                const data = snapshot.val();
                // Convert object to array
                const donorsArray = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));

                const results = donorsArray
                    .filter((d: any) => d.worker === true) // Filter for workers
                    .filter((d: any) => {
                        const fullName = `${d['First Name']} ${d['Last Name']}`.toLowerCase();
                        return fullName.includes(searchTerm.toLowerCase());
                    })
                    .slice(0, 5); // Limit results

                setSearchResults(results);
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            console.error(error);
            toast.error("Search failed");
        } finally {
            setSearching(false);
        }
    };

    const handleAddMember = async () => {
        if (!selectedWorker) return;

        try {
            const newMember = {
                name: `${selectedWorker['First Name']} ${selectedWorker['Last Name']}`,
                phone: selectedWorker['Mobile Phone'] || '',
                email: selectedWorker['Email'] || '',
                role,
                team,
                donorId: selectedWorker.id,
                status: 'active',
                createdAt: serverTimestamp()
            };

            await addDoc(collection(db, 'hospitality_team'), newMember);
            toast.success(`${newMember.name} added to ${team} Team`);

            // Reset
            setSelectedWorker(null);
            setSearchTerm('');
            setSearchResults([]);
        } catch (error) {
            console.error(error);
            toast.error("Failed to add member");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Remove this member?")) return;
        await deleteDoc(doc(db, 'hospitality_team', id));
        toast.success("Member Removed");
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white border border-stone-200 p-6 rounded-xl shadow-sm h-fit">
                <h3 className="font-bold text-stone-900 mb-4 uppercase flex items-center gap-2">
                    <HiPlus className="text-orange-600" /> Add Team Member
                </h3>

                {/* Search Step */}
                <div className="space-y-4 mb-6">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Search Worker Name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 bg-stone-50 border border-stone-200 p-2 rounded focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                        <button type="submit" disabled={searching} className="bg-stone-800 text-white px-4 py-2 rounded font-bold uppercase text-xs hover:bg-stone-900">
                            {searching ? '...' : 'Find'}
                        </button>
                    </form>

                    {/* Results List */}
                    {searchResults.length > 0 && !selectedWorker && (
                        <div className="bg-stone-50 border border-stone-200 rounded-lg overflow-hidden">
                            {searchResults.map(worker => (
                                <button
                                    key={worker.id}
                                    onClick={() => setSelectedWorker(worker)}
                                    className="w-full text-left p-3 hover:bg-orange-50 hover:text-orange-700 border-b last:border-0 border-stone-200 flex justify-between items-center transition-colors"
                                >
                                    <span className="font-bold">{worker['First Name']} {worker['Last Name']}</span>
                                    <span className="text-xs bg-stone-200 text-stone-600 px-2 py-1 rounded">Select</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {searchResults.length === 0 && searchTerm && !searching && !selectedWorker && (
                        <p className="text-xs text-stone-400 italic">No workers found. Ensure they are tagged as 'worker: true' in the Donor database.</p>
                    )}
                </div>

                {/* Assignment Step */}
                {selectedWorker && (
                    <div className="animate-fade-in bg-orange-50 border border-orange-100 p-4 rounded-lg space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs text-orange-500 font-bold uppercase mb-1">Selected Worker</p>
                                <p className="font-bold text-lg text-stone-900">{selectedWorker['First Name']} {selectedWorker['Last Name']}</p>
                                <p className="text-xs text-stone-500">{selectedWorker['Email']}</p>
                            </div>
                            <button onClick={() => setSelectedWorker(null)} className="text-stone-400 hover:text-stone-600">
                                <HiTrash />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-stone-500 uppercase mb-1 block">Role</label>
                                <select value={role} onChange={e => setRole(e.target.value)} className="w-full bg-white border border-stone-200 p-2 rounded text-sm">
                                    <option value="Team Lead">Team Lead</option>
                                    <option value="Volunteer">Volunteer</option>
                                    <option value="Trainee">Trainee</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-stone-500 uppercase mb-1 block">Team</label>
                                <select value={team} onChange={e => setTeam(e.target.value)} className="w-full bg-white border border-stone-200 p-2 rounded text-sm">
                                    <option value="Greeting">Greeting</option>
                                    <option value="Coffee">Coffee</option>
                                    <option value="Cooking">Cooking</option>
                                    <option value="Setup">Setup</option>
                                    <option value="Events">Events</option>
                                </select>
                            </div>
                        </div>

                        <button onClick={handleAddMember} className="w-full py-3 bg-orange-600 text-white font-bold uppercase rounded hover:bg-orange-700 transition shadow-sm">
                            Confirm Assignment
                        </button>
                    </div>
                )}
            </div>

            {/* List */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
                <h3 className="font-bold text-stone-900 uppercase">Current Team ({members.length})</h3>
                {members.length === 0 ? (
                    <p className="text-stone-400 italic">No team members yet.</p>
                ) : members.map(m => (
                    <div key={m.id} className="bg-white border border-stone-200 p-4 rounded-xl flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${m.role === 'Team Lead' ? 'bg-orange-500' : 'bg-stone-300'}`}>
                                {m.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-bold text-stone-900">{m.name}</h4>
                                <p className="text-xs text-stone-500 font-bold uppercase tracking-wide">{m.role} &bull; <span className="text-orange-600">{m.team} Team</span></p>
                            </div>
                        </div>
                        <button onClick={() => handleDelete(m.id)} className="p-2 text-stone-300 hover:text-red-600 hover:bg-red-50 rounded transition">
                            <HiTrash className="w-5 h-5" />
                        </button>
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
