import React, { useState, useEffect } from 'react';
import { HiClock, HiUser, HiTrash, HiCheck, HiLockClosed, HiUserGroup, HiSpeakerphone, HiCalendar, HiLocationMarker } from 'react-icons/hi';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp, updateDoc, where } from 'firebase/firestore';
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
                <TabButton
                    active={activeTab === 'teams'}
                    onClick={() => setActiveTab('teams')}
                    icon={<HiUserGroup className="w-5 h-5" />}
                    label="Intercessor Teams"
                />
                <TabButton
                    active={activeTab === 'intel'}
                    onClick={() => setActiveTab('intel')}
                    icon={<HiSpeakerphone className="w-5 h-5" />}
                    label="Spiritual Intel"
                />
                <TabButton
                    active={activeTab === 'events'}
                    onClick={() => setActiveTab('events')}
                    icon={<HiCalendar className="w-5 h-5" />}
                    label="Holy Convocations"
                />
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'requests' && <RequestManager />}
                {activeTab === 'schedule' && <ScheduleManager />}
                {activeTab === 'teams' && <TeamManager />}
                {activeTab === 'intel' && <IntelManager />}
                {activeTab === 'events' && <EventManager />}
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

const IntelManager = () => {
    const [briefs, setBriefs] = useState<any[]>([]);
    const [newBrief, setNewBrief] = useState({
        title: '', author: '', role: '', content: '', priority: 'normal'
    });

    useEffect(() => {
        const q = query(collection(db, 'prayer_intel'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setBriefs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'prayer_intel'), {
                ...newBrief,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), // Simple date format for display
                createdAt: serverTimestamp()
            });
            toast.success("Intel Brief Published");
            setNewBrief({ title: '', author: '', role: '', content: '', priority: 'normal' });
        } catch (error) {
            toast.error("Failed to publish brief");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this brief?")) return;
        await deleteDoc(doc(db, 'prayer_intel', id));
        toast.success("Brief Removed");
    };

    return (
        <div className="space-y-8">
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
                <h3 className="font-bold text-white mb-4 uppercase italic">Publish Intel</h3>
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Title / Headline" value={newBrief.title} onChange={e => setNewBrief({ ...newBrief, title: e.target.value })} className="bg-slate-950 border border-slate-800 text-white p-2 rounded" required />
                        <select value={newBrief.priority} onChange={e => setNewBrief({ ...newBrief, priority: e.target.value })} className="bg-slate-950 border border-slate-800 text-white p-2 rounded">
                            <option value="normal">Standard Update</option>
                            <option value="urgent">Urgent Alert</option>
                        </select>
                        <input type="text" placeholder="Author Name" value={newBrief.author} onChange={e => setNewBrief({ ...newBrief, author: e.target.value })} className="bg-slate-950 border border-slate-800 text-white p-2 rounded" required />
                        <input type="text" placeholder="Role (e.g. Pastor)" value={newBrief.role} onChange={e => setNewBrief({ ...newBrief, role: e.target.value })} className="bg-slate-950 border border-slate-800 text-white p-2 rounded" required />
                    </div>
                    <textarea placeholder="Brief Content..." value={newBrief.content} onChange={e => setNewBrief({ ...newBrief, content: e.target.value })} className="bg-slate-950 border border-slate-800 text-white p-2 rounded h-24" required />
                    <button className="py-3 bg-indigo-600 text-white font-bold uppercase rounded hover:bg-indigo-700">Publish Brief</button>
                </form>
            </div>

            <div className="grid gap-4">
                {briefs.map(brief => (
                    <div key={brief.id} className={`bg-slate-900 border border-slate-800 p-4 rounded-xl flex justify-between items-start shadow-sm ${brief.priority === 'urgent' ? 'border-l-4 border-l-red-500' : ''}`}>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-white">{brief.title}</h4>
                                {brief.priority === 'urgent' && <span className="text-[10px] bg-red-900 text-red-400 px-2 py-0.5 rounded font-bold uppercase">Urgent</span>}
                            </div>
                            <p className="text-sm text-slate-400 line-clamp-2">{brief.content}</p>
                            <p className="text-xs text-slate-500 mt-2">{brief.author} &bull; {brief.date}</p>
                        </div>
                        <button onClick={() => handleDelete(brief.id)} className="text-slate-600 hover:text-red-500 p-2"><HiTrash className="w-5 h-5" /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};



// --- Sub-Components ---

const TeamManager = () => {
    const [teams, setTeams] = useState<any[]>([]);
    const [workers, setWorkers] = useState<any[]>([]);
    const [newTeam, setNewTeam] = useState({
        name: '', description: '', leaderName: '', leaderRole: ''
    });
    const [selectedWorker, setSelectedWorker] = useState('');

    // Fetch Teams
    useEffect(() => {
        const q = query(collection(db, 'prayer_teams'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setTeams(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    // Fetch Workers
    useEffect(() => {
        // Query donor collection where worker == true
        // Note: 'donor' collection name from user request/screenshot (singular 'donor' node in screenshot implies collection name might be 'donor' or 'donors'. I will try 'donor' based on screenshot label but usually it's plural. Screenshot says "donor" as a root key. I will assume 'donors' or 'donor'. Let's try 'donor' first as per screenshot root, or better, query both if unsure, but standard is plural. Wait, typically users name it 'users' or 'members'. The screenshot shows a root node "donor". I'll use 'donor').
        const fetchWorkers = async () => {
            // In real app, might need to be careful with large collections. Assuming small list of workers.
            // We need to query where worker == true.
            const q = query(collection(db, 'donor'), where('worker', '==', true));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                setWorkers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            });
            return () => unsubscribe();
        };
        fetchWorkers();
    }, []);

    const handleCreateTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'prayer_teams'), {
                name: newTeam.name,
                description: newTeam.description,
                leader: {
                    name: newTeam.leaderName,
                    role: newTeam.leaderRole,
                    image: `https://ui-avatars.com/api/?name=${newTeam.leaderName}&background=random` // Placeholder
                },
                members: [],
                createdAt: serverTimestamp()
            });
            toast.success("Team Created");
            setNewTeam({ name: '', description: '', leaderName: '', leaderRole: '' });
        } catch (error) {
            toast.error("Failed to create team");
        }
    };

    const handleDeleteTeam = async (id: string) => {
        if (!confirm("Disband this team?")) return;
        await deleteDoc(doc(db, 'prayer_teams', id));
        toast.success("Team Disbanded");
    };

    const handleAddMember = async (teamId: string, currentMembers: any[]) => {
        if (!selectedWorker) return;
        const worker = workers.find(w => w.id === selectedWorker);
        if (!worker) return;

        const newMember = {
            name: `${worker['First Name']} ${worker['Last Name']}`,
            role: 'Intercessor', // Default role
            uid: worker.id
        };

        const updatedMembers = [...(currentMembers || []), newMember];

        await updateDoc(doc(db, 'prayer_teams', teamId), {
            members: updatedMembers
        });
        toast.success("Member Added");
        setSelectedWorker('');
    };

    const removeMember = async (teamId: string, currentMembers: any[], memberIndex: number) => {
        const updatedMembers = currentMembers.filter((_, idx) => idx !== memberIndex);
        await updateDoc(doc(db, 'prayer_teams', teamId), {
            members: updatedMembers
        });
        toast.success("Member Removed");
    };

    return (
        <div className="space-y-8">
            {/* Create Team Form */}
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
                <h3 className="font-bold text-white mb-4 uppercase italic">Form New Unit</h3>
                <form onSubmit={handleCreateTeam} className="grid md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Team Name (e.g. Night Watch)" value={newTeam.name} onChange={e => setNewTeam({ ...newTeam, name: e.target.value })} className="bg-slate-950 border border-slate-800 text-white p-2 rounded" required />
                    <input type="text" placeholder="Mission / Description" value={newTeam.description} onChange={e => setNewTeam({ ...newTeam, description: e.target.value })} className="bg-slate-950 border border-slate-800 text-white p-2 rounded" required />
                    <input type="text" placeholder="Leader Name" value={newTeam.leaderName} onChange={e => setNewTeam({ ...newTeam, leaderName: e.target.value })} className="bg-slate-950 border border-slate-800 text-white p-2 rounded" required />
                    <input type="text" placeholder="Leader Role Title" value={newTeam.leaderRole} onChange={e => setNewTeam({ ...newTeam, leaderRole: e.target.value })} className="bg-slate-950 border border-slate-800 text-white p-2 rounded" required />
                    <button className="md:col-span-2 py-3 bg-indigo-600 text-white font-bold uppercase rounded hover:bg-indigo-700">Create Team</button>
                </form>
            </div>

            {/* Teams List */}
            <div className="grid gap-6">
                {teams.map(team => (
                    <div key={team.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                            <div>
                                <h4 className="font-bold text-white text-lg">{team.name}</h4>
                                <p className="text-slate-500 text-sm">{team.description}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-indigo-400 font-bold uppercase px-2 py-1 bg-indigo-900/20 rounded border border-indigo-900/50">Leader: {team.leader?.name}</span>
                                <button onClick={() => handleDeleteTeam(team.id)} className="text-slate-600 hover:text-red-500"><HiTrash className="w-5 h-5" /></button>
                            </div>
                        </div>

                        <div className="p-4">
                            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Team Members</h5>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {team.members?.map((m: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                                        <span className="text-sm text-slate-300 font-medium">{m.name}</span>
                                        <button onClick={() => removeMember(team.id, team.members, idx)} className="text-slate-500 hover:text-red-400"><HiTrash className="w-3 h-3" /></button>
                                    </div>
                                ))}
                                {(!team.members || team.members.length === 0) && <span className="text-sm text-slate-600 italic">No members assigned.</span>}
                            </div>

                            <div className="flex gap-2 max-w-md">
                                <select
                                    value={selectedWorker}
                                    onChange={e => setSelectedWorker(e.target.value)}
                                    className="flex-1 bg-slate-950 border border-slate-800 text-white text-sm p-2 rounded"
                                >
                                    <option value="">Select Worker to Add...</option>
                                    {workers.map(w => (
                                        <option key={w.id} value={w.id}>{w['First Name']} {w['Last Name']}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => handleAddMember(team.id, team.members)}
                                    className="px-4 py-2 bg-slate-800 text-indigo-400 text-xs font-bold uppercase rounded border border-slate-700 hover:bg-slate-700 disabled:opacity-50"
                                    disabled={!selectedWorker}
                                >
                                    Add Itercessor
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

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


const EventManager = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [newEvent, setNewEvent] = useState({
        title: '', description: '', date: '', time: '', location: '', type: 'Vigil'
    });

    useEffect(() => {
        const q = query(collection(db, 'prayer_events'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'prayer_events'), {
                ...newEvent,
                attendees: 0,
                createdAt: serverTimestamp()
            });
            toast.success("Event Scheduled");
            setNewEvent({ title: '', description: '', date: '', time: '', location: '', type: 'Vigil' });
        } catch (error) {
            toast.error("Failed to schedule event");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Cancel this event?")) return;
        await deleteDoc(doc(db, 'prayer_events', id));
        toast.success("Event Cancelled");
    };

    return (
        <div className="space-y-8">
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
                <h3 className="font-bold text-white mb-4 uppercase italic">Schedule Convocation</h3>
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Event Title" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} className="bg-slate-950 border border-slate-800 text-white p-2 rounded" required />
                        <select value={newEvent.type} onChange={e => setNewEvent({ ...newEvent, type: e.target.value })} className="bg-slate-950 border border-slate-800 text-white p-2 rounded">
                            <option value="Vigil">Vigil</option>
                            <option value="Workshop">Workshop</option>
                            <option value="Weekly">Weekly Service</option>
                            <option value="Special">Special Gathering</option>
                        </select>
                        <input type="text" placeholder="Date (e.g. Friday, Dec 01)" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} className="bg-slate-950 border border-slate-800 text-white p-2 rounded" required />
                        <input type="text" placeholder="Time Range" value={newEvent.time} onChange={e => setNewEvent({ ...newEvent, time: e.target.value })} className="bg-slate-950 border border-slate-800 text-white p-2 rounded" required />
                    </div>
                    <input type="text" placeholder="Location (e.g. Sanctuary)" value={newEvent.location} onChange={e => setNewEvent({ ...newEvent, location: e.target.value })} className="bg-slate-950 border border-slate-800 text-white p-2 rounded" required />
                    <textarea placeholder="Description..." value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} className="bg-slate-950 border border-slate-800 text-white p-2 rounded h-20" required />
                    <button className="py-3 bg-indigo-600 text-white font-bold uppercase rounded hover:bg-indigo-700">Schedule Event</button>
                </form>
            </div>

            <div className="grid gap-4">
                {events.map(event => (
                    <div key={event.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded bg-slate-800 flex flex-col items-center justify-center text-slate-400 border border-slate-700">
                                <HiCalendar className="w-5 h-5 mb-1" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-lg">{event.title}</h4>
                                <p className="text-sm text-indigo-400 font-bold uppercase tracking-wider">{event.type} &bull; {event.date} @ {event.time}</p>
                                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><HiLocationMarker className="w-3 h-3" /> {event.location}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden md:block">
                                <span className="block text-2xl font-bold text-white">{event.attendees || 0}</span>
                                <span className="text-[10px] text-slate-500 uppercase">Attendees</span>
                            </div>
                            <button onClick={() => handleDelete(event.id)} className="text-slate-600 hover:text-red-500 p-2"><HiTrash className="w-5 h-5" /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PrayerLeaderPanel;
