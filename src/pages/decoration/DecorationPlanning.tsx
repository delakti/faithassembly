import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, orderBy, getDocs, addDoc, deleteDoc, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { HiClipboardList, HiHand, HiCalendar, HiCheckCircle, HiTrash } from 'react-icons/hi';
import { format, parseISO } from 'date-fns';
import { toast } from 'react-hot-toast';

interface Meeting {
    id: string;
    title: string;
    date: string;
    time: string;
    agenda: string;
    attendees: string[];
}

const DecorationPlanning: React.FC = () => {
    const auth = getAuth();
    const db = getFirestore();
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLeader, setIsLeader] = useState(false);
    const [userId, setUserId] = useState<string>('');

    // Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newMeeting, setNewMeeting] = useState({ title: '', date: '', time: '', agenda: '' });

    useEffect(() => {
        if (auth.currentUser) setUserId(auth.currentUser.uid);
        checkRole();
        fetchMeetings();
    }, []);

    const checkRole = async () => {
        if (auth.currentUser) {
            const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
            if (userDoc.exists()) {
                const role = userDoc.data().role;
                if (['decor_leader', 'hospitality_leader', 'admin', 'super_admin'].includes(role)) {
                    setIsLeader(true);
                }
            }
        }
    };

    const fetchMeetings = async () => {
        try {
            const q = query(collection(db, 'decor_meetings'), orderBy('date', 'asc'));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Meeting[];
            setMeetings(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'decor_meetings'), {
                ...newMeeting,
                attendees: []
            });
            toast.success("Meeting scheduled");
            setIsModalOpen(false);
            setNewMeeting({ title: '', date: '', time: '', agenda: '' });
            fetchMeetings();
        } catch (error) {
            toast.error("Failed to schedule");
        }
    };

    const toggleAttendance = async (meeting: Meeting) => {
        if (!userId) return;
        const isAttending = meeting.attendees.includes(userId);
        try {
            await updateDoc(doc(db, 'decor_meetings', meeting.id), {
                attendees: isAttending ? arrayRemove(userId) : arrayUnion(userId)
            });
            fetchMeetings(); // Refresh to update UI
            toast.success(isAttending ? "RSVP Removed" : "RSVP Confirmed");
        } catch (error) {
            toast.error("Action failed");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Cancel this meeting?")) return;
        try {
            await deleteDoc(doc(db, 'decor_meetings', id));
            setMeetings(prev => prev.filter(m => m.id !== id));
            toast.success("Meeting cancelled");
        } catch (error) {
            toast.error("Failed to delete");
        }
    }

    const seasons = [
        { name: 'Easter', dates: 'March - April', color: 'bg-yellow-100 text-yellow-800' },
        { name: 'Revival', dates: 'June/July', color: 'bg-red-100 text-red-800' },
        { name: 'Conference', dates: 'October', color: 'bg-blue-100 text-blue-800' },
        { name: 'Christmas', dates: 'December', color: 'bg-green-100 text-green-800' }
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold font-serif text-fuchsia-950">Planning & Strategy</h1>

            {/* Annual Overview */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <HiCalendar className="text-fuchsia-500" /> Annual Seasons
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {seasons.map(s => (
                        <div key={s.name} className={`${s.color} p-4 rounded-xl text-center`}>
                            <h3 className="font-bold text-lg">{s.name}</h3>
                            <p className="text-xs font-medium opacity-80">{s.dates}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Meetings Section */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <HiClipboardList className="text-fuchsia-500" /> Planning Sessions
                    </h2>
                    {isLeader && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="text-sm font-bold text-fuchsia-600 bg-fuchsia-50 px-3 py-1 rounded-lg hover:bg-fuchsia-100"
                        >
                            + Schedule Meeting
                        </button>
                    )}
                </div>

                <div className="grid gap-4">
                    {loading ? (
                        <div className="text-center text-slate-400 py-8">Loading meetings...</div>
                    ) : meetings.length === 0 ? (
                        <p className="text-slate-500 italic text-sm">No meetings scheduled.</p>
                    ) : (
                        meetings.map(meeting => {
                            const isAttending = meeting.attendees.includes(userId);
                            return (
                                <div key={meeting.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative group">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-bold text-slate-900">{meeting.title}</h3>
                                            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                                {meeting.date && format(parseISO(meeting.date), 'MMM d')} @ {meeting.time}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600 max-w-2xl">{meeting.agenda}</p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <div className="flex -space-x-1">
                                                {meeting.attendees.map(a => (
                                                    <div key={a} className="w-5 h-5 rounded-full bg-fuchsia-100 border border-white" />
                                                ))}
                                            </div>
                                            {meeting.attendees.length > 0 && <span className="text-xs text-slate-400">{meeting.attendees.length} attending</span>}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => toggleAttendance(meeting)}
                                        className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${isAttending
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                    >
                                        {isAttending ? <><HiCheckCircle /> Count Me In</> : <><HiHand /> RSVP Yes</>}
                                    </button>

                                    {isLeader && (
                                        <button
                                            onClick={() => handleDelete(meeting.id)}
                                            className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <HiTrash />
                                        </button>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <h2 className="text-xl font-bold mb-4">Schedule Planning Session</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <input
                                className="w-full border p-2 rounded"
                                placeholder="Meeting Title"
                                required
                                value={newMeeting.title}
                                onChange={e => setNewMeeting({ ...newMeeting, title: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="date"
                                    className="border p-2 rounded"
                                    required
                                    value={newMeeting.date}
                                    onChange={e => setNewMeeting({ ...newMeeting, date: e.target.value })}
                                />
                                <input
                                    type="time"
                                    className="border p-2 rounded"
                                    required
                                    value={newMeeting.time}
                                    onChange={e => setNewMeeting({ ...newMeeting, time: e.target.value })}
                                />
                            </div>
                            <textarea
                                className="w-full border p-2 rounded h-24"
                                placeholder="Agenda / Topics..."
                                required
                                value={newMeeting.agenda}
                                onChange={e => setNewMeeting({ ...newMeeting, agenda: e.target.value })}
                            />
                            <div className="flex justify-end gap-2 text-sm font-bold">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-500">Cancel</button>
                                <button type="submit" className="text-fuchsia-600">Schedule</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DecorationPlanning;
