import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase';
import { collection, query, where, onSnapshot, updateDoc, doc, orderBy } from 'firebase/firestore';
import type { Task } from '../../types/volunteer';
import { FaCheckCircle, FaPlusCircle, FaClipboardList, FaSpinner, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const VolunteerTasks: React.FC = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeTab, setActiveTab] = useState<'my_tasks' | 'available'>('my_tasks');
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;

        // Fetch all non-completed tasks (or recent completed ones)
        // Ideally we'd have separate queries, but for simplicity we'll fetch 'active' stuff
        // We filter locally for tabs or setup complex compound queries.
        // Let's do a simple query for type 'task' (not shift)

        const q = query(
            collection(db, 'volunteer_tasks'),
            where('type', '==', 'task'),
            orderBy('date', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedTasks: Task[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Task[];
            setTasks(fetchedTasks);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleClaimTask = async (taskId: string) => {
        if (!user) return;
        setProcessingId(taskId);
        try {
            await updateDoc(doc(db, 'volunteer_tasks', taskId), {
                assignedTo: user.uid,
                status: 'accepted'
            });
            // Switch tab to show the user where it went
            setActiveTab('my_tasks');
        } catch (error) {
            console.error("Error claiming task:", error);
            alert("Could not claim task. It might have been taken.");
        } finally {
            setProcessingId(null);
        }
    };

    const handleCompleteTask = async (taskId: string) => {
        if (!processConfirm("Are you sure you want to mark this complete?")) return;
        setProcessingId(taskId);
        try {
            await updateDoc(doc(db, 'volunteer_tasks', taskId), {
                status: 'completed'
            });
        } catch (error) {
            console.error("Error completing task:", error);
        } finally {
            setProcessingId(null);
        }
    };

    const processConfirm = (msg: string) => window.confirm(msg);

    const myTasks = tasks.filter(t => t.assignedTo === user?.uid && t.status !== 'completed');
    const availableTasks = tasks.filter(t => !t.assignedTo && t.status === 'pending');
    const completedTasks = tasks.filter(t => t.assignedTo === user?.uid && t.status === 'completed');

    const displayTasks = activeTab === 'my_tasks' ? myTasks : availableTasks;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Task Board</h1>
                <div className="text-sm text-gray-500">
                    <span className="font-bold text-orange-600">{myTasks.length}</span> Active Tasks
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 inline-flex">
                <button
                    onClick={() => setActiveTab('my_tasks')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'my_tasks' ? 'bg-orange-100 text-orange-700' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    My Tasks
                </button>
                <button
                    onClick={() => setActiveTab('available')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'available' ? 'bg-orange-100 text-orange-700' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Available Tasks
                </button>
            </div>

            {/* Task List */}
            {loading ? (
                <div className="flex justify-center py-10">
                    <FaSpinner className="animate-spin text-orange-500 text-2xl" />
                </div>
            ) : displayTasks.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                    <FaClipboardList className="mx-auto text-4xl text-gray-300 mb-4" />
                    <p className="text-gray-500">No {activeTab === 'my_tasks' ? 'active' : 'available'} tasks found.</p>
                    {activeTab === 'my_tasks' && (
                        <button onClick={() => setActiveTab('available')} className="mt-2 text-orange-600 font-semibold">
                            Check available tasks
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {displayTasks.map(task => (
                        <div key={task.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${task.team === 'Media' ? 'bg-blue-100 text-blue-700' :
                                                task.team === 'Welcome' ? 'bg-green-100 text-green-700' :
                                                    'bg-gray-100 text-gray-700'
                                            }`}>
                                            {task.team}
                                        </span>
                                        <span className="text-xs text-gray-400 font-medium">
                                            {task.points} pts
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">{task.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1 mb-3">{task.description}</p>

                                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <FaClock />
                                            {new Date(task.date).toLocaleDateString()} • {task.startTime}
                                        </div>
                                        {task.location && (
                                            <div className="flex items-center gap-1">
                                                <FaMapMarkerAlt /> {task.location}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    {activeTab === 'available' ? (
                                        <button
                                            onClick={() => handleClaimTask(task.id)}
                                            disabled={processingId === task.id}
                                            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white text-sm font-bold rounded-lg hover:bg-orange-700 disabled:opacity-50 transition"
                                        >
                                            {processingId === task.id ? 'Claiming...' : (
                                                <>
                                                    <FaPlusCircle /> Claim
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleCompleteTask(task.id)}
                                            disabled={processingId === task.id}
                                            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-green-500 text-green-600 text-sm font-bold rounded-lg hover:bg-green-50 disabled:opacity-50 transition"
                                        >
                                            {processingId === task.id ? 'Updating...' : (
                                                <>
                                                    <FaCheckCircle /> Complete
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Completed Tasks Section (Only on My Tasks) */}
            {activeTab === 'my_tasks' && completedTasks.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Completed Tasks</h3>
                    <div className="space-y-3 opacity-60">
                        {completedTasks.map(task => (
                            <div key={task.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div>
                                    <h4 className="font-semibold text-gray-800 line-through">{task.title}</h4>
                                    <p className="text-xs text-gray-500">{new Date(task.date).toLocaleDateString()}</p>
                                </div>
                                <FaCheckCircle className="text-green-500" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VolunteerTasks;
