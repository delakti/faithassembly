import React from 'react';
import { FaWallet, FaArrowUp, FaArrowDown, FaFileInvoiceDollar } from 'react-icons/fa';

const FinanceDashboard: React.FC = () => {
    // Mock data for dashboard
    const stats = [
        { label: 'Total Balance', value: '£42,500.00', icon: <FaWallet />, color: 'bg-emerald-500' },
        { label: 'Income (May)', value: '£8,250.00', icon: <FaArrowUp />, color: 'bg-green-500' },
        { label: 'Expenses (May)', value: '£3,120.00', icon: <FaArrowDown />, color: 'bg-red-500' },
        { label: 'Pending Invoices', value: '4', icon: <FaFileInvoiceDollar />, color: 'bg-orange-500' },
    ];

    const recentTransactions = [
        { id: 1, desc: 'Sunday Service Offering', date: 'May 12, 2024', amount: '+£1,250.00', type: 'income' },
        { id: 2, desc: 'Youth Event Pizza', date: 'May 10, 2024', amount: '-£125.50', type: 'expense' },
        { id: 3, desc: 'Utility Bill (Electric)', date: 'May 05, 2024', amount: '-£450.00', type: 'expense' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Financial Overview</h1>
                    <p className="text-gray-500 mt-1">Real-time status of church accounts.</p>
                </div>
                <div className="text-sm font-mono text-gray-500 bg-white px-3 py-1 rounded border">
                    FY 2024-2025
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-md ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Transactions */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Transactions</h2>
                    <div className="space-y-4">
                        {recentTransactions.map(tx => (
                            <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100">
                                <div>
                                    <h3 className="font-bold text-gray-800">{tx.desc}</h3>
                                    <p className="text-xs text-gray-500 uppercase">{tx.date}</p>
                                </div>
                                <span className={`font-mono font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                    {tx.amount}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                    <div className="space-y-3">
                        <button className="w-full py-3 px-4 bg-green-50 text-green-700 rounded-lg font-bold hover:bg-green-100 text-left border border-green-100 transition">
                            + Log New Income
                        </button>
                        <button className="w-full py-3 px-4 bg-red-50 text-red-700 rounded-lg font-bold hover:bg-red-100 text-left border border-red-100 transition">
                            - Record Expense
                        </button>
                        <button className="w-full py-3 px-4 bg-slate-50 text-slate-700 rounded-lg font-bold hover:bg-slate-100 text-left border border-slate-100 transition">
                            Create Invoice
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinanceDashboard;
