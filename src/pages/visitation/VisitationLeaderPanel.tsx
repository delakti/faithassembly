import React, { useState, useEffect } from 'react';
import {
    getFirestore,
    collection,
    query,
    orderBy,
    onSnapshot,
    limit,
    where,
    getDocs,
    updateDoc,
    doc,
    addDoc,
    deleteDoc,
    serverTimestamp
} from 'firebase/firestore';
import {
    HiOutlineExclamation,
    HiUserGroup,
    HiPlus,
    HiX,
    HiTrash,
    HiSpeakerphone,
    HiSearch,
    HiOutlineUser,
    HiOutlineCalendar,
    HiOutlineLocationMarker
} from 'react-icons/hi';
import { format } from 'date-fns';
import toast, { Toaster } from 'react-hot-toast';
import { getAuth } from 'firebase/auth';

interface VisitationReport {
    id: string;
    donorName: string;
    dateOfVisit: string;
    summary: string;
    referrals: string;
    followUpNeeded: boolean;
    submittedBy: string;
    createdAt: any;
}

interface User {
    id: string;
    displayName: string;
    email: string;
    role: string;
    photoURL?: string;
}

interface Announcement {
    id: string;
    title: string;
    content: string;
    createdAt: any;
    priority: 'Low' | 'Medium' | 'High';
}

interface VisitationRequest {
    id: string;
    donorName: string;
    scheduledDate?: string;
    status: 'Pending' | 'Scheduled' | 'Completed' | 'Cancelled';
    location?: string;
    assignedTo: string[];
    preferredTime?: string;
}

