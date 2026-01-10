import React, { useState, useEffect } from 'react';
import { HiChip, HiExclamation, HiCheck, HiPlus, HiTag, HiX } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import type { MediaEquipmentItem } from '../../types/media';

const MediaEquipment: React.FC = () => {
    const [equipment, setEquipment] = useState<MediaEquipmentItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', category: 'Camera', notes: '' });

    useEffect(() => {
        const q = query(collection(db, 'media_equipment'), orderBy('lastCheck', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setEquipment(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MediaEquipmentItem)));
        });
        return () => unsubscribe();
    }, []);

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItem.name) return;
        try {
            await addDoc(collection(db, 'media_equipment'), {
                ...newItem,
                status: 'Operational',
                lastCheck: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                createdAt: serverTimestamp()
            });
            toast.success('Equipment added');
            setIsModalOpen(false);
            setNewItem({ name: '', category: 'Camera', notes: '' });
        } catch (error) {
            toast.error('Failed to add item');
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const itemRef = doc(db, 'media_equipment', id);
            await updateDoc(itemRef, {
                status: newStatus,
                lastCheck: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
            });
            toast.success(`Status updated to ${newStatus}`);
        } catch (error) {
            toast.error('Update failed');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Remove this item from inventory?")) return;
        try {
            await deleteDoc(doc(db, 'media_equipment', id));
            toast.success('Item removed');
        } catch (error) {
            toast.error('Failed to remove');
        }
    }

    return (
        <div className="space-y-8 font-sans relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <span className="text-cyan-500 font-mono font-bold text-xs mb-2 block tracking-widest uppercase">Inventory Control</span>
                    <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Equipment Log</h1>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 bg-slate-800 border border-slate-700 text-white font-bold rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2 font-mono uppercase text-sm"
                >
                    <HiPlus className="w-5 h-5" /> Add Item
                </button>
            </div>

            <div className="grid gap-4">
                {equipment.length === 0 && <p className="text-slate-500 italic">No equipment logged.</p>}
                {equipment.map((item) => (
                    <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-700 transition-all group">
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center border flex-shrink-0 ${item.status === 'Operational' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                                item.status === 'Maintenance' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
                                    'bg-red-500/10 border-red-500/20 text-red-500'
                                }`}>
                                <HiChip className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg flex items-center gap-3">
                                    {item.name}
                                    <span className="text-[10px] font-mono text-slate-500 uppercase px-2 py-0.5 bg-slate-950 rounded border border-slate-800 flex items-center gap-1">
                                        <HiTag className="w-3 h-3" /> {item.category}
                                    </span>
                                </h3>
                                <p className="text-slate-400 text-sm mt-1">{item.notes || 'No notes.'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 justify-between md:justify-end border-t md:border-t-0 border-slate-800 pt-4 md:pt-0">
                            <div className="text-right">
                                <span className={`block text-xs font-bold uppercase tracking-wide mb-1 ${item.status === 'Operational' ? 'text-green-500' :
                                    item.status === 'Maintenance' ? 'text-yellow-500' :
                                        'text-red-500'
                                    }`}>
                                    Status: {item.status}
                                </span>
                                <span className="text-[10px] font-mono text-slate-600 uppercase">Checked: {item.lastCheck}</span>
                            </div>

                            {item.status === 'Operational' ? (
                                <button
                                    onClick={() => updateStatus(item.id, 'Maintenance')}
                                    className="px-4 py-2 border border-red-900/50 text-red-500 text-xs font-bold uppercase rounded hover:bg-red-900/20 transition-colors flex items-center gap-2"
                                >
                                    <HiExclamation className="w-4 h-4" /> Report
                                </button>
                            ) : (
                                <button
                                    onClick={() => updateStatus(item.id, 'Operational')}
                                    className="px-4 py-2 bg-slate-950 text-slate-400 text-xs font-bold uppercase rounded hover:text-green-500 hover:bg-green-900/20 transition-colors flex items-center gap-2"
                                >
                                    <HiCheck className="w-4 h-4" /> Resolve
                                </button>
                            )}
                            <button onClick={() => handleDelete(item.id)} className="text-slate-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <HiX />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Item Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white uppercase">Add Equipment</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><HiX className="w-6 h-6" /></button>
                        </div>
                        <form onSubmit={handleAddItem} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Equipment Name</label>
                                <input
                                    className="w-full bg-black border border-slate-800 rounded px-4 py-3 text-white focus:border-cyan-500 outline-none"
                                    value={newItem.name}
                                    onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                    placeholder="e.g. Sony A7III"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                                <select
                                    className="w-full bg-black border border-slate-800 rounded px-4 py-3 text-white focus:border-cyan-500 outline-none"
                                    value={newItem.category}
                                    onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                                >
                                    <option>Camera</option>
                                    <option>Audio</option>
                                    <option>Video</option>
                                    <option>Lighting</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Initial Notes</label>
                                <textarea
                                    className="w-full bg-black border border-slate-800 rounded px-4 py-3 text-white focus:border-cyan-500 outline-none"
                                    value={newItem.notes}
                                    onChange={e => setNewItem({ ...newItem, notes: e.target.value })}
                                    placeholder="Condition, serial number, etc."
                                />
                            </div>
                            <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded uppercase tracking-wide transition-colors">
                                Add to Inventory
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MediaEquipment;
