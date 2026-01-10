import React, { useState } from 'react';
import { useHouseFellowship } from '../../../layouts/HouseLayout';
import { db } from '../../../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { FaHandHoldingHeart, FaMoneyBillWave, FaCheck } from 'react-icons/fa';

const HouseOfferings: React.FC = () => {
    const { fellowship } = useHouseFellowship();
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('Offering');
    const [method, setMethod] = useState('Cash');
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fellowship?.name || !amount) return;

        setSaving(true);
        try {
            await addDoc(collection(db, 'fellowships', fellowship.name, 'offerings'), {
                date: new Date().toISOString(),
                timestamp: Timestamp.now(),
                amount: parseFloat(amount),
                type,
                method,
                notes,
                leader: fellowship.leaders
            });

            setSuccessMsg('Offering saved successfully!');
            setAmount('');
            setNotes('');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (error) {
            console.error("Error saving offering:", error);
            alert("Failed to save offering. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (!fellowship) return null;

    if (!fellowship.isLeader) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaHandHoldingHeart className="text-3xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Giving</h2>
                    <p className="text-gray-500 mb-6">
                        Thank you for your generosity. To give online, please use the main giving portal.
                    </p>
                    <a
                        href="/members/giving"
                        className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition"
                    >
                        Go to Giving Portal
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FaMoneyBillWave className="mr-3 text-green-600" />
                Record Offering
            </h2>

            {successMsg && (
                <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6 flex items-center animate-in fade-in slide-in-from-top-2">
                    <FaCheck className="mr-2" /> {successMsg}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                <form onSubmit={handleSave} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount (£)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">£</span>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                required
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white transition"
                            >
                                <option value="Offering">General Offering</option>
                                <option value="Tithe">Tithe</option>
                                <option value="Seed">Seed Faith</option>
                                <option value="Thanksgiving">Thanksgiving</option>
                                <option value="Welfare">Welfare</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                            <select
                                value={method}
                                onChange={(e) => setMethod(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white transition"
                            >
                                <option value="Cash">Cash</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                                <option value="Card">Card Reader</option>
                                <option value="Check">Check</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            placeholder="Add any additional details..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition resize-none"
                        ></textarea>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className={`w-full py-3.5 rounded-lg font-bold text-white shadow-md transition flex justify-center items-center ${saving ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 hover:shadow-lg transform active:scale-[0.98]'
                                }`}
                        >
                            {saving ? 'Saving Record...' : 'Save Offering Record'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="mt-8 text-center text-sm text-gray-400">
                <p>History of offering records will be available in the Reports section.</p>
            </div>
        </div>
    );
};

export default HouseOfferings;
