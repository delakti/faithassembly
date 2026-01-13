import React, { useState, useEffect } from 'react';
import {
    getFirestore,
    collection,
    query,
    where,
    onSnapshot,
    orderBy
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import {
    HiOutlineCalendar,
    HiOutlineLocationMarker,
    HiOutlineUser
} from 'react-icons/hi';
import { format } from 'date-fns';

interface VisitationRequest {
    id: string;
    donorName: string;
    contactInfo: string;
    reason: string;
    preferredTime: string; // or scheduledDate
    scheduledDate?: string;
    status: 'Pending' | 'Scheduled' | 'Completed' | 'Cancelled';
    location?: string;
    assignedTo: string[];
}

const VisitationSchedule: React.FC = () => {
    const [visits, setVisits] = useState<VisitationRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        // Fetch requests assigned to current user
        const q = query(
            collection(db, 'visitation_requests'),
            where('assignedTo', 'array-contains', user.uid),
            // Note: Compound queries with array-contains and orderBy require an index. 
            // If it fails, start with client-side sort or creating the index.
            // For safety in this demo without index creation, we'll fetch then sort client-side if needed, 
            // but let's try just filtering first.
            where('status', 'in', ['Scheduled', 'Pending', 'Completed'])
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as VisitationRequest[];

            // Client-side sort by date if possible, else creation time
            // Assuming scheduledDate is YYYY-MM-DD
            data.sort((a, b) => {
                const dateA = a.scheduledDate || '9999-99-99';
                const dateB = b.scheduledDate || '9999-99-99';
                return dateA.localeCompare(dateB);
            });

            setVisits(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [auth, db]);

    const statusColors = {
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Scheduled': 'bg-blue-100 text-blue-800',
        'Completed': 'bg-green-100 text-green-800',
        'Cancelled': 'bg-red-100 text-red-800'
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="font-serif font-bold text-lg text-stone-800">My Schedule</h3>
                        <p className="text-stone-500 text-sm">Upcoming visits assigned to you.</p>
                    </div>
                    {/* Placeholder for potential calendar sync feature */}
                    <button className="px-4 py-2 bg-stone-100 text-stone-600 text-sm font-medium rounded-lg hover:bg-stone-200 transition-colors flex items-center">
                        <HiOutlineCalendar className="w-4 h-4 mr-2" />
                        Sync Calendar
                    </button>
                </div>

                {loading ? (
                    <div className="p-12 flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
                    </div>
                ) : visits.length === 0 ? (
                    <div className="text-center py-12 px-4">
                        <p className="text-stone-500">No visits scheduled for you yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-stone-600">
                            <thead className="text-xs text-stone-700 uppercase bg-stone-50 border-b border-stone-100">
                                <tr>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Donor Name</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">Reason</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {visits.map((visit) => (
                                    <tr key={visit.id} className="bg-white hover:bg-stone-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-stone-900">
                                            {visit.scheduledDate ? format(new Date(visit.scheduledDate), 'MMM d, yyyy') : 'TBD'}
                                            <div className="text-xs text-stone-400 font-normal mt-0.5">{visit.preferredTime || 'Time not set'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <HiOutlineUser className="w-4 h-4 mr-2 text-teal-500" />
                                                {visit.donorName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center max-w-xs truncate">
                                                <HiOutlineLocationMarker className="w-4 h-4 mr-2 text-stone-400" />
                                                {visit.location || 'No location provided'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {visit.reason}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusColors[visit.status]}`}>
                                                {visit.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VisitationSchedule;
