import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, getDocs, orderBy, where, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { HiUsers, HiPlus, HiTrash } from 'react-icons/hi';
import type { EstherGroup, GroupMember } from '../../types/esther';

const EstherGroupManager: React.FC = () => {
    const [groups, setGroups] = useState<EstherGroup[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<EstherGroup | null>(null);
    const [members, setMembers] = useState<GroupMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMembers, setLoadingMembers] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // New Group Form State
    const [newGroup, setNewGroup] = useState({
        name: '',
        leader: '',
        schedule: '',
        desc: '',
        image: ''
    });

    useEffect(() => {
        fetchGroups();
    }, []);

    useEffect(() => {
        if (selectedGroup?.id) {
            fetchMembers(selectedGroup.id);
        } else {
            setMembers([]);
        }
    }, [selectedGroup]);

    const fetchGroups = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'esther_groups'), orderBy('name', 'asc'));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EstherGroup));
            setGroups(data);
        } catch (error) {
            console.error("Error fetching groups:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMembers = async (groupId: string) => {
        setLoadingMembers(true);
        try {
            const q = query(collection(db, 'esther_group_members'), where('groupId', '==', groupId));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GroupMember));
            setMembers(data);
        } catch (error) {
            console.error("Error fetching members:", error);
        } finally {
            setLoadingMembers(false);
        }
    };

    const handleCreateGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'esther_groups'), {
                ...newGroup,
                createdAt: serverTimestamp()
            });
            setShowCreateModal(false);
            setNewGroup({ name: '', leader: '', schedule: '', desc: '', image: '' });
            fetchGroups();
        } catch (error) {
            console.error("Error creating group:", error);
        }
    };

    const handleDeleteGroup = async (id: string) => {
        if (!window.confirm("Are you sure? This will assume you have migrated members elsewhere.")) return;
        try {
            await deleteDoc(doc(db, 'esther_groups', id));
            if (selectedGroup?.id === id) setSelectedGroup(null);
            fetchGroups();
        } catch (error) {
            console.error("Error deleting group:", error);
        }
    };

    return (
        <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
            {/* Group List */}
            <div className="lg:col-span-1 bg-white rounded-2xl border border-rose-100 shadow-sm flex flex-col overflow-hidden">
                <div className="p-4 border-b border-rose-50 flex justify-between items-center bg-rose-50/30">
                    <h2 className="font-bold text-rose-950">Small Groups</h2>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                    >
                        <HiPlus className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {loading ? (
                        <p className="text-center text-gray-400 text-sm">Loading groups...</p>
                    ) : groups.length === 0 ? (
                        <p className="text-center text-gray-400 text-sm">No groups found.</p>
                    ) : (
                        groups.map(group => (
                            <div
                                key={group.id}
                                onClick={() => setSelectedGroup(group)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedGroup?.id === group.id
                                    ? 'border-rose-500 bg-rose-50'
                                    : 'border-gray-100 hover:border-rose-200 hover:bg-gray-50'}`}
                            >
                                <h3 className={`font-bold ${selectedGroup?.id === group.id ? 'text-rose-700' : 'text-gray-800'}`}>{group.name}</h3>
                                <p className="text-xs text-gray-500 mt-1">{group.schedule}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Member List / Details */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-rose-100 shadow-sm flex flex-col overflow-hidden">
                {selectedGroup ? (
                    <>
                        <div className="p-6 border-b border-rose-50 bg-rose-50/10 flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-serif text-rose-950 mb-1">{selectedGroup.name}</h2>
                                <p className="text-gray-500 text-sm">Lead: <span className="font-bold text-rose-600">{selectedGroup.leader}</span></p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <span className="block text-2xl font-bold text-rose-600">{members.length}</span>
                                    <span className="text-xs uppercase tracking-wider text-gray-400">Members</span>
                                </div>
                                <button
                                    onClick={() => handleDeleteGroup(selectedGroup.id!)}
                                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                    title="Delete Group"
                                >
                                    <HiTrash className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                                <HiUsers className="mr-2 text-rose-500" /> Member Roster
                            </h3>

                            {loadingMembers ? (
                                <p className="text-gray-400">Loading members...</p>
                            ) : members.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <p className="text-gray-500">No members have joined this group yet.</p>
                                </div>
                            ) : (
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {members.map(member => (
                                        <div key={member.id} className="flex items-center p-3 rounded-lg border border-gray-100 hover:border-rose-100 hover:shadow-sm transition-all">
                                            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold mr-3">
                                                {member.userName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">{member.userName}</p>
                                                <p className="text-xs text-gray-400">Joined: {member.joinedAt?.toDate().toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-400">
                        <HiUsers className="w-16 h-16 mb-4 text-gray-200" />
                        <p>Select a group to manage members and view details.</p>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
                        <h2 className="text-xl font-bold mb-4">Create New Group</h2>
                        <form onSubmit={handleCreateGroup} className="space-y-4">
                            <input
                                required placeholder="Group Name"
                                value={newGroup.name} onChange={e => setNewGroup({ ...newGroup, name: e.target.value })}
                                className="w-full p-3 border rounded-xl"
                            />
                            <input
                                required placeholder="Leader Name"
                                value={newGroup.leader} onChange={e => setNewGroup({ ...newGroup, leader: e.target.value })}
                                className="w-full p-3 border rounded-xl"
                            />
                            <input
                                required placeholder="Schedule (e.g. Fridays @ 7PM)"
                                value={newGroup.schedule} onChange={e => setNewGroup({ ...newGroup, schedule: e.target.value })}
                                className="w-full p-3 border rounded-xl"
                            />
                            <textarea
                                required placeholder="Description"
                                value={newGroup.desc} onChange={e => setNewGroup({ ...newGroup, desc: e.target.value })}
                                className="w-full p-3 border rounded-xl h-24"
                            />
                            <input
                                placeholder="Image URL (Optional)"
                                value={newGroup.image} onChange={e => setNewGroup({ ...newGroup, image: e.target.value })}
                                className="w-full p-3 border rounded-xl"
                            />
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-50 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-rose-500 text-white font-bold rounded-lg hover:bg-rose-600">Create Group</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EstherGroupManager;
