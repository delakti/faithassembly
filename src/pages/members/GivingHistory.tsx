import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { FaDownload, FaHistory, FaPoundSign } from 'react-icons/fa';

const GivingHistory: React.FC = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const [donations, setDonations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, [user]);

    const fetchHistory = async () => {
        if (!user) return;
        try {
            // NOTE: Assuming a 'donations' collection exists. If not, this will return empty.
            // In a real integration, this would query Stripe/Square logs or a synced Firestore collection.
            const q = query(
                collection(db, 'donations'),
                where('userId', '==', user.uid),
                orderBy('date', 'desc')
            );
            const snapshot = await getDocs(q);
            setDonations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching giving history:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <FaHistory className="mr-3 text-blue-600" /> Giving History
                </h1>
                <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                    <FaDownload className="mr-2" /> Download Statement
                </button>
            </div>

            {loading ? (
                <p className="text-center py-8 text-gray-500">Loading records...</p>
            ) : donations.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm text-center py-12 px-4 border border-gray-100">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 text-2xl">
                        <FaPoundSign />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No donations found online</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                        Donations made via our new online portal will appear here. Cash or older manual offerings may not be listed yet.
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Fund/Type</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {donations.map((d) => (
                                <tr key={d.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(d.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {d.fund || 'General Offering'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                        £{d.amount?.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                                            Completed
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default GivingHistory;
