import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { db, database } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, query, orderByChild, equalTo, get, update } from 'firebase/database';
import { FaSignature, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

const GiftAid: React.FC = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const [status, setStatus] = useState<'loading' | 'active' | 'none'>('loading');
    const [loading, setLoading] = useState(false);
    const [donorKey, setDonorKey] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        firstName: '',
        lastName: '',
        addressLine1: '',
        addressLine2: '',
        town: '',
        postcode: '',
    });

    useEffect(() => {
        const fetchDonorStatus = async () => {
            if (!user?.email) {
                setStatus('none');
                return;
            }

            try {
                // Query Realtime DB for donor record by Email
                const donorRef = ref(database, 'donor');
                const donorQ = query(donorRef, orderByChild('Email'), equalTo(user.email));
                const snapshot = await get(donorQ);

                if (snapshot.exists()) {
                    const donorVal = snapshot.val();
                    const key = Object.keys(donorVal)[0];
                    setDonorKey(key);
                    const donorData = donorVal[key];

                    if (donorData.GiftAidAccepted === true || donorData.GiftAidAccepted === 'true') {
                        setStatus('active');
                        // Pre-fill form just in case they want to see it? No, just show active state.
                    } else {
                        // Pre-fill form with known data
                        setFormData(prev => ({
                            ...prev,
                            firstName: donorData['First Name'] || donorData.FirstName || '',
                            lastName: donorData['Last Name'] || donorData.LastName || '',
                            addressLine1: donorData['Street Name'] || donorData.Address || '',
                            town: donorData.City || '',
                            postcode: donorData.Postcode || ''
                        }));
                        setStatus('none');
                    }
                } else {
                    setStatus('none');
                }
            } catch (error) {
                console.error("Error fetching donor status:", error);
                setStatus('none');
            }
        };

        fetchDonorStatus();
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const timestamp = new Date().toISOString();

            // 1. Create audit record in Firestore
            await addDoc(collection(db, 'gift_aid_declarations'), {
                ...formData,
                userId: user?.uid,
                email: user?.email,
                dateDeclared: timestamp,
                taxPayerConfirmed: true
            });

            // 2. Update donor record in Realtime Database if it exists
            if (donorKey) {
                const updates: any = {};
                updates[`/donor/${donorKey}/GiftAidAccepted`] = true;
                updates[`/donor/${donorKey}/GiftAidDate`] = timestamp;
                await update(ref(database), updates);
            }

            setStatus('active');
        } catch (error) {
            console.error("Error submitting declaration:", error);
            alert("Failed to submit declaration. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading') return <p className="p-8 text-center text-gray-500">Checking status...</p>;

    if (status === 'active') {
        return (
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8 text-center mt-8">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                    <FaCheckCircle />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Gift Aid Active</h1>
                <p className="text-gray-600">
                    Thank you! We have your active Gift Aid declaration on file.
                    This allows us to claim an extra 25p for every £1 you give.
                </p>
                <div className="mt-8 p-4 bg-gray-50 rounded-lg text-sm text-gray-500">
                    If your tax status changes or you wish to cancel this declaration, please contact the finance team.
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-8">
            <div className="bg-blue-600 p-6 text-white text-center">
                <FaSignature className="mx-auto text-4xl mb-4" />
                <h1 className="text-2xl font-bold">Gift Aid Declaration</h1>
                <p className="text-blue-100">Boost your donation by 25p of Gift Aid for every £1 you donate.</p>
            </div>

            <div className="p-8">
                <div className="flex items-start bg-blue-50 p-4 rounded-lg mb-8 text-sm text-blue-800">
                    <FaInfoCircle className="mt-1 mr-3 flex-shrink-0" />
                    <p>
                        By submitting this form, you confirm that you are a UK taxpayer and understand that if you pay less Income Tax and/or Capital Gains Tax than the amount of Gift Aid claimed on all your donations in that tax year, it is your responsibility to pay any difference.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input
                            required
                            placeholder="Title (Mr/Mrs/Ms)"
                            className="p-3 border rounded-lg w-full"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                        <div className="hidden md:block"></div> {/* Spacer */}

                        <input
                            required
                            placeholder="First Name"
                            className="p-3 border rounded-lg w-full"
                            value={formData.firstName}
                            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                        />
                        <input
                            required
                            placeholder="Last Name"
                            className="p-3 border rounded-lg w-full"
                            value={formData.lastName}
                            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                        />
                    </div>

                    <div className="space-y-4">
                        <input
                            required
                            placeholder="Address Line 1"
                            className="p-3 border rounded-lg w-full"
                            value={formData.addressLine1}
                            onChange={e => setFormData({ ...formData, addressLine1: e.target.value })}
                        />
                        <input
                            placeholder="Address Line 2 (Optional)"
                            className="p-3 border rounded-lg w-full"
                            value={formData.addressLine2}
                            onChange={e => setFormData({ ...formData, addressLine2: e.target.value })}
                        />
                        <div className="grid grid-cols-2 gap-6">
                            <input
                                required
                                placeholder="Town/City"
                                className="p-3 border rounded-lg w-full"
                                value={formData.town}
                                onChange={e => setFormData({ ...formData, town: e.target.value })}
                            />
                            <input
                                required
                                placeholder="Postcode"
                                className="p-3 border rounded-lg w-full"
                                value={formData.postcode}
                                onChange={e => setFormData({ ...formData, postcode: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            required
                            type="checkbox"
                            id="confirm"
                            className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor="confirm" className="ml-3 block text-sm text-gray-700">
                            I want to Gift Aid my donation and any donations I make in the future or have made in the past 4 years to Faith Assembly.
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md"
                    >
                        {loading ? 'Submitting...' : 'Make Declaration'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GiftAid;
