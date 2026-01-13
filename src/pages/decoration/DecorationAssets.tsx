import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, orderBy, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import {
    HiColorSwatch,
    HiPlus,
    HiTrash,
    HiPencil,
    HiSearch,
    HiPhotograph,
    HiLocationMarker,
    HiX,
} from 'react-icons/hi';
import { toast } from 'react-hot-toast';

interface Asset {
    id: string;
    name: string;
    category: string;
    quantity: number;
    location: string;
    condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    imageUrl?: string;
}

const DecorationAssets: React.FC = () => {
    const auth = getAuth();
    const db = getFirestore();
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLeader, setIsLeader] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
    const [formData, setFormData] = useState<Partial<Asset>>({});

    useEffect(() => {
        checkRole();
        fetchAssets();
    }, []);

    const checkRole = async () => {
        if (auth.currentUser) {
            const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
            if (userDoc.exists()) {
                const role = userDoc.data().role;
                if (['decor_leader', 'hospitality_leader', 'admin', 'super_admin'].includes(role)) {
                    setIsLeader(true);
                }
            }
        }
    };

    const fetchAssets = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'decor_assets'), orderBy('name', 'asc'));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Asset[];
            setAssets(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load inventory");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingAsset) {
                // Update
                await updateDoc(doc(db, 'decor_assets', editingAsset.id), {
                    ...formData,
                    updatedAt: serverTimestamp()
                });
                setAssets(prev => prev.map(a => a.id === editingAsset.id ? { ...a, ...formData } as Asset : a));
                toast.success("Asset updated");
            } else {
                // Create
                const docRef = await addDoc(collection(db, 'decor_assets'), {
                    ...formData,
                    createdAt: serverTimestamp()
                });
                setAssets(prev => [...prev, { id: docRef.id, ...formData } as Asset]);
                toast.success("Asset added");
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            toast.error("Save failed");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this item from inventory?")) return;
        try {
            await deleteDoc(doc(db, 'decor_assets', id));
            setAssets(prev => prev.filter(a => a.id !== id));
            toast.success("Item removed");
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    const openModal = (asset?: Asset) => {
        if (asset) {
            setEditingAsset(asset);
            setFormData({ ...asset });
        } else {
            setEditingAsset(null);
            setFormData({
                name: '',
                category: 'General',
                quantity: 1,
                location: 'Storage Room A',
                condition: 'Good',
                imageUrl: ''
            });
        }
        setIsModalOpen(true);
    };

    const filteredAssets = assets.filter(asset => {
        const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || asset.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const categories = ['All', 'Vases', 'Fabrics', 'Lights', 'Flowers', 'Tools', 'Furniture', 'General'];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-serif text-fuchsia-950">Asset Inventory</h1>
                    <p className="text-slate-500">Track and manage decoration items.</p>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <HiSearch className="absolute left-3 top-3.5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search inventory..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-fuchsia-500 outline-none"
                        />
                    </div>
                    {isLeader && (
                        <button
                            onClick={() => openModal()}
                            className="bg-fuchsia-600 text-white px-4 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-fuchsia-700 whitespace-nowrap"
                        >
                            <HiPlus /> Add Item
                        </button>
                    )}
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${categoryFilter === cat
                            ? 'bg-fuchsia-100 text-fuchsia-700'
                            : 'bg-white border border-slate-100 text-slate-500 hover:bg-slate-50'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-12 text-slate-400">Loading inventory...</div>
                ) : filteredAssets.length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                        <HiColorSwatch className="w-12 h-12 text-slate-200 mx-auto mb-2" />
                        <p className="text-slate-500">No items found.</p>
                    </div>
                ) : (
                    filteredAssets.map(asset => (
                        <div key={asset.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="h-48 bg-slate-100 relative overflow-hidden">
                                {asset.imageUrl ? (
                                    <img src={asset.imageUrl} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <HiPhotograph className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                                    Qty: {asset.quantity}
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-slate-800 text-lg truncate pr-2">{asset.name}</h3>
                                    {isLeader && (
                                        <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openModal(asset)} className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"><HiPencil className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(asset.id)} className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100"><HiTrash className="w-4 h-4" /></button>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2 text-sm text-slate-500">
                                    <div className="flex items-center gap-1">
                                        <HiLocationMarker className="w-4 h-4 text-fuchsia-400" />
                                        <span>{asset.location}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="bg-slate-100 px-2 py-1 rounded">{asset.condition}</span>
                                        <span className="text-slate-400">{asset.category}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-slate-50 rounded-full">
                            <HiX className="w-6 h-6 text-slate-400" />
                        </button>

                        <h2 className="text-xl font-bold mb-6">{editingAsset ? 'Edit Item' : 'Add New Item'}</h2>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Item Name</label>
                                <input
                                    className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-fuchsia-500"
                                    required
                                    value={formData.name || ''}
                                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Category</label>
                                    <select
                                        className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-fuchsia-500 bg-white"
                                        value={formData.category || 'General'}
                                        onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                    >
                                        {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Quantity</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-fuchsia-500"
                                        value={formData.quantity || 0}
                                        onChange={e => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Location</label>
                                    <input
                                        className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-fuchsia-500"
                                        value={formData.location || ''}
                                        onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Condition</label>
                                    <select
                                        className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-fuchsia-500 bg-white"
                                        value={formData.condition || 'Good'}
                                        onChange={e => setFormData(prev => ({ ...prev, condition: e.target.value as any }))}
                                    >
                                        <option value="Excellent">Excellent</option>
                                        <option value="Good">Good</option>
                                        <option value="Fair">Fair</option>
                                        <option value="Poor">Poor</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Image URL</label>
                                <input
                                    className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-fuchsia-500"
                                    placeholder="https://..."
                                    value={formData.imageUrl || ''}
                                    onChange={e => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-bold text-slate-500 hover:bg-slate-50 rounded-lg">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-fuchsia-600 text-white font-bold rounded-lg hover:bg-fuchsia-700">Save Item</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DecorationAssets;
