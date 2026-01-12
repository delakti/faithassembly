import React, { useState, useEffect } from 'react';
import { ref, get, update, push, remove, set } from 'firebase/database';
import { database } from '../../../../firebase';
import { toast } from 'react-hot-toast';
import { HiSearch, HiUserGroup, HiBadgeCheck, HiBan, HiPencil, HiTrash, HiPlus, HiX } from 'react-icons/hi';

interface Donor {
    id: string;
    'First Name': string;
    'Last Name': string;
    Email: string;
    'Mobile Phone': string;
    'House Number'?: string;
    'Street Name'?: string;
    City?: string;
    Postcode?: string;
    worker?: boolean;
    Role?: string;
    BranchName?: string;
    [key: string]: any;
}

const DonorManager: React.FC = () => {
    const [donors, setDonors] = useState<Donor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDonor, setEditingDonor] = useState<Donor | null>(null);
    const [formData, setFormData] = useState<Partial<Donor>>({});

    useEffect(() => {
        fetchDonors();
    }, []);

    const fetchDonors = async () => {
        setLoading(true);
        try {
            const donorsRef = ref(database, 'donor');
            const snapshot = await get(donorsRef);
            if (snapshot.exists()) {
                const data = snapshot.val();
                const donorList = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                // Sort by name
                donorList.sort((a, b) => (a['First Name'] || '').localeCompare(b['First Name'] || ''));
                setDonors(donorList);
            } else {
                setDonors([]);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load donors");
        } finally {
            setLoading(false);
        }
    };

    const toggleWorkerStatus = async (donor: Donor) => {
        const newStatus = !donor.worker;
        try {
            const updates: any = {};
            updates[`/donor/${donor.id}/worker`] = newStatus;

            await update(ref(database), updates);

            // Optimistic Update
            setDonors(prev => prev.map(d =>
                d.id === donor.id ? { ...d, worker: newStatus } : d
            ));

            toast.success(`${donor['First Name']} is ${newStatus ? 'now a Worker' : 'no longer a Worker'}`);
        } catch (error) {
            console.error(error);
            toast.error("Update failed");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this donor? This cannot be undone.")) return;

        try {
            await remove(ref(database, `donor/${id}`));
            setDonors(prev => prev.filter(d => d.id !== id));
            toast.success("Donor deleted");
        } catch (error) {
            console.error(error);
            toast.error("Delete failed");
        }
    };

    const openModal = (donor?: Donor) => {
        if (donor) {
            setEditingDonor(donor);
            setFormData({ ...donor });
        } else {
            setEditingDonor(null);
            setFormData({
                'First Name': '',
                'Last Name': '',
                Email: '',
                'Mobile Phone': '',
                'House Number': '',
                'Street Name': '',
                City: '',
                Postcode: '',
                Role: 'user',
                worker: false,
                BranchName: 'Main Branch'
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingDonor) {
                // Update
                const updates: any = {};
                updates[`/donor/${editingDonor.id}`] = { ...editingDonor, ...formData };
                await update(ref(database), updates);

                setDonors(prev => prev.map(d => d.id === editingDonor.id ? { ...d, ...formData } as Donor : d));
                toast.success("Donor updated");
            } else {
                // Create
                const newRef = push(ref(database, 'donor'));
                const newDonor = { ...formData, timestamp: Date.now() };
                await set(newRef, newDonor);

                setDonors(prev => [...prev, { id: newRef.key!, ...newDonor } as Donor]);
                toast.success("Donor created");
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            toast.error("Save failed");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const filteredDonors = donors.filter(d => {
        const fullName = `${d['First Name']} ${d['Last Name']}`.toLowerCase();
        const email = (d.Email || '').toLowerCase();
        const search = searchTerm.toLowerCase();
        return fullName.includes(search) || email.includes(search);
    });

    return (
        <div className="space-y-6 font-sans text-stone-900">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <HiUserGroup className="text-orange-600" /> Donor & Worker Management
                    </h1>
                    <p className="text-stone-500">Manage all registered donors and assign worker status for ministry teams.</p>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <HiSearch className="absolute left-3 top-3.5 text-stone-400" />
                        <input
                            type="text"
                            placeholder="Search donors..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="bg-stone-900 text-white px-4 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-stone-800"
                    >
                        <HiPlus /> Add
                    </button>
                </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-stone-50 border-b border-stone-200">
                            <tr>
                                <th className="p-4 font-bold text-stone-600">Name</th>
                                <th className="p-4 font-bold text-stone-600">Contact</th>
                                <th className="p-4 font-bold text-stone-600">Role</th>
                                <th className="p-4 font-bold text-stone-600 text-center">Worker Status</th>
                                <th className="p-4 font-bold text-stone-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-stone-400">Loading donors...</td>
                                </tr>
                            ) : filteredDonors.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-stone-400">No donors found matching "{searchTerm}"</td>
                                </tr>
                            ) : (
                                filteredDonors.map(donor => (
                                    <tr key={donor.id} className="hover:bg-orange-50/30 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-stone-900">{donor['First Name']} {donor['Last Name']}</div>
                                            <div className="text-xs text-stone-400 font-mono">{donor.id}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm">{donor.Email}</div>
                                            <div className="text-xs text-stone-500">{donor['Mobile Phone']}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-stone-100 text-stone-600 rounded text-xs font-bold uppercase">
                                                {donor.Role || 'User'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            {donor.worker ? (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">
                                                    <HiBadgeCheck /> Active Worker
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-stone-100 text-stone-400 rounded-full text-xs font-bold uppercase">
                                                    <HiBan /> Not Worker
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => toggleWorkerStatus(donor)}
                                                    className={`px-3 py-1 rounded text-xs font-bold transition-colors ${donor.worker
                                                            ? 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        }`}
                                                >
                                                    {donor.worker ? 'Revoke' : 'Make Worker'}
                                                </button>
                                                <button
                                                    onClick={() => openModal(donor)}
                                                    className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                                                    title="Edit"
                                                >
                                                    <HiPencil />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(donor.id)}
                                                    className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100"
                                                    title="Delete"
                                                >
                                                    <HiTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* CRUD Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b border-stone-100 flex justify-between items-center sticky top-0 bg-white">
                            <h2 className="text-xl font-bold">{editingDonor ? 'Edit Donor' : 'Add New Donor'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-stone-100 rounded-full">
                                <HiX className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-stone-500 mb-1">First Name</label>
                                    <input
                                        name="First Name"
                                        value={formData['First Name'] || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Last Name</label>
                                    <input
                                        name="Last Name"
                                        value={formData['Last Name'] || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Email</label>
                                    <input
                                        name="Email"
                                        type="email"
                                        value={formData.Email || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Mobile Phone</label>
                                    <input
                                        name="Mobile Phone"
                                        value={formData['Mobile Phone'] || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Address</label>
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <input
                                        name="House Number"
                                        placeholder="House No."
                                        value={formData['House Number'] || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-stone-200 rounded-lg outline-none"
                                    />
                                    <input
                                        name="Street Name"
                                        placeholder="Street Name"
                                        value={formData['Street Name'] || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-stone-200 rounded-lg outline-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        name="City"
                                        placeholder="City"
                                        value={formData.City || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-stone-200 rounded-lg outline-none"
                                    />
                                    <input
                                        name="Postcode"
                                        placeholder="Postcode"
                                        value={formData.Postcode || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-stone-200 rounded-lg outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Role</label>
                                    <select
                                        name="Role"
                                        value={formData.Role || 'user'}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-stone-200 rounded-lg outline-none bg-white"
                                    >
                                        <option value="user">User</option>
                                        <option value="leader">Leader</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Worker Status</label>
                                    <div className="flex items-center gap-4 mt-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="worker"
                                                checked={!!formData.worker}
                                                onChange={(e) => setFormData(p => ({ ...p, worker: e.target.checked }))}
                                                className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                                            />
                                            <span className="font-medium text-stone-700">Active Worker</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-stone-100 flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2 text-stone-500 font-bold hover:bg-stone-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700"
                                >
                                    Save Record
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DonorManager;
