import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, query, getDocs, updateDoc, doc, addDoc, deleteDoc } from 'firebase/firestore';
import { FaUserCheck, FaPlus, FaTasks, FaBullhorn, FaBook, FaTrash, FaSpinner } from 'react-icons/fa';

const VolunteerManager: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'volunteers' | 'tasks' | 'announcements' | 'resources'>('volunteers');
    const [loading, setLoading] = useState(false);

    // Data States
    const [users, setUsers] = useState<any[]>([]);
    const [tasks, setTasks] = useState<any[]>([]);
    const [announcements, setAnnouncements] = useState<any[]>([]);

    // Form States
    const [newTask, setNewTask] = useState({ title: '', description: '', date: '', startTime: '', endTime: '', points: 10, type: 'task', team: 'General' });
    const [newMsg, setNewMsg] = useState({ title: '', content: '', targetTeam: 'All' });
    const [newResource, setNewResource] = useState({ title: '', description: '', url: '', type: 'pdf', category: 'General' });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'volunteers') {
                const q = query(collection(db, 'users')); // Fetch all to filter client-side or use where('role', 'in', ['user', 'volunteer'])
                const snap = await getDocs(q);
                setUsers(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
            } else if (activeTab === 'tasks') {
                const snap = await getDocs(collection(db, 'volunteer_tasks'));
                setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            } else if (activeTab === 'announcements') {
                const snap = await getDocs(collection(db, 'volunteer_announcements'));
                setAnnouncements(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- Actions ---

    const approveVolunteer = async (uid: string) => {
        if (!window.confirm("Approve this user as a Volunteer?")) return;
        try {
            await updateDoc(doc(db, 'users', uid), { role: 'volunteer' });
            fetchData(); // Refresh
        } catch (e) { console.error(e); }
    };

    const removeVolunteer = async (uid: string) => {
        if (!window.confirm("Revoke volunteer status?")) return;
        try {
            await updateDoc(doc(db, 'users', uid), { role: 'user' });
            fetchData();
        } catch (e) { console.error(e); }
    };

    const createTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'volunteer_tasks'), {
                ...newTask,
                status: 'pending',
                assignedTo: null,
                createdAt: new Date().toISOString()
            });
            alert("Task Created!");
            setNewTask({ title: '', description: '', date: '', startTime: '', endTime: '', points: 10, type: 'task', team: 'General' });
            fetchData();
        } catch (e) { console.error(e); }
    };

    const postAnnouncement = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'volunteer_announcements'), {
                ...newMsg,
                targetTeams: [newMsg.targetTeam],
                date: new Date().toISOString(),
                author: "Admin"
            });
            alert("Announcement Posted!");
            setNewMsg({ title: '', content: '', targetTeam: 'All' });
            fetchData();
        } catch (e) { console.error(e); }
    };

    const addResource = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'volunteer_resources'), {
                ...newResource,
                dateAdded: new Date().toISOString()
            });
            alert("Resource Added!");
            setNewResource({ title: '', description: '', url: '', type: 'pdf', category: 'General' });
        } catch (e) { console.error(e); }
    };

    const deleteTask = async (id: string, col: string) => {
        if (!window.confirm("Delete this item?")) return;
        await deleteDoc(doc(db, col, id));
        fetchData();
    };


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Volunteer Manager</h1>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 space-x-4">
                {[
                    { id: 'volunteers', label: 'Volunteers', icon: <FaUserCheck /> },
                    { id: 'tasks', label: 'Tasks & Shifts', icon: <FaTasks /> },
                    { id: 'announcements', label: 'Announcements', icon: <FaBullhorn /> },
                    { id: 'resources', label: 'Resources', icon: <FaBook /> },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 pb-3 px-2 border-b-2 font-medium transition ${activeTab === tab.id ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {loading && <div className="text-center py-4"><FaSpinner className="animate-spin inline text-2xl" /> Loading...</div>}

            {/* --- VOLUNTEERS TAB --- */}
            {activeTab === 'volunteers' && !loading && (
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">User</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Role</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map(u => (
                                <tr key={u.uid}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.displayName || 'No Name'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${u.role === 'volunteer' ? 'bg-green-100 text-green-800' :
                                            u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {u.role || 'user'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        {u.role !== 'volunteer' && u.role !== 'admin' && (
                                            <button onClick={() => approveVolunteer(u.uid)} className="text-green-600 hover:text-green-900 font-bold mr-3">Approve</button>
                                        )}
                                        {u.role === 'volunteer' && (
                                            <button onClick={() => removeVolunteer(u.uid)} className="text-red-600 hover:text-red-900 font-bold">Revoke</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- TASKS TAB --- */}
            {activeTab === 'tasks' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow h-fit">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><FaPlus /> Create Task/Shift</h3>
                        <form onSubmit={createTask} className="space-y-4">
                            <input required placeholder="Title" className="w-full p-2 border rounded" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
                            <textarea placeholder="Description" className="w-full p-2 border rounded" value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} />
                            <div className="grid grid-cols-2 gap-2">
                                <select className="p-2 border rounded" value={newTask.type} onChange={e => setNewTask({ ...newTask, type: e.target.value })}>
                                    <option value="task">Task</option>
                                    <option value="shift">Shift</option>
                                </select>
                                <select className="p-2 border rounded" value={newTask.team} onChange={e => setNewTask({ ...newTask, team: e.target.value })}>
                                    <option value="General">General</option>
                                    <option value="Media">Media</option>
                                    <option value="Welcome">Welcome</option>
                                    <option value="Kids">Kids</option>
                                </select>
                            </div>
                            <input required type="date" className="w-full p-2 border rounded" value={newTask.date} onChange={e => setNewTask({ ...newTask, date: e.target.value })} />
                            <div className="grid grid-cols-2 gap-2">
                                <input type="time" className="p-2 border rounded" value={newTask.startTime} onChange={e => setNewTask({ ...newTask, startTime: e.target.value })} />
                                <input type="time" className="p-2 border rounded" value={newTask.endTime} onChange={e => setNewTask({ ...newTask, endTime: e.target.value })} />
                            </div>
                            <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded font-bold hover:bg-purple-700">Create</button>
                        </form>
                    </div>

                    <div className="lg:col-span-2 space-y-4">
                        {tasks.map(t => (
                            <div key={t.id} className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold">{t.title} <span className="text-xs bg-gray-100 px-2 py-1 rounded ml-2">{t.type}</span></h4>
                                    <p className="text-sm text-gray-600">{t.date} | {t.team}</p>
                                    <p className="text-xs text-gray-500">Status: {t.status} | Assigned: {t.assignedTo || 'Unassigned'}</p>
                                </div>
                                <button onClick={() => deleteTask(t.id, 'volunteer_tasks')} className="text-red-500 hover:text-red-700"><FaTrash /></button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- ANNOUNCEMENTS TAB --- */}
            {activeTab === 'announcements' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow h-fit">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><FaBullhorn /> Post Announcement</h3>
                        <form onSubmit={postAnnouncement} className="space-y-4">
                            <input required placeholder="Title" className="w-full p-2 border rounded" value={newMsg.title} onChange={e => setNewMsg({ ...newMsg, title: e.target.value })} />
                            <textarea required placeholder="Content" className="w-full p-2 border rounded h-32" value={newMsg.content} onChange={e => setNewMsg({ ...newMsg, content: e.target.value })} />
                            <select className="w-full p-2 border rounded" value={newMsg.targetTeam} onChange={e => setNewMsg({ ...newMsg, targetTeam: e.target.value })}>
                                <option value="All">All Teams</option>
                                <option value="Media">Media</option>
                                <option value="Welcome">Welcome</option>
                            </select>
                            <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded font-bold hover:bg-purple-700">Post</button>
                        </form>
                    </div>

                    <div className="lg:col-span-2 space-y-4">
                        {announcements.map(a => (
                            <div key={a.id} className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold">{a.title}</h4>
                                    <p className="text-sm text-gray-600 line-clamp-2">{a.content}</p>
                                    <p className="text-xs text-gray-400 mt-1">To: {a.targetTeams?.join(', ')}</p>
                                </div>
                                <button onClick={() => deleteTask(a.id, 'volunteer_announcements')} className="text-red-500 hover:text-red-700"><FaTrash /></button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- RESOURCES TAB --- */}
            {activeTab === 'resources' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow h-fit">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><FaBook /> Add Resource</h3>
                        <form onSubmit={addResource} className="space-y-4">
                            <input required placeholder="Title" className="w-full p-2 border rounded" value={newResource.title} onChange={e => setNewResource({ ...newResource, title: e.target.value })} />
                            <input required placeholder="URL (PDF/Video Link)" className="w-full p-2 border rounded" value={newResource.url} onChange={e => setNewResource({ ...newResource, url: e.target.value })} />
                            <textarea placeholder="Description" className="w-full p-2 border rounded" value={newResource.description} onChange={e => setNewResource({ ...newResource, description: e.target.value })} />
                            <div className="grid grid-cols-2 gap-2">
                                <select className="p-2 border rounded" value={newResource.type} onChange={e => setNewResource({ ...newResource, type: e.target.value })}>
                                    <option value="pdf">PDF</option>
                                    <option value="video">Video</option>
                                    <option value="link">Link</option>
                                </select>
                                <select className="p-2 border rounded" value={newResource.category} onChange={e => setNewResource({ ...newResource, category: e.target.value })}>
                                    <option value="General">General</option>
                                    <option value="Training">Training</option>
                                    <option value="Safety">Safety</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded font-bold hover:bg-purple-700">Add</button>
                        </form>
                    </div>
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
                        <p className="text-gray-500 text-center">Resource list view coming soon (use Firestore console to manage existing ones).</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VolunteerManager;
