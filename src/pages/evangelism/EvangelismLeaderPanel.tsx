import React, { useState, useEffect } from 'react';
import { HiCalendar, HiUserAdd, HiTrash, HiChat, HiUserGroup, HiSpeakerphone } from 'react-icons/hi';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'react-hot-toast';
import type { EvangelismEvent, EvangelismConvert } from '../../types/evangelism';

const EvangelismLeaderPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState('events');

    return (
        <div className="space-y-8 font-sans">
            <div>
                <span className="text-orange-500 font-mono font-bold text-xs mb-2 block tracking-widest uppercase">Admin Panel</span>
                <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Evangelism Leadership</h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-stone-800 pb-1 overflow-x-auto">
                <TabButton
                    active={activeTab === 'events'}
                    onClick={() => setActiveTab('events')}
                    icon={<HiCalendar className="w-5 h-5" />}
                    label="Outreach Events"
                />
                <TabButton
                    active={activeTab === 'harvest'}
                    onClick={() => setActiveTab('harvest')}
                    icon={<HiUserAdd className="w-5 h-5" />}
                    label="Harvest Log (Converts)"
                />
                <TabButton
                    active={activeTab === 'stories'}
                    onClick={() => setActiveTab('stories')}
                    icon={<HiChat className="w-5 h-5" />}
                    label="Testimonies"
                />
                <TabButton
                    active={activeTab === 'squads'}
                    onClick={() => setActiveTab('squads')}
                    icon={<HiUserGroup className="w-5 h-5" />}
                    label="Active Squads"
                />
                <TabButton
                    active={activeTab === 'intel'}
                    onClick={() => setActiveTab('intel')}
                    icon={<HiSpeakerphone className="w-5 h-5" />}
                    label="Intel (Briefs)"
                />
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'events' && <EventManager />}
                {activeTab === 'harvest' && <ConvertManager />}
                {activeTab === 'stories' && <TestimonyManager />}
                {activeTab === 'squads' && <SquadManager />}
                {activeTab === 'intel' && <BriefManager />}
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
    <button
        onClick={onClick}
        className={`pb-4 px-4 text-sm font-bold uppercase transition-colors whitespace-nowrap ${active ? 'text-orange-500 border-b-2 border-orange-500' : 'text-stone-500 hover:text-stone-300'}`}
    >
        <div className="flex items-center gap-2">
            {icon} {label}
        </div>
    </button>
);

// --- Sub-Components ---

