import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase';
import { collection, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { FaSignature, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

const GiftAid: React.FC = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const [status, setStatus] = useState<'loading' | 'active' | 'none'>('loading');
    const [loading, setLoading] = useState(false);

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
        checkStatus();
    }, [user]);

    const checkStatus = async () => {
        if (!user) return;
        const q = query(
            collection(db, 'gift_aid_declarations'),
            where('userId', '==', user.uid),
            orderBy('dateDeclared', 'desc'),
            limit(1)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            setStatus('active');
        } else {
            setStatus('none');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addDoc(collection(db, 'gift_aid_declarations'), {
                ...formData,
                userId: user?.uid,
                email: user?.email,
                dateDeclared: new Date().toISOString(),
                taxPayerConfirmed: true
            });
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
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8 text-center">
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
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
