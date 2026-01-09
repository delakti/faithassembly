import React, { useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { FaSave, FaHandHoldingUsd } from 'react-icons/fa';

const Income: React.FC = () => {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Tithes'); // Tithes, Offering, Gift Aid, Events
    const [source, setSource] = useState('Cash'); // Cash, Cheque, Online
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await addDoc(collection(db, 'finance_income'), {
                amount: parseFloat(amount),
                category,
                source,
                notes,
                date: new Date().toISOString(),
                createdAt: serverTimestamp(),
                status: 'verified' // Assume manual entry is verified by finance team
            });
            alert('Income logged successfully!');
            setAmount('');
            setNotes('');
        } catch (error) {
            console.error("Error logging income:", error);
            alert("Failed to log income.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <FaHandHoldingUsd size={20} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Log Income</h1>
                        <p className="text-sm text-gray-500">Record tithes, offerings, and donations.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Amount (£)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 font-bold">£</div>
                            <input
                                type="number"
                                step="0.01"
                                required
                                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-mono text-lg"
                                placeholder="0.00"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                            <select
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white"
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                            >
                                <option value="Tithes">Tithes</option>
                                <option value="Offering">General Offering</option>
                                <option value="Gift Aid">Gift Aid Refund</option>
                                <option value="Event">Event Registration</option>
                                <option value="Donation">Specific Donation</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Source / Method</label>
                            <select
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white"
                                value={source}
                                onChange={e => setSource(e.target.value)}
                            >
                                <option value="Cash">Cash Count</option>
                                <option value="Cheque">Cheque</option>
                                <option value="Online">Online Transfer (BACS)</option>
                                <option value="Card">Card Terminal</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Notes (Optional)</label>
                        <textarea
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none h-24"
                            placeholder="e.g. Sunday Service AM, Youth Fund..."
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-4 rounded-lg font-bold hover:bg-green-700 shadow-md transition flex items-center justify-center text-lg"
                    >
                        {loading ? 'Processing...' : <><FaSave className="mr-2" /> Record Transaction</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Income;