const EventManager = () => {
    const [events, setEvents] = useState<EvangelismEvent[]>([]);
    const [newEvent, setNewEvent] = useState({
        title: '', type: '', date: '', time: '', location: '', teamLead: '', slots: 20, urgency: 'low'
    });

    useEffect(() => {
        const q = query(collection(db, 'evangelism_events'), orderBy('date', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EvangelismEvent)));
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'evangelism_events'), {
                ...newEvent,
                filled: 0,
                status: 'open',
                createdAt: serverTimestamp()
            });
            toast.success("Outreach Event Created");
            setNewEvent({ title: '', type: '', date: '', time: '', location: '', teamLead: '', slots: 20, urgency: 'low' });
        } catch (error) {
            toast.error("Failed to create event");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Cancel this outreach?")) return;
        await deleteDoc(doc(db, 'evangelism_events', id));
        toast.success("Event Cancelled");
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-stone-900 border border-stone-800 p-6 rounded-xl shadow-sm h-fit">
                <h3 className="font-bold text-white mb-4 uppercase italic">Create Outreach</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Event Title" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} className="w-full bg-stone-950 border border-stone-800 text-white p-2 rounded" required />
                    <input type="text" placeholder="Type (e.g. Street, Door-to-Door)" value={newEvent.type} onChange={e => setNewEvent({ ...newEvent, type: e.target.value })} className="w-full bg-stone-950 border border-stone-800 text-white p-2 rounded" required />
                    <div className="grid grid-cols-2 gap-2">
                        <input type="text" placeholder="Date" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} className="w-full bg-stone-950 border border-stone-800 text-white p-2 rounded" required />
                        <input type="text" placeholder="Time" value={newEvent.time} onChange={e => setNewEvent({ ...newEvent, time: e.target.value })} className="w-full bg-stone-950 border border-stone-800 text-white p-2 rounded" required />
                    </div>
                    <input type="text" placeholder="Location" value={newEvent.location} onChange={e => setNewEvent({ ...newEvent, location: e.target.value })} className="w-full bg-stone-950 border border-stone-800 text-white p-2 rounded" required />
                    <input type="text" placeholder="Team Lead" value={newEvent.teamLead} onChange={e => setNewEvent({ ...newEvent, teamLead: e.target.value })} className="w-full bg-stone-950 border border-stone-800 text-white p-2 rounded" required />
                    <div className="grid grid-cols-2 gap-2">
                        <input type="number" placeholder="Slots" value={newEvent.slots} onChange={e => setNewEvent({ ...newEvent, slots: parseInt(e.target.value) })} className="w-full bg-stone-950 border border-stone-800 text-white p-2 rounded" required />
                        <select value={newEvent.urgency} onChange={e => setNewEvent({ ...newEvent, urgency: e.target.value })} className="w-full bg-stone-950 border border-stone-800 text-white p-2 rounded">
                            <option value="low">Low Urgency</option>
                            <option value="medium">Medium</option>
                            <option value="high">High Urgency</option>
                        </select>
                    </div>
                    <button className="w-full py-3 bg-orange-600 text-white font-black uppercase rounded hover:bg-orange-700">Create Event</button>
                </form>
            </div>
            <div className="space-y-4">
                {events.map(e => (
                    <div key={e.id} className="bg-stone-900 border border-stone-800 p-4 rounded-xl flex justify-between items-center shadow-sm">
                        <div>
                            <h4 className="font-bold text-white">{e.title}</h4>
                            <p className="text-xs text-stone-500">{e.date} @ {e.time}</p>
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${e.urgency === 'high' ? 'bg-red-900 text-red-500' : 'bg-blue-900 text-blue-500'}`}>{e.urgency}</span>
                        </div>
                        <button onClick={() => handleDelete(e.id)} className="text-stone-600 hover:text-red-600"><HiTrash className="w-5 h-5" /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ConvertManager = () => {
    const [converts, setConverts] = useState<EvangelismConvert[]>([]);
    const [newConvert, setNewConvert] = useState({
        name: '', location: '', contact: '', assignedTo: '', status: 'New'
    });

    useEffect(() => {
        const q = query(collection(db, 'evangelism_converts'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setConverts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EvangelismConvert)));
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'evangelism_converts'), {
                ...newConvert,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                createdAt: serverTimestamp()
            });
            toast.success("Convert Logged");
            setNewConvert({ name: '', location: '', contact: '', assignedTo: '', status: 'New' });
        } catch (error) {
            toast.error("Failed to log convert");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove record?")) return;
        await deleteDoc(doc(db, 'evangelism_converts', id));
        toast.success("Deleted");
    };

    const updateStatus = async (id: string, currentStatus: string) => {
        const nextStatus = currentStatus === 'New' ? 'Contacted' : currentStatus === 'Contacted' ? 'Baptized' : 'Discipled';
        await updateDoc(doc(db, 'evangelism_converts', id), { status: nextStatus });
        toast.success(`Updated to ${nextStatus}`);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-stone-900 border border-stone-800 p-6 rounded-xl shadow-sm h-fit">
                <h3 className="font-bold text-white mb-4 uppercase italic">Log New Soul</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Full Name" value={newConvert.name} onChange={e => setNewConvert({ ...newConvert, name: e.target.value })} className="w-full bg-stone-950 border border-stone-800 text-white p-2 rounded" required />
                    <input type="text" placeholder="Location Met" value={newConvert.location} onChange={e => setNewConvert({ ...newConvert, location: e.target.value })} className="w-full bg-stone-950 border border-stone-800 text-white p-2 rounded" required />
                    <input type="text" placeholder="Contact Info" value={newConvert.contact} onChange={e => setNewConvert({ ...newConvert, contact: e.target.value })} className="w-full bg-stone-950 border border-stone-800 text-white p-2 rounded" required />
                    <input type="text" placeholder="Assigned Team/Person" value={newConvert.assignedTo} onChange={e => setNewConvert({ ...newConvert, assignedTo: e.target.value })} className="w-full bg-stone-950 border border-stone-800 text-white p-2 rounded" />
                    <button className="w-full py-3 bg-green-600 text-white font-black uppercase rounded hover:bg-green-700">Log Convert</button>
                </form>
            </div>
            <div className="space-y-4">
                {converts.map(c => (
                    <div key={c.id} className="bg-stone-900 border border-stone-800 p-4 rounded-xl flex justify-between items-center shadow-sm">
                        <div>
                            <h4 className="font-bold text-white">{c.name}</h4>
                            <p className="text-xs text-stone-500">{c.contact} &bull; {c.location}</p>
                            <button onClick={() => updateStatus(c.id, c.status)} className="text-[10px] bg-stone-800 px-2 py-0.5 rounded text-orange-400 mt-1 hover:bg-stone-700">
                                Status: {c.status}
                            </button>
                        </div>
                        <button onClick={() => handleDelete(c.id)} className="text-stone-600 hover:text-red-600"><HiTrash className="w-5 h-5" /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TestimonyManager = () => {
    const [stories, setStories] = useState<any[]>([]);

    useEffect(() => {
        const q = query(collection(db, 'evangelism_stories'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setStories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this testimony?")) return;
        await deleteDoc(doc(db, 'evangelism_stories', id));
        toast.success("Testimony Removed");
    };

    return (
        <div className="space-y-6">
            <div className="bg-stone-900 border border-stone-800 p-4 rounded-xl">
                <p className="text-stone-400 text-sm">Testimonies are submitted by team members via the "Stories" page. Use this panel to moderate content.</p>
            </div>

            <div className="grid gap-4">
                {stories.map(s => (
                    <div key={s.id} className="bg-stone-900 border border-stone-800 p-6 rounded-xl relative group">
                        <button onClick={() => handleDelete(s.id)} className="absolute top-4 right-4 text-stone-600 hover:text-red-500"><HiTrash /></button>
                        <h4 className="font-bold text-white text-lg">"{s.title}"</h4>
                        <p className="text-stone-400 mt-2 text-sm">{s.content}</p>
                        <div className="mt-4 flex items-center gap-4 text-xs font-mono text-stone-500 uppercase">
                            <span>Author: {s.author}</span>
                            <span>Date: {s.date}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SquadManager = () => {
    const [squads, setSquads] = useState<any[]>([]);
    const [newSquad, setNewSquad] = useState({
        name: '', focus: '', lead: '', members: 0, colorTheme: 'orange'
    });

    useEffect(() => {
        const q = query(collection(db, 'evangelism_squads'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setSquads(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'evangelism_squads'), {
                ...newSquad,
                createdAt: serverTimestamp()
            });
            toast.success("Squad Deployed");
            setNewSquad({ name: '', focus: '', lead: '', members: 0, colorTheme: 'orange' });
        } catch (error) {
            toast.error("Failed to deploy squad");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Disband this squad?")) return;
        await deleteDoc(doc(db, 'evangelism_squads', id));
        toast.success("Squad Disbanded");
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-stone-900 border border-stone-800 p-6 rounded-xl shadow-sm h-fit">
                <h3 className="font-bold text-white mb-4 uppercase italic">Deploy New Squad</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Squad Name (e.g. Team Alpha)" value={newSquad.name} onChange={e => setNewSquad({ ...newSquad, name: e.target.value })} className="w-full bg-stone-950 border border-stone-800 text-white p-2 rounded" required />
                    <input type="text" placeholder="Operational Focus (e.g. Street)" value={newSquad.focus} onChange={e => setNewSquad({ ...newSquad, focus: e.target.value })} className="w-full bg-stone-950 border border-stone-800 text-white p-2 rounded" required />
                    <input type="text" placeholder="Team Lead" value={newSquad.lead} onChange={e => setNewSquad({ ...newSquad, lead: e.target.value })} className="w-full bg-stone-950 border border-stone-800 text-white p-2 rounded" required />

                    <div className="grid grid-cols-2 gap-2">
                        <input type="number" placeholder="Members Count" value={newSquad.members} onChange={e => setNewSquad({ ...newSquad, members: parseInt(e.target.value) })} className="w-full bg-stone-950 border border-stone-800 text-white p-2 rounded" required />
                        <select value={newSquad.colorTheme} onChange={e => setNewSquad({ ...newSquad, colorTheme: e.target.value })} className="w-full bg-stone-950 border border-stone-800 text-white p-2 rounded">
                            <option value="orange">Orange (Default)</option>
                            <option value="red">Red (Urgent)</option>
                            <option value="blue">Blue (Support)</option>
                            <option value="purple">Purple (Prayer)</option>
                            <option value="green">Green (Training)</option>
                        </select>
                    </div>

                    <button className="w-full py-3 bg-orange-600 text-white font-black uppercase rounded hover:bg-orange-700">Deploy Squad</button>
                </form>
            </div>
            <div className="space-y-4">
                {squads.map(s => (
                    <div key={s.id} className="bg-stone-900 border border-stone-800 p-4 rounded-xl flex justify-between items-center shadow-sm">
                        <div>
                            <h4 className="font-bold text-white">{s.name}</h4>
                            <p className="text-xs text-stone-500">{s.focus} &bull; Lead: {s.lead}</p>
                            <span className="text-[10px] bg-stone-800 px-2 py-0.5 rounded text-stone-400 mt-1 inline-block">
                                Members: {s.members}
                            </span>
                        </div>
                        <button onClick={() => handleDelete(s.id)} className="text-stone-600 hover:text-red-600"><HiTrash className="w-5 h-5" /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};



const BriefManager = () => {
    const [briefs, setBriefs] = useState<any[]>([]);
    const [newBrief, setNewBrief] = useState({
        title: '', author: '', priority: 'normal', content: '', date: ''
    });

    useEffect(() => {
        const q = query(collection(db, 'evangelism_briefs'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setBriefs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'evangelism_briefs'), {
                ...newBrief,
                date: newBrief.date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                createdAt: serverTimestamp()
            });
            toast.success("Intel Brief Published");
            setNewBrief({ title: '', author: '', priority: 'normal', content: '', date: '' });
        } catch (error) {
            toast.error("Failed to publish brief");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Declassify this brief?")) return;
        await deleteDoc(doc(db, 'evangelism_briefs', id));
        toast.success("Brief Removed");
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-stone-900 border border-stone-800 p-6 rounded-xl shadow-sm h-fit">
                <h3 className="font-bold text-white mb-4 uppercase italic">Issue Campaign Brief</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Subject / Title" value={newBrief.title} onChange={e => setNewBrief({ ...newBrief, title: e.target.value })} className="w-full bg-stone-950 border border-stone-800 text-white p-2 rounded" required />
                    <input type="text" placeholder="Issuer (e.g. Director)" value={newBrief.author} onChange={e => setNewBrief({ ...newBrief, author: e.target.value })} className="w-full bg-stone-950 border border-stone-800 text-white p-2 rounded" required />

                    <div className="grid grid-cols-2 gap-2">
                        <input type="text" placeholder="Date Override (Optional)" value={newBrief.date} onChange={e => setNewBrief({ ...newBrief, date: e.target.value })} className="w-full bg-stone-950 border border-stone-800 text-white p-2 rounded" />
                        <select value={newBrief.priority} onChange={e => setNewBrief({ ...newBrief, priority: e.target.value })} className="w-full bg-stone-950 border border-stone-800 text-white p-2 rounded">
                            <option value="normal">Normal Priority</option>
                            <option value="warning">Warning / Caution</option>
                            <option value="critical">Critical / Action Req.</option>
                        </select>
                    </div>

                    <textarea placeholder="Briefing Content..." value={newBrief.content} onChange={e => setNewBrief({ ...newBrief, content: e.target.value })} className="w-full bg-stone-950 border border-stone-800 text-white p-2 rounded h-24" required />

                    <button className="w-full py-3 bg-orange-600 text-white font-black uppercase rounded hover:bg-orange-700">Publish Intel</button>
                </form>
            </div>
            <div className="space-y-4">
                {briefs.map(b => (
                    <div key={b.id} className="bg-stone-900 border border-stone-800 p-4 rounded-xl shadow-sm relative overflow-hidden">
                        {b.priority === 'critical' && <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500 m-2 animate-pulse"></div>}
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-white">{b.title}</h4>
                                <p className="text-xs text-stone-500 font-mono uppercase">{b.priority} &bull; {b.date}</p>
                            </div>
                            <button onClick={() => handleDelete(b.id)} className="text-stone-600 hover:text-red-600"><HiTrash className="w-5 h-5" /></button>
                        </div>
                        <p className="text-stone-400 text-xs mt-2 line-clamp-2">{b.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EvangelismLeaderPanel;
