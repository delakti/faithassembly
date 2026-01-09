import React, { useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { FaSave, FaReceipt } from 'react-icons/fa';

const Expenses: React.FC = () => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Supplies');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await addDoc(collection(db, 'finance_expenses'), {
                amount: parseFloat(amount),
                description,
                category,
                date: new Date().toISOString(),
                createdAt: serverTimestamp(),
                status: 'pending_approval'
            });
            alert('Expense claim submitted for approval!');
            setAmount('');
            setDescription('');
        } catch (error) {
            console.error("Error submitting expense:", error);
            alert("Failed to submit expense.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                        <FaReceipt size={20} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Submit Expense</h1>
                        <p className="text-sm text-gray-500">Claim reimbursement for church-related purchases.</p>
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
                                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none font-mono text-lg"
                                placeholder="0.00"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                            placeholder="e.g. Printer ink, Sunday School treats"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                        <select
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white"
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                        >
                            <option value="Supplies">Office/General Supplies</option>
                            <option value="Events">Event Costs</option>
                            <option value="Utilities">Utilities/Bills</option>
                            <option value="Maintenance">Repair & Maintenance</option>
                            <option value="Travel">Travel/Transport</option>
                        </select>
                    </div>

                    <div className="p-4 bg-yellow-50 text-yellow-800 text-sm rounded-lg border border-yellow-200">
                        <strong>Receipt Upload:</strong> Please email a photo of your receipt to finance@faithassembly.org.uk after submitting this form.
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 text-white py-4 rounded-lg font-bold hover:bg-red-700 shadow-md transition flex items-center justify-center text-lg"
                    >
                        {loading ? 'Submitting...' : <><FaSave className="mr-2" /> Submit Claim</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Expenses;
