import React, { useState, useEffect } from 'react';
import {
    getFirestore,
    collection,
    query,
    onSnapshot,
    addDoc,
    orderBy,
    serverTimestamp,
    updateDoc,
    doc,
    arrayUnion,
    deleteDoc,
    getDoc
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import {
    HiOutlineSparkles,
    HiPlus,
    HiOutlineHand,
    HiCheck,
    HiX,
    HiOutlineUser
} from 'react-icons/hi';
import toast, { Toaster } from 'react-hot-toast';

interface PrayerRequest {
    id: string;
    title: string;
    detail: string;
    requesterName: string; // Name of the person needing prayer (e.g. "Sister Sarah")
    category: 'Healing' | 'Provision' | 'Family' | 'Spiritual' | 'Other';
    status: 'Active' | 'Answered' | 'Archived';
    prayedBy: string[]; // List of user IDs who have prayed
    createdAt: any;
    createdBy: string; // User ID of the team member who logged it
}

const VisitationPrayer: React.FC = () => {
    const [requests, setRequests] = useState<PrayerRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLeader, setIsLeader] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    // Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newRequest, setNewRequest] = useState({
        title: '',
        detail: '',
        requesterName: '',
        category: 'Healing',
    });

    const db = getFirestore();
    const auth = getAuth();

    // Check Auth & Role
    useEffect(() => {
        const checkUser = async () => {
            const user = auth.currentUser;
            if (user) {
                setCurrentUserId(user.uid);
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        if (['visitation_leader', 'admin', 'super_admin'].includes(userData.role)) {
                            setIsLeader(true);
                        }
                    }
                } catch (error) {
                    console.error("Error checking role", error);
                }
            }
        };
        checkUser();
    }, [auth, db]);

    // Fetch Prayer Requests
    useEffect(() => {
        const q = query(
            collection(db, 'visitation_prayers'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as PrayerRequest[];
            setRequests(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [db]);

    const handleAddRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUserId) return;

        try {
            await addDoc(collection(db, 'visitation_prayers'), {
                ...newRequest,
                status: 'Active',
                prayedBy: [],
                createdAt: serverTimestamp(),
                createdBy: currentUserId
            });
            toast.success('Prayer request added to the wall.');
            setIsAddModalOpen(false);
            setNewRequest({ title: '', detail: '', requesterName: '', category: 'Healing' });
        } catch (error) {
            console.error("Error adding request:", error);
            toast.error("Failed to add prayer request.");
        }
    };

    const handlePray = async (request: PrayerRequest) => {
        if (!currentUserId) return;

        // Prevent spamming
        if (request.prayedBy?.includes(currentUserId)) {
            toast('You have already prayed for this request.', { icon: '🙏' });
            return;
        }

        try {
            const requestRef = doc(db, 'visitation_prayers', request.id);
            await updateDoc(requestRef, {
                prayedBy: arrayUnion(currentUserId)
            });
            toast.success("Thanks for praying!");
        } catch (error) {
            toast.error("Failed to register prayer.");
        }
    };

    const handleStatusUpdate = async (requestId: string, newStatus: 'Answered' | 'Archived') => {
        try {
            await updateDoc(doc(db, 'visitation_prayers', requestId), {
                status: newStatus
            });
            toast.success(`Request marked as ${newStatus}`);
        } catch (error) {
            toast.error("Failed to update status.");
        }
    };

    const handleDelete = async (requestId: string) => {
        if (!window.confirm("Are you sure you want to remove this request?")) return;
        try {
            await deleteDoc(doc(db, 'visitation_prayers', requestId));
            toast.success("Request removed.");
        } catch (error) {
            toast.error("Failed to remove request.");
        }
    };

    const categoryColors: Record<string, string> = {
        'Healing': 'bg-green-50 text-green-700 border-green-100',
        'Provision': 'bg-blue-50 text-blue-700 border-blue-100',
        'Family': 'bg-purple-50 text-purple-700 border-purple-100',
        'Spiritual': 'bg-amber-50 text-amber-700 border-amber-100',
        'Other': 'bg-gray-50 text-gray-700 border-gray-100',
    };

    return (
        <div className="space-y-6">
            <Toaster position="top-right" />

            <div className="flex justify-between items-center">
                <div>
                    <h3 className="font-serif font-bold text-2xl text-stone-800">Prayer Wall</h3>
                    <p className="text-stone-500 text-sm">Interceding for our community's needs.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center shadow-sm"
                >
                    <HiPlus className="w-5 h-5 mr-1" />
                    Add Request
                </button>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-12 text-center">
                        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400">
                            <HiOutlineSparkles className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-medium text-stone-900">No active prayer requests</h3>
                        <p className="text-stone-500 mt-1">"Pray without ceasing." - 1 Thessalonians 5:17</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {requests.map((request) => {
                            const hasPrayed = currentUserId && request.prayedBy?.includes(currentUserId);
                            const isAnswered = request.status === 'Answered';

                            return (
                                <div key={request.id} className={`rounded-2xl border p-6 flex flex-col transition-all hover:shadow-md relative ${isAnswered ? 'bg-teal-50/50 border-teal-100' : 'bg-white border-stone-100'}`}>
                                    {isAnswered && (
                                        <div className="absolute top-4 right-4 bg-teal-100 text-teal-800 text-xs font-bold px-2 py-0.5 rounded-full flex items-center">
                                            <HiCheck className="w-3 h-3 mr-1" />
                                            Answered
                                        </div>
                                    )}

                                    <div className="flex-1">
                                        <div className={`inline-block px-2 py-1 rounded-md text-xs font-medium mb-3 border ${categoryColors[request.category]}`}>
                                            {request.category}
                                        </div>
                                        <h4 className="font-bold text-lg text-stone-800 mb-1">{request.title}</h4>
                                        <div className="flex items-center text-stone-400 text-xs mb-3">
                                            <HiOutlineUser className="w-3 h-3 mr-1" />
                                            {request.requesterName}
                                        </div>
                                        <p className="text-stone-600 text-sm mb-6">{request.detail}</p>
                                    </div>

                                    <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                                        <div className="text-xs text-stone-400">
                                            {request.prayedBy?.length || 0} prayers
                                        </div>

                                        <div className="flex space-x-2">
                                            {!isAnswered && (
                                                <button
                                                    onClick={() => handlePray(request)}
                                                    disabled={hasPrayed || isAnswered}
                                                    className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${hasPrayed
                                                            ? 'text-teal-600 bg-teal-50 cursor-default'
                                                            : 'text-stone-600 bg-stone-100 hover:bg-teal-600 hover:text-white'
                                                        }`}
                                                >
                                                    <HiOutlineHand className="w-3 h-3 mr-1" />
                                                    {hasPrayed ? 'Prayed' : 'Pray'}
                                                </button>
                                            )}

                                            {isLeader && (
                                                <div className="flex items-center space-x-1">
                                                    {!isAnswered && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(request.id, 'Answered')}
                                                            className="p-1.5 text-stone-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                                            title="Mark Answered"
                                                        >
                                                            <HiCheck className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(request.id)}
                                                        className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Remove"
                                                    >
                                                        <HiX className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Add Request Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-scale-in">
                        <h3 className="text-lg font-bold text-stone-900 mb-4">Add Prayer Request</h3>
                        <form onSubmit={handleAddRequest} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">For Whom?</label>
                                <input
                                    type="text"
                                    required
                                    value={newRequest.requesterName}
                                    onChange={(e) => setNewRequest({ ...newRequest, requesterName: e.target.value })}
                                    className="w-full rounded-lg border-stone-200 focus:ring-2 focus:ring-teal-500 px-3 py-2"
                                    placeholder="e.g. Sister Sarah, The Church, My Family"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={newRequest.title}
                                    onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                                    className="w-full rounded-lg border-stone-200 focus:ring-2 focus:ring-teal-500 px-3 py-2"
                                    placeholder="Brief summary..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Category</label>
                                <select
                                    value={newRequest.category}
                                    onChange={(e) => setNewRequest({ ...newRequest, category: e.target.value as any })}
                                    className="w-full rounded-lg border-stone-200 focus:ring-2 focus:ring-teal-500 px-3 py-2"
                                >
                                    <option value="Healing">Healing</option>
                                    <option value="Provision">Provision</option>
                                    <option value="Family">Family</option>
                                    <option value="Spiritual">Spiritual</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Details</label>
                                <textarea
                                    rows={3}
                                    required
                                    value={newRequest.detail}
                                    onChange={(e) => setNewRequest({ ...newRequest, detail: e.target.value })}
                                    className="w-full rounded-lg border-stone-200 focus:ring-2 focus:ring-teal-500 px-3 py-2"
                                    placeholder="Specific prayer points..."
                                />
                            </div>

                            <div className="mt-6 flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 text-stone-500 hover:bg-stone-100 rounded-lg text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-teal-600 text-white hover:bg-teal-700 rounded-lg text-sm font-medium"
                                >
                                    Post Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VisitationPrayer;
