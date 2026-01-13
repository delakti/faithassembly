import React, { useState, useEffect } from 'react';
import {
    getFirestore,
    collection,
    query,
    onSnapshot,
    updateDoc,
    doc,
    addDoc,
    orderBy,
    serverTimestamp,
    getDocs,
    where
} from 'firebase/firestore';
import { getDatabase, ref, get } from 'firebase/database';
import {
    HiOutlineClipboardList,
    HiOutlineUserAdd,
    HiCheck,
    HiX,
    HiSearch,
    HiFilter,
    HiOutlineClock,
    HiOutlineCheckCircle,
    HiPlus,
    HiOutlineUser
} from 'react-icons/hi';
import toast, { Toaster } from 'react-hot-toast';
import { getAuth } from 'firebase/auth';

interface VisitationRequest {
    id: string;
    donorName: string;
    contactInfo: string;
    reason: string;
    preferredTime: string;
    status: 'Pending' | 'Scheduled' | 'Completed' | 'Cancelled';
    assignedTo: string[];
    assignedToNames?: string[];
    createdAt: any;
    location?: string;
    notes?: string;
}

interface TeamMember {
    id: string;
    displayName: string;
    email: string;
    role: string;
}

interface Donor {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    fullSearchString: string;
    address?: string;
}

const VisitationRequests: React.FC = () => {
    const [requests, setRequests] = useState<VisitationRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    // Create Request Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newRequestData, setNewRequestData] = useState({
        donorId: '',
        donorName: '',
        contactInfo: '',
        reason: '',
        preferredTime: '',
        location: '',
        notes: ''
    });

    // Donor Search State (for creation)
    const [donors, setDonors] = useState<Donor[]>([]);
    const [donorSearch, setDonorSearch] = useState('');
    const [showDonorDropdown, setShowDonorDropdown] = useState(false);
    const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);

    // Modal Interaction States (Assignment & Status)
    const [selectedRequest, setSelectedRequest] = useState<VisitationRequest | null>(null);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [selectedTeamMember, setSelectedTeamMember] = useState<string>('');
    const [visitDate, setVisitDate] = useState('');

    const db = getFirestore();
    const rtdb = getDatabase();
    const auth = getAuth();

    // Fetch Requests
    useEffect(() => {
        const q = query(
            collection(db, 'visitation_requests'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const requestsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as VisitationRequest[];
            setRequests(requestsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [db]);

    // Fetch Team Members
    useEffect(() => {
        const fetchTeam = async () => {
            const q = query(collection(db, 'users'), where('role', 'in', ['visitation_member', 'visitation_leader']));
            try {
                const snapshot = await getDocs(q);
                const members = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as TeamMember[];
                setTeamMembers(members);
            } catch (error) {
                console.error("Error fetching team:", error);
            }
        };
        fetchTeam();
    }, [db]);

    // Fetch Donors from RTDB
    useEffect(() => {
        const fetchDonors = async () => {
            try {
                const donorsRef = ref(rtdb, 'donor');
                const snapshot = await get(donorsRef);
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const donorList = Object.keys(data).map(key => {
                        const d = data[key];
                        const firstName = d['First Name'] || '';
                        const lastName = d['Last Name'] || '';
                        const address = [d['House Number'], d['Street Name'], d['City']].filter(Boolean).join(', ');
                        return {
                            id: key,
                            firstName,
                            lastName,
                            email: d.Email || '',
                            mobile: d['Mobile Phone'] || '',
                            address: address,
                            fullSearchString: `${firstName} ${lastName} ${d.Email || ''}`.toLowerCase()
                        };
                    });
                    setDonors(donorList);
                }
            } catch (error) {
                console.error("Error fetching donors:", error);
            }
        };
        fetchDonors();
    }, [rtdb]);

    // Filter Donors based on search
    useEffect(() => {
        if (!donorSearch) {
            setFilteredDonors([]);
            return;
        }
        const lowerSearch = donorSearch.toLowerCase();
        const results = donors.filter(d => d.fullSearchString.includes(lowerSearch)).slice(0, 5);
        setFilteredDonors(results);
    }, [donorSearch, donors]);

    const handleSelectDonor = (donor: Donor) => {
        setNewRequestData(prev => ({
            ...prev,
            donorId: donor.id,
            donorName: `${donor.firstName} ${donor.lastName}`,
            contactInfo: donor.mobile || donor.email,
            location: donor.address || ''
        }));
        setDonorSearch(`${donor.firstName} ${donor.lastName}`);
        setShowDonorDropdown(false);
    };

    const handleCreateRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'visitation_requests'), {
                ...newRequestData,
                status: 'Pending',
                assignedTo: [],
                createdAt: serverTimestamp()
            });
            toast.success('Request created successfully');
            setIsCreateModalOpen(false);
            setNewRequestData({
                donorId: '',
                donorName: '',
                contactInfo: '',
                reason: '',
                preferredTime: '',
                location: '',
                notes: ''
            });
            setDonorSearch('');
        } catch (error) {
            console.error("Error creating request:", error);
            toast.error("Failed to create request");
        }
    };

    const handleAssignMember = async () => {
        if (!selectedRequest || !selectedTeamMember) return;

        try {
            const member = teamMembers.find(m => m.id === selectedTeamMember);
            const memberName = member ? member.displayName || member.email : 'Unknown';

            const requestRef = doc(db, 'visitation_requests', selectedRequest.id);
            await updateDoc(requestRef, {
                assignedTo: [selectedTeamMember],
                assignedToNames: [memberName],
                status: 'Scheduled',
                scheduledDate: visitDate
            });

            toast.success(`Assigned to ${memberName}`);
            setIsAssignModalOpen(false);
            setSelectedRequest(null);
            setSelectedTeamMember('');
        } catch (error) {
            console.error("Error assigning member:", error);
            toast.error("Failed to assign team member.");
        }
    };

    const handleUpdateStatus = async (newStatus: 'Pending' | 'Scheduled' | 'Completed' | 'Cancelled') => {
        if (!selectedRequest) return;
        try {
            await updateDoc(doc(db, 'visitation_requests', selectedRequest.id), {
                status: newStatus
            });
            toast.success(`Status updated to ${newStatus}`);
            setIsStatusModalOpen(false);
            setSelectedRequest(null);
        } catch (error) {
            toast.error("Failed to update status.");
        }
    };

    const openAssignModal = (request: VisitationRequest) => {
        setSelectedRequest(request);
        setIsAssignModalOpen(true);
    };

    const statusColors = {
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Scheduled': 'bg-blue-100 text-blue-800',
        'Completed': 'bg-green-100 text-green-800',
        'Cancelled': 'bg-red-100 text-red-800'
    };

    const filteredRequests = requests.filter(request => {
        const matchesSearch = request.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.reason.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || request.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6">
            <Toaster position="top-right" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="font-serif font-bold text-2xl text-stone-800">Requests Log</h3>
                    <p className="text-stone-500 text-sm">Manage and assign incoming visitation requests.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-stone-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-stone-800 transition-colors flex items-center shadow-sm whitespace-nowrap"
                    >
                        <HiPlus className="w-5 h-5 mr-1" />
                        New Request
                    </button>
                    <div className="relative">
                        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                            type="text"
                            placeholder="Search requests..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-teal-500 outline-none w-full sm:w-64"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                    >
                        <option value="all">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
                    </div>
                ) : filteredRequests.length === 0 ? (
                    <div className="text-center py-16 px-4">
                        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400">
                            <HiOutlineClipboardList className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-medium text-stone-900">No requests found</h3>
                        <p className="text-stone-500 max-w-sm mx-auto mt-1">There are no visitation requests matching your criteria at the moment.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-stone-600">
                            <thead className="text-xs text-stone-700 uppercase bg-stone-50 border-b border-stone-200">
                                <tr>
                                    <th scope="col" className="px-6 py-4">Donor Details</th>
                                    <th scope="col" className="px-6 py-4">Reason & Time</th>
                                    <th scope="col" className="px-6 py-4">Assigned To</th>
                                    <th scope="col" className="px-6 py-4">Status</th>
                                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {filteredRequests.map((request) => (
                                    <tr key={request.id} className="bg-white hover:bg-stone-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-stone-900">{request.donorName}</div>
                                            <div className="text-xs text-stone-500">{request.contactInfo}</div>
                                            {request.location && (
                                                <div className="text-xs text-stone-400 mt-0.5">{request.location}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-stone-900">{request.reason}</div>
                                            <div className="text-xs text-stone-500 flex items-center mt-1">
                                                <HiOutlineClock className="w-3 h-3 mr-1" />
                                                {request.preferredTime}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {request.assignedToNames && request.assignedToNames.length > 0 ? (
                                                <div className="flex -space-x-2 overflow-hidden">
                                                    {request.assignedToNames.map((name, idx) => (
                                                        <span key={idx} className="inline-block px-2 py-0.5 bg-teal-50 text-teal-700 text-xs rounded-full border border-teal-100">
                                                            {name}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-stone-400 italic text-xs">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[request.status] || 'bg-gray-100 text-gray-800'}`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            {request.status === 'Pending' && (
                                                <button
                                                    onClick={() => openAssignModal(request)}
                                                    className="inline-flex items-center text-teal-600 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                                                >
                                                    <HiOutlineUserAdd className="w-4 h-4 mr-1.5" />
                                                    Assign
                                                </button>
                                            )}
                                            {request.status === 'Scheduled' && (
                                                <button
                                                    onClick={() => { setSelectedRequest(request); setIsStatusModalOpen(true); }}
                                                    className="inline-flex items-center text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                                                >
                                                    <HiOutlineCheckCircle className="w-4 h-4 mr-1.5" />
                                                    Complete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create Request Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl animate-scale-in">
                        <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-stone-800">New Visitation Request</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-stone-100 rounded-full text-stone-400">
                                <HiX className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateRequest} className="p-6 space-y-4">
                            {/* Donor Search */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-stone-700 mb-1">Select Donor</label>
                                <div className="relative">
                                    <HiSearch className="absolute left-3 top-3.5 text-stone-400" />
                                    <input
                                        type="text"
                                        value={donorSearch}
                                        onChange={(e) => {
                                            setDonorSearch(e.target.value);
                                            setShowDonorDropdown(true);
                                            if (e.target.value === '') setNewRequestData(prev => ({ ...prev, donorId: '', donorName: '' }));
                                        }}
                                        onFocus={() => setShowDonorDropdown(true)}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stone-200 focus:ring-2 focus:ring-teal-500 outline-none"
                                        placeholder="Search by name or email..."
                                    />
                                </div>
                                {showDonorDropdown && filteredDonors.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white rounded-xl shadow-lg border border-stone-100 overflow-hidden max-h-60 overflow-y-auto">
                                        {filteredDonors.map(donor => (
                                            <button
                                                key={donor.id}
                                                type="button"
                                                onClick={() => handleSelectDonor(donor)}
                                                className="w-full text-left px-4 py-3 hover:bg-teal-50 flex items-center justify-between group transition-colors border-b border-stone-50 last:border-0"
                                            >
                                                <div>
                                                    <p className="font-medium text-stone-800 group-hover:text-teal-700">{donor.firstName} {donor.lastName}</p>
                                                    <p className="text-xs text-stone-400">{donor.email}</p>
                                                </div>
                                                {newRequestData.donorId === donor.id && <HiCheck className="text-teal-600 w-5 h-5" />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Contact Info</label>
                                    <input
                                        type="text"
                                        value={newRequestData.contactInfo}
                                        onChange={(e) => setNewRequestData({ ...newRequestData, contactInfo: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-teal-500 outline-none"
                                        placeholder="Phone or Email"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Preferred Time</label>
                                    <input
                                        type="text"
                                        value={newRequestData.preferredTime}
                                        onChange={(e) => setNewRequestData({ ...newRequestData, preferredTime: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-teal-500 outline-none"
                                        placeholder="e.g. Weekends, Evenings"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Reason for Visit</label>
                                <select
                                    value={newRequestData.reason}
                                    onChange={(e) => setNewRequestData({ ...newRequestData, reason: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                                >
                                    <option value="">Select a reason...</option>
                                    <option value="New Member Welcome">New Member Welcome</option>
                                    <option value="Hospital Visitation">Hospital Visitation</option>
                                    <option value="Bereavement">Bereavement</option>
                                    <option value="Baby Dedication">Baby Dedication</option>
                                    <option value="Pastoral Care">Pastoral Care</option>
                                    <option value="Home Blessing">Home Blessing</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Location / Address</label>
                                <input
                                    type="text"
                                    value={newRequestData.location}
                                    onChange={(e) => setNewRequestData({ ...newRequestData, location: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-teal-500 outline-none"
                                    placeholder="Visit address"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Additional Notes</label>
                                <textarea
                                    rows={3}
                                    value={newRequestData.notes}
                                    onChange={(e) => setNewRequestData({ ...newRequestData, notes: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-teal-500 outline-none"
                                    placeholder="Any specific details..."
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 text-stone-500 hover:bg-stone-100 rounded-lg text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-stone-900 text-white hover:bg-stone-800 rounded-lg text-sm font-medium"
                                >
                                    Create Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Assignment Modal */}
            {isAssignModalOpen && selectedRequest && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-scale-in">
                        <h3 className="text-lg font-bold text-stone-900 mb-4">Assign Team Member</h3>
                        <p className="text-sm text-stone-500 mb-4">
                            Assigning user to visit <span className="font-semibold text-stone-800">{selectedRequest.donorName}</span>.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Team Member</label>
                                <select
                                    value={selectedTeamMember}
                                    onChange={(e) => setSelectedTeamMember(e.target.value)}
                                    className="w-full rounded-lg border-stone-200 focus:ring-2 focus:ring-teal-500 px-3 py-2 bg-white"
                                >
                                    <option value="">Select a member...</option>
                                    {teamMembers.map(member => (
                                        <option key={member.id} value={member.id}>
                                            {member.displayName || member.email}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Schedule Date (Optional)</label>
                                <input
                                    type="date"
                                    value={visitDate}
                                    onChange={(e) => setVisitDate(e.target.value)}
                                    className="w-full rounded-lg border-stone-200 focus:ring-2 focus:ring-teal-500 px-3 py-2"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setIsAssignModalOpen(false)}
                                className="px-4 py-2 text-stone-500 hover:bg-stone-100 rounded-lg text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={!selectedTeamMember}
                                onClick={handleAssignMember}
                                className="px-4 py-2 bg-teal-600 text-white hover:bg-teal-700 rounded-lg text-sm font-medium disabled:opacity-50"
                            >
                                Confirm Assignment
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Update Modal */}
            {isStatusModalOpen && selectedRequest && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
                        <h3 className="text-lg font-bold text-stone-900 mb-2">Update Status</h3>
                        <p className="text-sm text-stone-500 mb-6">
                            Mark this visit as completed?
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => handleUpdateStatus('Completed')}
                                className="w-full py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                            >
                                Mark as Completed
                            </button>
                            <button
                                onClick={() => handleUpdateStatus('Cancelled')}
                                className="w-full py-2.5 bg-white border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50"
                            >
                                Cancel Request
                            </button>
                            <button
                                onClick={() => setIsStatusModalOpen(false)}
                                className="w-full py-2.5 text-stone-500 hover:bg-stone-100 rounded-lg font-medium"
                            >
                                Keep as Scheduled
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VisitationRequests;
