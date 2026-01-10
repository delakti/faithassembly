import React, { useState, useEffect } from 'react';
import { ref, get, set, update, remove, push } from 'firebase/database';
import { HiPlus, HiPencil, HiTrash, HiSearch, HiX, HiUserGroup } from 'react-icons/hi';
import { database } from '../../../../firebase';

interface Group {
    id: string;
    title: string;
    description: string;
    image?: string;
    leaderName?: string;
    leaderEmail?: string;
    leaderPhone?: string;
    meetingDays?: string;
    venue?: string;
}

const GroupManager: React.FC = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState<Group | null>(null);
    const [formData, setFormData] = useState<Partial<Group>>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        console.log("Fetching groups...");
        try {
            const db = database;
            const groupsRef = ref(db, 'churchGroups');
            const snapshot = await get(groupsRef);

            console.log("Snapshot exists:", snapshot.exists());
            if (snapshot.exists()) {
                const data = snapshot.val();
                console.log("Groups data:", data);

                const groupsList = Object.keys(data)
                    .map(key => ({
                        id: key,
                        ...data[key]
                    }))
                    // Filter out invalid items (must have title)
                    .filter((g: any) => g && g.title && typeof g.title === 'string');

                // Sort by title
                groupsList.sort((a, b) => a.title.localeCompare(b.title));
                setGroups(groupsList);
            } else {
                console.log("No groups found.");
                setGroups([]);
            }
        } catch (error) {
            console.error("Error fetching groups:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (group: Group | null = null) => {
        if (group) {
            setEditingGroup(group);
            setFormData(group);
        } else {
            setEditingGroup(null);
            setFormData({
                title: '',
                description: '',
                image: '',
                leaderName: '',
                leaderEmail: '',
                leaderPhone: '',
                meetingDays: '',
                venue: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingGroup(null);
        setFormData({});
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const db = database;

            if (editingGroup) {
                // Update existing
                const groupRef = ref(db, `churchGroups/${editingGroup.id}`);
                await update(groupRef, formData);
                alert("Group updated successfully!");
            } else {
                // Create new
                const groupsRef = ref(db, 'churchGroups');
                const newGroupRef = push(groupsRef);
                await set(newGroupRef, formData);
                alert("Group created successfully!");
            }

            handleCloseModal();
            fetchGroups(); // Refresh list
        } catch (error) {
            console.error("Error saving group:", error);
            alert("Failed to save group.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this group? This action cannot be undone.")) return;

        try {
            const db = database;
            await remove(ref(db, `churchGroups/${id}`));
            setGroups(prev => prev.filter(g => g.id !== id));
        } catch (error) {
            console.error("Error deleting group:", error);
            alert("Failed to delete group.");
        }
    };

    const filteredGroups = groups.filter(g =>
        g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.leaderName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Group Management</h1>
                    <p className="text-slate-500 text-sm">Create and manage small groups, leaders, and meeting details.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                    <HiPlus className="w-5 h-5 mr-2" /> Add New Group
                </button>
            </div>

            {/* Search and Filter */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="relative">
                    <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search groups by title or leader..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                </div>
            </div>

            {/* Groups Grid */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : filteredGroups.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <HiUserGroup className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No groups found</h3>
                    <p className="text-slate-500 mt-1">Get started by creating a new group.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredGroups.map(group => (
                        <div key={group.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                            <div className="h-32 bg-slate-100 relative">
                                {group.image ? (
                                    <img src={group.image} alt={group.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <HiUserGroup className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 flex space-x-1">
                                    <button
                                        onClick={() => handleOpenModal(group)}
                                        className="p-1.5 bg-white bg-opacity-90 rounded-md text-blue-600 hover:text-blue-700 shadow-sm"
                                    >
                                        <HiPencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(group.id)}
                                        className="p-1.5 bg-white bg-opacity-90 rounded-md text-red-600 hover:text-red-700 shadow-sm"
                                    >
                                        <HiTrash className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-slate-900 mb-1">{group.title}</h3>
                                {group.leaderName && (
                                    <p className="text-sm text-blue-600 font-medium mb-3">Led by {group.leaderName}</p>
                                )}
                                <div className="text-xs text-slate-500 space-y-1 mb-4 flex-1">
                                    {group.meetingDays && <p>📅 {group.meetingDays}</p>}
                                    {group.venue && <p>📍 {group.venue}</p>}
                                    {group.description && <p className="line-clamp-2 mt-2 pt-2 border-t border-slate-100">{group.description}</p>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit/Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-slate-900">
                                {editingGroup ? 'Edit Group' : 'Create New Group'}
                            </h2>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                                <HiX className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Group Title <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title || ''}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Leader Name</label>
                                    <input
                                        type="text"
                                        value={formData.leaderName || ''}
                                        onChange={e => setFormData({ ...formData, leaderName: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Leader Phone</label>
                                    <input
                                        type="text"
                                        value={formData.leaderPhone || ''}
                                        onChange={e => setFormData({ ...formData, leaderPhone: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Leader Email</label>
                                    <input
                                        type="email"
                                        value={formData.leaderEmail || ''}
                                        onChange={e => setFormData({ ...formData, leaderEmail: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Meeting Details</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Fridays @ 7PM"
                                        value={formData.meetingDays || ''}
                                        onChange={e => setFormData({ ...formData, meetingDays: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Venue</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Zoom or Main Hall"
                                        value={formData.venue || ''}
                                        onChange={e => setFormData({ ...formData, venue: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                                    <input
                                        type="text"
                                        placeholder="https://..."
                                        value={formData.image || ''}
                                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                    <textarea
                                        rows={4}
                                        value={formData.description || ''}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-5 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition flex items-center"
                                >
                                    {saving ? 'Saving...' : (editingGroup ? 'Update Group' : 'Create Group')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupManager;
