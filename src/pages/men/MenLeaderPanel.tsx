import React, { useState, useEffect } from 'react';
import { HiFire, HiCalendar, HiLightningBolt, HiTrash, HiBookOpen, HiCollection } from 'react-icons/hi';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'react-hot-toast';
import type { MenEvent, MenAnnouncement, MenChallenge } from '../../types/men';

const MenLeaderPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState('missions');

    return (
        <div className="space-y-8 font-sans">
            <div>
                <span className="text-indigo-500 font-mono font-bold text-xs mb-2 block tracking-widest uppercase">Command Center</span>
                <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-tight italic">Men's Leadership</h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-200 pb-1 overflow-x-auto">
                <TabButton
                    active={activeTab === 'missions'}
                    onClick={() => setActiveTab('missions')}
                    icon={<HiCalendar className="w-5 h-5" />}
                    label="Missions (Events)"
                />
                <TabButton
                    active={activeTab === 'intel'}
                    onClick={() => setActiveTab('intel')}
                    icon={<HiLightningBolt className="w-5 h-5" />}
                    label="Intel (Announce)"
                />
                <TabButton
                    active={activeTab === 'challenges'}
                    onClick={() => setActiveTab('challenges')}
                    icon={<HiFire className="w-5 h-5" />}
                    label="Challenges"
                />
                <TabButton
                    active={activeTab === 'verse'}
                    onClick={() => setActiveTab('verse')}
                    icon={<HiBookOpen className="w-5 h-5" />}
                    label="Verse of Day"
                />
                <TabButton
                    active={activeTab === 'armory'}
                    onClick={() => setActiveTab('armory')}
                    icon={<HiCollection className="w-5 h-5" />}
                    label="Armory (Resources)"
                />
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'missions' && <MissionManager />}
                {activeTab === 'intel' && <IntelManager />}
                {activeTab === 'challenges' && <ChallengeManager />}
                {activeTab === 'verse' && <VerseManager />}
                {activeTab === 'armory' && <ResourceManager />}
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
    <button
        onClick={onClick}
        className={`pb-4 px-4 text-sm font-bold uppercase transition-colors whitespace-nowrap ${active ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
    >
        <div className="flex items-center gap-2">
            {icon} {label}
        </div>
    </button>
);

// --- Sub-Components ---

const MissionManager = () => {
    const [missions, setMissions] = useState<MenEvent[]>([]);
    const [newMission, setNewMission] = useState({
        title: '', objective: '', date: '', time: '', location: '', image: '', spots: 20
    });

    useEffect(() => {
        const q = query(collection(db, 'men_events'), orderBy('date', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMissions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenEvent)));
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'men_events'), {
                ...newMission,
                createdAt: serverTimestamp()
            });
            toast.success("Mission Deployment Added");
            setNewMission({ title: '', objective: '', date: '', time: '', location: '', image: '', spots: 20 });
        } catch (error) {
            toast.error("Deployment Failed");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Abort Mission?")) return;
        await deleteDoc(doc(db, 'men_events', id));
        toast.success("Mission Aborted");
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm h-fit">
                <h3 className="font-bold text-slate-900 mb-4 uppercase italic">Deploy New Mission</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Mission Title" value={newMission.title} onChange={e => setNewMission({ ...newMission, title: e.target.value })} className="w-full border p-2 rounded" required />
                    <input type="text" placeholder="Objective (e.g. Service)" value={newMission.objective} onChange={e => setNewMission({ ...newMission, objective: e.target.value })} className="w-full border p-2 rounded" required />
                    <div className="grid grid-cols-2 gap-2">
                        <input type="text" placeholder="Date (e.g. Sat, Nov 11)" value={newMission.date} onChange={e => setNewMission({ ...newMission, date: e.target.value })} className="w-full border p-2 rounded" required />
                        <input type="text" placeholder="Time (e.g. 0800 Hours)" value={newMission.time} onChange={e => setNewMission({ ...newMission, time: e.target.value })} className="w-full border p-2 rounded" required />
                    </div>
                    <input type="text" placeholder="Location" value={newMission.location} onChange={e => setNewMission({ ...newMission, location: e.target.value })} className="w-full border p-2 rounded" required />
                    <input type="text" placeholder="Image URL" value={newMission.image} onChange={e => setNewMission({ ...newMission, image: e.target.value })} className="w-full border p-2 rounded" />
                    <input type="number" placeholder="Open Slots" value={newMission.spots} onChange={e => setNewMission({ ...newMission, spots: parseInt(e.target.value) })} className="w-full border p-2 rounded" required />
                    <button className="w-full py-3 bg-indigo-600 text-white font-black uppercase rounded hover:bg-indigo-700">Deploy Mission</button>
                </form>
            </div>
            <div className="space-y-4">
                {missions.map(m => (
                    <div key={m.id} className="bg-white border border-slate-200 p-4 rounded-xl flex justify-between items-center shadow-sm">
                        <div>
                            <h4 className="font-bold text-slate-900">{m.title}</h4>
                            <p className="text-xs text-slate-500">{m.date} @ {m.time}</p>
                        </div>
                        <button onClick={() => handleDelete(m.id)} className="text-slate-400 hover:text-red-600"><HiTrash className="w-5 h-5" /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const IntelManager = () => {
    const [intel, setIntel] = useState<MenAnnouncement[]>([]);
    const [newIntel, setNewIntel] = useState({
        title: '', author: '', preview: '', image: '', tags: ''
    });

    useEffect(() => {
        const q = query(collection(db, 'men_announcements'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setIntel(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenAnnouncement)));
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'men_announcements'), {
                ...newIntel,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                tags: newIntel.tags.split(',').map(t => t.trim()),
                createdAt: serverTimestamp()
            });
            toast.success("Intel Published");
            setNewIntel({ title: '', author: '', preview: '', image: '', tags: '' });
        } catch (error) {
            toast.error("Failed to publish");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this intel?")) return;
        await deleteDoc(doc(db, 'men_announcements', id));
        toast.success("Deleted");
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm h-fit">
                <h3 className="font-bold text-slate-900 mb-4 uppercase italic">Publish Intel</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Title" value={newIntel.title} onChange={e => setNewIntel({ ...newIntel, title: e.target.value })} className="w-full border p-2 rounded" required />
                    <input type="text" placeholder="Author" value={newIntel.author} onChange={e => setNewIntel({ ...newIntel, author: e.target.value })} className="w-full border p-2 rounded" required />
                    <textarea placeholder="Preview/Content" value={newIntel.preview} onChange={e => setNewIntel({ ...newIntel, preview: e.target.value })} className="w-full border p-2 rounded h-24" required />
                    <input type="text" placeholder="Image URL" value={newIntel.image} onChange={e => setNewIntel({ ...newIntel, image: e.target.value })} className="w-full border p-2 rounded" />
                    <input type="text" placeholder="Tags (comma separated)" value={newIntel.tags} onChange={e => setNewIntel({ ...newIntel, tags: e.target.value })} className="w-full border p-2 rounded" />
                    <button className="w-full py-3 bg-orange-600 text-white font-black uppercase rounded hover:bg-orange-700">Publish Intel</button>
                </form>
            </div>
            <div className="space-y-4">
                {intel.map(i => (
                    <div key={i.id} className="bg-white border border-slate-200 p-4 rounded-xl flex justify-between items-start shadow-sm">
                        <div>
                            <h4 className="font-bold text-slate-900">{i.title}</h4>
                            <p className="text-xs text-slate-500 line-clamp-2">{i.preview}</p>
                        </div>
                        <button onClick={() => handleDelete(i.id)} className="text-slate-400 hover:text-red-600"><HiTrash className="w-5 h-5" /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ChallengeManager = () => {
    const [challenges, setChallenges] = useState<MenChallenge[]>([]);
    const [newChallenge, setNewChallenge] = useState({ title: '', content: '', verse: '' });

    useEffect(() => {
        const q = query(collection(db, 'men_challenges'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setChallenges(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenChallenge)));
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'men_challenges'), {
                ...newChallenge,
                createdAt: serverTimestamp()
            });
            toast.success("Challenge Issued");
            setNewChallenge({ title: '', content: '', verse: '' });
        } catch (error) {
            toast.error("Failed");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Revoke challenge?")) return;
        await deleteDoc(doc(db, 'men_challenges', id));
        toast.success("Revoked");
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm h-fit">
                <h3 className="font-bold text-slate-900 mb-4 uppercase italic">Issue Daily Challenge</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Card Title (e.g. Daily Challenge)" value={newChallenge.title} onChange={e => setNewChallenge({ ...newChallenge, title: e.target.value })} className="w-full border p-2 rounded" required />
                    <input type="text" placeholder="Content (e.g. Read Romans 12...)" value={newChallenge.content} onChange={e => setNewChallenge({ ...newChallenge, content: e.target.value })} className="w-full border p-2 rounded" required />
                    <input type="text" placeholder="Reference Verse (optional)" value={newChallenge.verse} onChange={e => setNewChallenge({ ...newChallenge, verse: e.target.value })} className="w-full border p-2 rounded" />
                    <button className="w-full py-3 bg-red-600 text-white font-black uppercase rounded hover:bg-red-700">Issue Challenge</button>
                </form>
            </div>
            <div className="space-y-4">
                {challenges.map(c => (
                    <div key={c.id} className="bg-white border border-slate-200 p-4 rounded-xl flex justify-between items-start shadow-sm">
                        <div>
                            <h4 className="font-bold text-slate-900">{c.title}</h4>
                            <p className="text-xs text-slate-500">{c.content}</p>
                        </div>
                        <button onClick={() => handleDelete(c.id)} className="text-slate-400 hover:text-red-600"><HiTrash className="w-5 h-5" /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const VerseManager = () => {
    const [verses, setVerses] = useState<any[]>([]);
    const [newVerse, setNewVerse] = useState({ text: '', reference: '' });

    useEffect(() => {
        const q = query(collection(db, 'men_verses'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setVerses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'men_verses'), {
                ...newVerse,
                createdAt: serverTimestamp()
            });
            toast.success("Verse Set");
            setNewVerse({ text: '', reference: '' });
        } catch (error) {
            toast.error("Failed");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete verse?")) return;
        await deleteDoc(doc(db, 'men_verses', id));
        toast.success("Deleted");
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm h-fit">
                <h3 className="font-bold text-slate-900 mb-4 uppercase italic">Set Verse of the Day</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                        placeholder="Verse Text (e.g. Have I not commanded you...)"
                        value={newVerse.text}
                        onChange={e => setNewVerse({ ...newVerse, text: e.target.value })}
                        className="w-full border p-2 rounded h-32"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Reference (e.g. Joshua 1:9)"
                        value={newVerse.reference}
                        onChange={e => setNewVerse({ ...newVerse, reference: e.target.value })}
                        className="w-full border p-2 rounded"
                        required
                    />
                    <button className="w-full py-3 bg-indigo-900 text-white font-black uppercase rounded hover:bg-slate-800">Set Verse</button>
                </form>
            </div>
            <div className="space-y-4">
                {verses.map(v => (
                    <div key={v.id} className="bg-white border border-slate-200 p-4 rounded-xl flex justify-between items-start shadow-sm">
                        <div>
                            <p className="font-serif italic text-slate-800 mb-1">"{v.text}"</p>
                            <p className="text-xs font-bold text-indigo-600 uppercase">{v.reference}</p>
                        </div>
                        <button onClick={() => handleDelete(v.id)} className="text-slate-400 hover:text-red-600"><HiTrash className="w-5 h-5" /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ResourceManager = () => {
    const [resources, setResources] = useState<any[]>([]);
    const [newResource, setNewResource] = useState({
        title: '', type: 'book', author: '', desc: '', image: '', url: ''
    });

    useEffect(() => {
        const q = query(collection(db, 'men_resources'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setResources(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'men_resources'), {
                ...newResource,
                createdAt: serverTimestamp()
            });
            toast.success("Resource Added to Armory");
            setNewResource({ title: '', type: 'book', author: '', desc: '', image: '', url: '' });
        } catch (error) {
            toast.error("Failed to add resource");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Decommission this resource?")) return;
        try {
            await deleteDoc(doc(db, 'men_resources', id));
            toast.success("Resource Removed");
        } catch (error) {
            toast.error("Failed to remove resource");
        }
    };

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 uppercase mb-4">Stock the Armory</h3>
                <form onSubmit={handleAdd} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <select
                            className="w-full p-3 bg-slate-50 rounded border border-slate-200 font-bold text-sm"
                            value={newResource.type}
                            onChange={e => setNewResource({ ...newResource, type: e.target.value })}
                        >
                            <option value="book">Book</option>
                            <option value="video">Video Intel</option>
                            <option value="pdf">PDF Guide</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Author / Source"
                            className="w-full p-3 bg-slate-50 rounded border border-slate-200 font-bold"
                            value={newResource.author}
                            onChange={e => setNewResource({ ...newResource, author: e.target.value })}
                            required
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Resource Title"
                        className="w-full p-3 bg-slate-50 rounded border border-slate-200 font-bold"
                        value={newResource.title}
                        onChange={e => setNewResource({ ...newResource, title: e.target.value })}
                        required
                    />
                    <textarea
                        placeholder="Description (Brief)"
                        className="w-full p-3 bg-slate-50 rounded border border-slate-200 font-medium h-24"
                        value={newResource.desc}
                        onChange={e => setNewResource({ ...newResource, desc: e.target.value })}
                        required
                    />
                    <input
                        type="url"
                        placeholder="Cover Image URL (Optional)"
                        className="w-full p-3 bg-slate-50 rounded border border-slate-200 text-sm"
                        value={newResource.image}
                        onChange={e => setNewResource({ ...newResource, image: e.target.value })}
                    />
                    <input
                        type="url"
                        placeholder="Resource Link / URL"
                        className="w-full p-3 bg-slate-50 rounded border border-slate-200 text-sm"
                        value={newResource.url}
                        onChange={e => setNewResource({ ...newResource, url: e.target.value })}
                    />
                    <button type="submit" className="w-full py-3 bg-slate-900 text-white font-black uppercase tracking-widest rounded hover:bg-slate-800">Add Stock</button>
                </form>
            </div>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
                <h3 className="font-bold text-slate-900 uppercase">Armory Inventory</h3>
                {resources.map(r => (
                    <div key={r.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm relative flex gap-4 group">
                        {r.image && <div className="w-16 h-20 bg-slate-200 rounded shrink-0 overflow-hidden"><img src={r.image} alt="" className="w-full h-full object-cover" /></div>}
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-slate-900 leading-tight">{r.title}</h4>
                                <button onClick={() => handleDelete(r.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <HiTrash />
                                </button>
                            </div>
                            <span className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded inline-block my-1">{r.type}</span>
                            <p className="text-xs text-slate-500 line-clamp-2">{r.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MenLeaderPanel;
