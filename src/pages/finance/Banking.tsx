import React from 'react';
import { FaUniversity, FaCopy } from 'react-icons/fa';

const Banking: React.FC = () => {
    const accounts = [
        { id: 1, bank: 'HSBC', name: 'Main Charity Account', sortCode: '40-45-08', number: '62551594', balance: '£42,500.00' },
        { id: 2, bank: 'Barclays', name: 'Building Fund', sortCode: '20-12-34', number: '87654321', balance: '£15,000.00' },
    ];

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Bank Accounts</h1>
            <p className="text-gray-500">Manage church banking details and view balances.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {accounts.map(acc => (
                    <div key={acc.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <FaUniversity size={100} />
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-xl font-bold text-gray-800 mb-1">{acc.bank}</h2>
                            <p className="text-sm text-gray-500 mb-4">{acc.name}</p>

                            <div className="space-y-2 mb-6">
                                <div className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-100">
                                    <span className="text-xs font-bold text-gray-400">SORT CODE</span>
                                    <button onClick={() => copyToClipboard(acc.sortCode)} className="font-mono font-bold text-gray-700 flex items-center hover:text-emerald-600">
                                        {acc.sortCode} <FaCopy className="ml-2 text-xs opacity-50" />
                                    </button>
                                </div>
                                <div className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-100">
                                    <span className="text-xs font-bold text-gray-400">ACCOUNT NO</span>
                                    <button onClick={() => copyToClipboard(acc.number)} className="font-mono font-bold text-gray-700 flex items-center hover:text-emerald-600">
                                        {acc.number} <FaCopy className="ml-2 text-xs opacity-50" />
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                                <span className="text-sm font-bold text-gray-400">CURRENT BALANCE</span>
                                <span className="text-2xl font-bold text-emerald-600">{acc.balance}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-blue-800 text-sm">
                <strong>Note:</strong> Transaction history and statements are synchronized with Xero/QuickBooks manually at the end of each month.
            </div>
        </div>
    );
};

export default Banking;
