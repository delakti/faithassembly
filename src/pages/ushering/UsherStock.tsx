import React, { useState } from 'react';
import { HiCube, HiExclamation, HiCheck, HiPlus, HiSearch } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const INVENTORY_DATA = [
    { id: 1, name: 'Tithe Envelopes (Standard)', category: 'Stationery', quantity: 450, minLevel: 200, status: 'good' },
    { id: 2, name: 'First Time Guest Cards', category: 'Stationery', quantity: 45, minLevel: 100, status: 'low' },
    { id: 3, name: 'Communion Cups (Box)', category: 'Sacraments', quantity: 12, minLevel: 5, status: 'good' },
    { id: 4, name: 'Communion Wafers (Box)', category: 'Sacraments', quantity: 8, minLevel: 5, status: 'good' },
    { id: 5, name: 'Staff Lanyards', category: 'Uniform', quantity: 15, minLevel: 20, status: 'low' },
    { id: 6, name: 'Sanitization Wipes', category: 'Hygiene', quantity: 50, minLevel: 20, status: 'good' }
];

const UsherStock: React.FC = () => {
    const [inventory, setInventory] = useState(INVENTORY_DATA);
    const [searchTerm, setSearchTerm] = useState('');

    const handleUpdateStock = (id: number, delta: number) => {
        setInventory(prev => prev.map(item => {
            if (item.id === id) {
                const newQuantity = Math.max(0, item.quantity + delta);
                let newStatus = 'good';
                if (newQuantity <= item.minLevel) newStatus = 'low';
                return { ...item, quantity: newQuantity, status: newStatus };
            }
            return item;
        }));
        toast.success("Stock level updated");
    };

    const handleReorder = (itemName: string) => {
        toast.success(`Reorder request sent for: ${itemName}`);
    };

    const filteredInventory = inventory.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="font-sans text-slate-900 space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">Inventory Control</h1>
                    <p className="text-slate-500 font-medium">Track supplies, stationery, and equipment.</p>
                </div>
                <div className="relative">
                    <HiSearch className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 w-full md:w-64"
                    />
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Low Stock Alerts */}
                {inventory.filter(i => i.status === 'low').map(item => (
                    <div key={`alert-${item.id}`} className="bg-red-50 border border-red-100 rounded-xl p-6 flex items-start gap-4 shadow-sm">
                        <div className="bg-red-100 p-2 rounded-lg">
                            <HiExclamation className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-red-900 text-sm">{item.name}</h3>
                            <p className="text-red-700 text-xs mt-1">Current: <span className="font-bold">{item.quantity}</span> | Min: {item.minLevel}</p>
                            <button
                                onClick={() => handleReorder(item.name)}
                                className="mt-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded shadow-sm transition-colors"
                            >
                                Request Reorder
                            </button>
                        </div>
                    </div>
                ))}

                {/* Main Inventory List */}
                <div className="md:col-span-2 lg:col-span-3">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Item Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Category</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredInventory.map(item => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                                                <HiCube />
                                            </div>
                                            {item.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            <span className="bg-slate-100 px-2 py-1 rounded text-xs font-medium">{item.category}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className={`text-2xl font-bold ${item.status === 'low' ? 'text-red-500' : 'text-slate-900'}`}>
                                                    {item.quantity}
                                                </span>
                                                {item.status === 'good' ? (
                                                    <span className="flex items-center gap-1 text-[10px] text-green-600 font-bold uppercase"><HiCheck className="w-3 h-3" /> OK</span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-[10px] text-red-600 font-bold uppercase"><HiExclamation className="w-3 h-3" /> Low</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleUpdateStock(item.id, -1)}
                                                    className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center text-slate-500 hover:border-slate-300 hover:bg-slate-100"
                                                >
                                                    -
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStock(item.id, 1)}
                                                    className="w-8 h-8 rounded bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 shadow-sm"
                                                >
                                                    <HiPlus />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsherStock;