const VisitationLeaderPanel: React.FC = () => {
    // Report State
    const [reports, setReports] = useState<VisitationReport[]>([]);
    const [loadingReports, setLoadingReports] = useState(true);
    const [reportSearch, setReportSearch] = useState('');

    // Team Management State
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
    const [teamMembers, setTeamMembers] = useState<User[]>([]);
    const [userSearch, setUserSearch] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Announcement State
    const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [newAnnouncement, setNewAnnouncement] = useState({
        title: '',
        content: '',
        priority: 'Medium' as 'Low' | 'Medium' | 'High'
    });

    // Master Schedule State
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [allScheduledVisits, setAllScheduledVisits] = useState<VisitationRequest[]>([]);

    const db = getFirestore();
    const auth = getAuth();

    // Fetch Reports
    useEffect(() => {
        const q = query(
            collection(db, 'visitation_reports'),
            orderBy('createdAt', 'desc'),
            limit(50)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as VisitationReport[];
            setReports(data);
            setLoadingReports(false);
        });

        return () => unsubscribe();
    }, [db]);

    // Fetch Team Members (when Team Modal OR Schedule Modal is open - needed for name mapping)
    useEffect(() => {
        if (!isTeamModalOpen && !isScheduleModalOpen) return;

        const q = query(
            collection(db, 'users'),
            where('role', 'in', ['visitation_member', 'visitation_leader'])
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const users = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as User[];
            setTeamMembers(users);
        });

        return () => unsubscribe();
    }, [db, isTeamModalOpen, isScheduleModalOpen]);

    // Fetch Announcements (only when modal open)
    useEffect(() => {
        if (!isAnnouncementModalOpen) return;
        const q = query(
            collection(db, 'visitation_announcements'),
            orderBy('createdAt', 'desc')
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Announcement[];
            setAnnouncements(data);
        });
        return () => unsubscribe();
    }, [db, isAnnouncementModalOpen]);

    // Fetch Master Schedule
    useEffect(() => {
        if (!isScheduleModalOpen) return;

        // Fetch all requests that are not cancelled (or fetch all and filter in UI)
        // For simplicity, let's fetch all relevant ones
        const q = query(
            collection(db, 'visitation_requests'),
            where('status', 'in', ['Scheduled', 'Pending', 'Completed'])
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as VisitationRequest[];

            // Sort by date manually since we didn't index everything
            data.sort((a, b) => {
                const dateA = a.scheduledDate || '9999-99-99';
                const dateB = b.scheduledDate || '9999-99-99';
                return dateA.localeCompare(dateB);
            });

            setAllScheduledVisits(data);
        });

        return () => unsubscribe();
    }, [db, isScheduleModalOpen]);


    // --- Team Management Logic ---
    useEffect(() => {
        const searchUsers = async () => {
            if (userSearch.length < 3) {
                setSearchResults([]);
                return;
            }
            setIsSearching(true);
            try {
                const usersRef = collection(db, 'users');
                const q = query(usersRef, limit(20));
                const snapshot = await getDocs(q);

                const results = snapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() } as User))
                    .filter(u =>
                        (u.displayName?.toLowerCase().includes(userSearch.toLowerCase()) ||
                            u.email?.toLowerCase().includes(userSearch.toLowerCase())) &&
                        !['visitation_member', 'visitation_leader'].includes(u.role)
                    );

                setSearchResults(results);
            } catch (error) {
                console.error("Search error", error);
            } finally {
                setIsSearching(false);
            }
        };
        const timeout = setTimeout(searchUsers, 500);
        return () => clearTimeout(timeout);
    }, [userSearch, db]);

    const handleAddMember = async (userId: string) => {
        try {
            await updateDoc(doc(db, 'users', userId), { role: 'visitation_member' });
            toast.success("User added to Visitation Team");
            setUserSearch('');
            setSearchResults([]);
        } catch (error) {
            toast.error("Failed to update user role");
        }
    };

    const handleRemoveMember = async (userId: string) => {
        if (!window.confirm("Remove user from Visitation Team?")) return;
        try {
            await updateDoc(doc(db, 'users', userId), { role: 'user' });
            toast.success("User removed from team");
        } catch (error) {
            toast.error("Failed to remove user");
        }
    };

    // --- Announcement Logic ---
    const handleCreateAnnouncement = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'visitation_announcements'), {
                ...newAnnouncement,
                createdAt: serverTimestamp(),
                createdBy: auth.currentUser?.uid
            });
            toast.success("Announcement published");
            setNewAnnouncement({ title: '', content: '', priority: 'Medium' });
        } catch (error) {
            toast.error("Failed to publish announcement");
        }
    };

    const handleDeleteAnnouncement = async (id: string) => {
        if (!window.confirm("Delete this announcement?")) return;
        try {
            await deleteDoc(doc(db, 'visitation_announcements', id));
            toast.success("Announcement deleted");
        } catch (error) {
            toast.error("Failed to delete announcement");
        }
    };

    // Helper to get assigned names
    const getAssignedNames = (assignedIds: string[]) => {
        if (!assignedIds || assignedIds.length === 0) return 'Unassigned';
        return assignedIds.map(id => {
            const member = teamMembers.find(m => m.id === id);
            return member ? member.displayName : 'Unknown';
        }).join(', ');
    };


    const filteredReports = reports.filter(r =>
        r.donorName.toLowerCase().includes(reportSearch.toLowerCase()) ||
        r.summary.toLowerCase().includes(reportSearch.toLowerCase())
    );

    const statusColors = {
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Scheduled': 'bg-blue-100 text-blue-800',
        'Completed': 'bg-green-100 text-green-800',
        'Cancelled': 'bg-red-100 text-red-800'
    };

    return (
        <div className="space-y-8">
            <Toaster position="top-right" />

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="font-serif font-bold text-lg text-stone-800">Leader Controls</h3>
                        <p className="text-stone-500 text-sm">Manage team access and workflow.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <button
                        onClick={() => setIsTeamModalOpen(true)}
                        className="p-4 border border-stone-200 rounded-xl hover:bg-teal-50 hover:border-teal-200 text-left transition-all group"
                    >
                        <div className="p-2 bg-stone-100 group-hover:bg-teal-100 rounded-lg w-fit mb-3 transition-colors">
                            <HiUserGroup className="w-6 h-6 text-stone-600 group-hover:text-teal-600" />
                        </div>
                        <h4 className="font-bold text-stone-700 group-hover:text-teal-800">Team Management</h4>
                        <p className="text-xs text-stone-500 mt-1">Add or remove visit members</p>
                    </button>

                    <button
                        onClick={() => setIsScheduleModalOpen(true)}
                        className="p-4 border border-stone-200 rounded-xl hover:bg-teal-50 hover:border-teal-200 text-left transition-all group"
                    >
                        <div className="p-2 bg-stone-100 group-hover:bg-teal-100 rounded-lg w-fit mb-3 transition-colors">
                            <HiOutlineCalendar className="w-6 h-6 text-stone-600 group-hover:text-teal-600" />
                        </div>
                        <h4 className="font-bold text-stone-700 group-hover:text-teal-800">Master Schedule</h4>
                        <p className="text-xs text-stone-500 mt-1">View all upcoming visits</p>
                    </button>

                    <button
                        onClick={() => setIsAnnouncementModalOpen(true)}
                        className="p-4 border border-stone-200 rounded-xl hover:bg-teal-50 hover:border-teal-200 text-left transition-all group"
                    >
                        <div className="p-2 bg-stone-100 group-hover:bg-teal-100 rounded-lg w-fit mb-3 transition-colors">
                            <HiSpeakerphone className="w-6 h-6 text-stone-600 group-hover:text-teal-600" />
                        </div>
                        <h4 className="font-bold text-stone-700 group-hover:text-teal-800">Announcements</h4>
                        <p className="text-xs text-stone-500 mt-1">Post updates to dashboard</p>
                    </button>

                    <div className="p-4 border border-stone-100 rounded-xl bg-stone-50 opacity-60 cursor-not-allowed">
                        <div className="p-2 bg-stone-200 rounded-lg w-fit mb-3">
                            <HiOutlineExclamation className="w-6 h-6 text-stone-400" />
                        </div>
                        <h4 className="font-bold text-stone-400">Audit Logs</h4>
                        <p className="text-xs text-stone-400 mt-1">Coming soon</p>
                    </div>
                </div>
            </div>

            {/* Reports Overview */}
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-stone-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h3 className="font-serif font-bold text-lg text-stone-800">Submitted Reports Overview</h3>
                        <p className="text-stone-500 text-sm">Most recent visitation feedback.</p>
                    </div>
                    <div className="relative w-full md:w-64">
                        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                            type="text"
                            placeholder="Search reports..."
                            value={reportSearch}
                            onChange={(e) => setReportSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-teal-500 outline-none"
                        />
                    </div>
                </div>

                {loadingReports ? (
                    <div className="p-12 flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
                    </div>
                ) : filteredReports.length === 0 ? (
                    <div className="text-center py-12 px-4">
                        <p className="text-stone-500">No reports found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-stone-600">
                            <thead className="text-xs text-stone-700 uppercase bg-stone-50 border-b border-stone-200">
                                <tr>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Donor Visited</th>
                                    <th className="px-6 py-4">Summary</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {filteredReports.slice(0, 10).map((report) => (
                                    <tr key={report.id} className="bg-white hover:bg-stone-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {report.dateOfVisit ? format(new Date(report.dateOfVisit), 'MMM d, yyyy') : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-stone-900">
                                            {report.donorName}
                                        </td>
                                        <td className="px-6 py-4 max-w-xs truncate">
                                            {report.summary}
                                        </td>
                                        <td className="px-6 py-4">
                                            {report.followUpNeeded && (
                                                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">Follow-up</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Team Management Modal */}
            {isTeamModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl animate-scale-in">
                        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50 rounded-t-2xl">
                            <div>
                                <h3 className="font-bold text-xl text-stone-800">Manage Visitation Team</h3>
                                <p className="text-sm text-stone-500">Manage members and leaders.</p>
                            </div>
                            <button onClick={() => setIsTeamModalOpen(false)} className="p-2 hover:bg-stone-200 rounded-full text-stone-500 transition-colors">
                                <HiX className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* Add New Member Section */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-stone-800 uppercase tracking-wider">Add New Member</h4>
                                <div className="relative">
                                    <HiSearch className="absolute left-3 top-3.5 text-stone-400" />
                                    <input
                                        type="text"
                                        value={userSearch}
                                        onChange={(e) => setUserSearch(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-teal-500 outline-none"
                                        placeholder="Search user by name or email..."
                                    />
                                </div>
                                {isSearching && <p className="text-xs text-stone-400 pl-2">Searching...</p>}
                                {searchResults.length > 0 && (
                                    <div className="border border-stone-100 rounded-xl overflow-hidden shadow-sm">
                                        {searchResults.map(user => (
                                            <div key={user.id} className="p-4 bg-white flex justify-between items-center border-b border-stone-50 last:border-0 hover:bg-teal-50 transition-colors">
                                                <div>
                                                    <p className="font-bold text-stone-800">{user.displayName || 'Unnamed User'}</p>
                                                    <p className="text-xs text-stone-500">{user.email}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleAddMember(user.id)}
                                                    className="px-3 py-1.5 bg-teal-600 text-white text-xs font-bold rounded-lg hover:bg-teal-700 flex items-center"
                                                >
                                                    <HiPlus className="w-3 h-3 mr-1" /> Add
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Current Team List */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-stone-800 uppercase tracking-wider">Current Team Members ({teamMembers.length})</h4>
                                <div className="space-y-2">
                                    {teamMembers.map(member => (
                                        <div key={member.id} className="flex justify-between items-center p-4 bg-stone-50 rounded-xl border border-stone-100">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold">
                                                    {member.displayName ? member.displayName[0] : <HiOutlineUser />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-stone-800">{member.displayName || 'Team Member'}</p>
                                                    <p className="text-xs text-stone-500">{member.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <span className={`text-xs px-2 py-1 rounded-full font-bold ${member.role === 'visitation_leader' ? 'bg-purple-100 text-purple-700' : 'bg-teal-100 text-teal-700'}`}>
                                                    {member.role === 'visitation_leader' ? 'Leader' : 'Member'}
                                                </span>
                                                {member.role !== 'visitation_leader' && (
                                                    <button
                                                        onClick={() => handleRemoveMember(member.id)}
                                                        className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <HiTrash className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Announcement Modal */}
            {isAnnouncementModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-scale-in">
                        <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-stone-800">Manage Announcements</h3>
                            <button onClick={() => setIsAnnouncementModalOpen(false)} className="p-2 hover:bg-stone-100 rounded-full text-stone-400">
                                <HiX className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                                <h4 className="text-sm font-bold text-stone-700">Post New Update</h4>
                                <input
                                    type="text"
                                    placeholder="Title"
                                    required
                                    value={newAnnouncement.title}
                                    onChange={e => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-teal-500 outline-none"
                                />
                                <div className="flex gap-4">
                                    <textarea
                                        placeholder="Content..."
                                        rows={2}
                                        required
                                        value={newAnnouncement.content}
                                        onChange={e => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-teal-500 outline-none"
                                    ></textarea>
                                </div>
                                <div className="flex justify-between items-center">
                                    <select
                                        value={newAnnouncement.priority}
                                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value as any })}
                                        className="px-3 py-2 rounded-lg border border-stone-200 text-sm"
                                    >
                                        <option value="Low">Low Priority</option>
                                        <option value="Medium">Medium Priority</option>
                                        <option value="High">High Priority</option>
                                    </select>
                                    <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-teal-700">
                                        Post Update
                                    </button>
                                </div>
                            </form>

                            <div className="pt-4 border-t border-stone-100">
                                <h4 className="text-sm font-bold text-stone-700 mb-3">Recent Announcements</h4>
                                <div className="space-y-3 max-h-60 overflow-y-auto">
                                    {announcements.length === 0 ? (
                                        <p className="text-xs text-stone-400">No active announcements.</p>
                                    ) : announcements.map(announcement => (
                                        <div key={announcement.id} className="p-3 bg-stone-50 rounded-lg flex justify-between items-start group">
                                            <div>
                                                <p className="font-bold text-stone-800 text-sm">{announcement.title}</p>
                                                <p className="text-xs text-stone-500 line-clamp-1">{announcement.content}</p>
                                                <p className="text-[10px] text-stone-400 mt-1">
                                                    {announcement.createdAt ? format(announcement.createdAt.toDate(), 'MMM d') : 'Now'}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteAnnouncement(announcement.id)}
                                                className="text-stone-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <HiTrash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Master Schedule Modal */}
            {isScheduleModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl animate-scale-in">
                        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50 rounded-t-2xl">
                            <div>
                                <h3 className="font-bold text-xl text-stone-800">Master Schedule</h3>
                                <p className="text-sm text-stone-500">Overview of all team visits.</p>
                            </div>
                            <button onClick={() => setIsScheduleModalOpen(false)} className="p-2 hover:bg-stone-200 rounded-full text-stone-500 transition-colors">
                                <HiX className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-0">
                            <table className="w-full text-sm text-left text-stone-600">
                                <thead className="text-xs text-stone-700 uppercase bg-stone-50 border-b border-stone-200 sticky top-0">
                                    <tr>
                                        <th className="px-6 py-4">Date & Time</th>
                                        <th className="px-6 py-4">Donor</th>
                                        <th className="px-6 py-4">Assigned Team</th>
                                        <th className="px-6 py-4">Location</th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100">
                                    {allScheduledVisits.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-stone-400">
                                                No scheduled visits found.
                                            </td>
                                        </tr>
                                    ) : (
                                        allScheduledVisits.map((visit) => (
                                            <tr key={visit.id} className="bg-white hover:bg-stone-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-stone-900">
                                                    {visit.scheduledDate ? format(new Date(visit.scheduledDate), 'MMM d, yyyy') : 'TBD'}
                                                    <div className="text-xs text-stone-400 font-normal mt-0.5">{visit.preferredTime || 'Time not set'}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {visit.donorName}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <HiOutlineUser className="w-4 h-4 mr-1 text-teal-500" />
                                                        <span className="truncate max-w-[150px]" title={getAssignedNames(visit.assignedTo)}>
                                                            {getAssignedNames(visit.assignedTo)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center max-w-xs truncate" title={visit.location}>
                                                        <HiOutlineLocationMarker className="w-4 h-4 mr-1 text-stone-400" />
                                                        {visit.location || 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusColors[visit.status]}`}>
                                                        {visit.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VisitationLeaderPanel;
