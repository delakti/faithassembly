import React, { useState, useEffect } from 'react';
import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp,
    query,
    where,
    orderBy,
    onSnapshot,
    getDocs
} from 'firebase/firestore';
import { getDatabase, ref, get } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import {
    HiOutlineDocumentText,
    HiSearch,
    HiOutlineUser,
    HiOutlineCalendar,
    HiCheck
} from 'react-icons/hi';
import toast, { Toaster } from 'react-hot-toast';

interface VisitationReport {
    id?: string;
    donorId: string;
    donorName: string;
    dateOfVisit: string;
    summary: string;
    referrals: string;
    followUpNeeded: boolean;
    submittedBy: string;
    createdAt: any;
}

interface Donor {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    fullSearchString: string; // Helper for search
}

const VisitationReports: React.FC = () => {
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        donorId: '',
        donorName: '', // Fallback or display name
        dateOfVisit: '',
        summary: '',
        referrals: '',
        followUpNeeded: false
    });

    // Donor Search State
    const [donors, setDonors] = useState<Donor[]>([]);
    const [donorSearch, setDonorSearch] = useState('');
    const [showDonorDropdown, setShowDonorDropdown] = useState(false);
    const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);

    const db = getFirestore();
    const rtdb = getDatabase();
    const auth = getAuth();

    // Fetch Donors from Realtime Database
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
                        return {
                            id: key,
                            firstName,
                            lastName,
                            email: d.Email || '',
                            fullSearchString: `${firstName} ${lastName} ${d.Email || ''}`.toLowerCase()
                        };
                    });
                    setDonors(donorList);
                }
            } catch (error) {
                console.error("Error fetching donors:", error);
                toast.error("Could not load donor list.");
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
        const results = donors.filter(d => d.fullSearchString.includes(lowerSearch)).slice(0, 5); // Limit to 5 results
        setFilteredDonors(results);
    }, [donorSearch, donors]);

    const handleSelectDonor = (donor: Donor) => {
        setFormData(prev => ({
            ...prev,
            donorId: donor.id,
            donorName: `${donor.firstName} ${donor.lastName}`
        }));
        setDonorSearch(`${donor.firstName} ${donor.lastName}`);
        setShowDonorDropdown(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const user = auth.currentUser;
            if (!user) throw new Error("Not authenticated");

            if (!formData.donorId && !formData.donorName) {
                toast.error("Please select a donor or enter a name.");
                setLoading(false);
                return;
            }

            await addDoc(collection(db, 'visitation_reports'), {
                ...formData,
                submittedBy: user.uid,
                createdAt: serverTimestamp()
            });

            toast.success('Report submitted successfully!');
            // Reset Form (keep date for convenience?)
            setFormData({
                donorId: '',
                donorName: '',
                dateOfVisit: '',
                summary: '',
                referrals: '',
                followUpNeeded: false
            });
            setDonorSearch('');
        } catch (error) {
            console.error("Error submitting report:", error);
            toast.error("Failed to submit report.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Toaster position="top-right" />

            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 max-w-2xl mx-auto">
                <div className="flex items-center space-x-3 mb-6 border-b border-stone-100 pb-4">
                    <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                        <HiOutlineDocumentText className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-serif font-bold text-xl text-stone-800">Submit Visitation Report</h3>
                        <p className="text-stone-500 text-sm">Record details of your recent visit.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Donor Search Field */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-stone-700 mb-1">Donor Visited</label>
                        <div className="relative">
                            <HiSearch className="absolute left-3 top-3.5 text-stone-400" />
                            <input
                                type="text"
                                value={donorSearch}
                                onChange={(e) => {
                                    setDonorSearch(e.target.value);
                                    setShowDonorDropdown(true);
                                    // If user clears input, clear selection
                                    if (e.target.value === '') setFormData(prev => ({ ...prev, donorId: '', donorName: '' }));
                                }}
                                onFocus={() => setShowDonorDropdown(true)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-teal-500 outline-none transition-shadow"
                                placeholder="Search by name or email..."
                                required={!formData.donorId} // Require input
                            />
                        </div>

                        {/* Dropdown Results */}
                        {showDonorDropdown && filteredDonors.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white rounded-xl shadow-lg border border-stone-100 overflow-hidden">
                                {filteredDonors.map(donor => (
                                    <button
                                        key={donor.id}
                                        type="button"
                                        onClick={() => handleSelectDonor(donor)}
                                        className="w-full text-left px-4 py-3 hover:bg-teal-50 flex items-center justify-between group transition-colors"
                                    >
                                        <div>
                                            <p className="font-medium text-stone-800 group-hover:text-teal-700">{donor.firstName} {donor.lastName}</p>
                                            <p className="text-xs text-stone-400">{donor.email}</p>
                                        </div>
                                        {formData.donorId === donor.id && <HiCheck className="text-teal-600 w-5 h-5" />}
                                    </button>
                                ))}
                            </div>
                        )}
                        {/* Manual Override Warning / helper */}
                        {donorSearch && filteredDonors.length === 0 && !formData.donorId && (
                            <p className="text-xs text-orange-500 mt-1 ml-1">Donor not found in database. Please ensure spelling is correct.</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Date of Visit</label>
                        <div className="relative">
                            <HiOutlineCalendar className="absolute left-3 top-3.5 text-stone-400" />
                            <input
                                type="date"
                                required
                                value={formData.dateOfVisit}
                                onChange={(e) => setFormData({ ...formData, dateOfVisit: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Summary / Feedback</label>
                        <textarea
                            rows={4}
                            required
                            value={formData.summary}
                            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-teal-500 outline-none"
                            placeholder="How did the visit go? What was discussed?"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Referrals / Needs (Optional)</label>
                        <input
                            type="text"
                            value={formData.referrals}
                            onChange={(e) => setFormData({ ...formData, referrals: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-teal-500 outline-none"
                            placeholder="e.g. Needs pastoral call, food bank support..."
                        />
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                        <input
                            type="checkbox"
                            id="followUp"
                            checked={formData.followUpNeeded}
                            onChange={(e) => setFormData({ ...formData, followUpNeeded: e.target.checked })}
                            className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500 border-gray-300"
                        />
                        <label htmlFor="followUp" className="text-sm font-medium text-stone-700 cursor-pointer">Mark for Follow-up</label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors disabled:opacity-50 flex justify-center"
                    >
                        {loading ? 'Submitting...' : 'Submit Report'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VisitationReports;
