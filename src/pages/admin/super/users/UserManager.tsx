import React, { useState, useEffect } from 'react';
import {
    getFirestore,
    collection,
    query,
    getDocs,
    doc,
    updateDoc,
    limit,
    orderBy
} from 'firebase/firestore';
import { HiSearch, HiFilter, HiUserCircle, HiPencilAlt, HiBan, HiCheckCircle } from 'react-icons/hi';
import type { UserProfile, UserRole } from '../../../../types/auth';
import { toast } from 'react-hot-toast';

const UserManager: React.FC = () => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
    const db = getFirestore();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Basic query - in production would need algolia or advanced firestore logic for deeper search
            const usersRef = collection(db, 'users');
            const q = query(usersRef, orderBy('createdAt', 'desc'), limit(50));

            const snapshot = await getDocs(q);
            const userBox: UserProfile[] = [];
            snapshot.forEach(doc => {
                userBox.push({ uid: doc.id, ...doc.data() } as UserProfile);
            });
            setUsers(userBox);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Function to handle role update
    const handleRoleUpdate = async (uid: string, newRole: UserRole) => {
        try {
            await updateDoc(doc(db, 'users', uid), {
                role: newRole
            });
            toast.success(`Role updated to: ${newRole}`);
            // Optimistic update
            setUsers(users.map(u => u.uid === uid ? { ...u, role: newRole } : u));
            setEditingUser(null);
        } catch (error) {
            toast.error("Failed to update role");
        }
    };

    // Filter Logic
    const filteredUsers = users.filter(user => {
        const matchesSearch =
            (user.displayName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());

        let matchesRole = true;
        if (roleFilter !== 'all') {
            // Handle grouping of roles if needed, currently exact match
            matchesRole = user.role === roleFilter;
        }

        return matchesSearch && matchesRole;
    });

    const getRoleBadgeColor = (role: string) => {
        if (role === 'super_admin') return 'bg-red-100 text-red-800 border-red-200';
        if (role === 'admin') return 'bg-orange-100 text-orange-800 border-orange-200';
        if (role.includes('leader')) return 'bg-purple-100 text-purple-800 border-purple-200';
        if (role.includes('member')) return 'bg-blue-100 text-blue-800 border-blue-200';
        return 'bg-slate-100 text-slate-800 border-slate-200';
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden font-sans text-slate-900">
            {/* Toolbar */}
            <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 bg-slate-50/50">
                <div className="relative w-full md:w-96">
                    <HiSearch className="absolute left-3 top-3.5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white"
                    />
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto">
                    <HiFilter className="text-slate-400" />
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-3 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium text-slate-700"
                    >
                        <option value="all">All Roles</option>
                        <optgroup label="System">
                            <option value="super_admin">Super Admin</option>
                            <option value="admin">Admin</option>
                            <option value="finance">Finance</option>
                        </optgroup>
                        <optgroup label="Ministry Leaders">
                            <option value="evangelism_leader">Evangelism Leader</option>
                            <option value="usher_leader">Usher Leader</option>
                            <option value="hospitality_leader">Hospitality Leader</option>
                            <option value="worship_leader">Worship Leader</option>
                            <option value="media_leader">Media Leader</option>
                            <option value="prayer_leader">Prayer Leader</option>
                        </optgroup>
                        <optgroup label="General">
                            <option value="volunteer">Volunteer</option>
                            <option value="member">Member</option>
                            <option value="user">User (Pending)</option>
                        </optgroup>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                        <tr>
                            <th className="px-6 py-4">User Identity</th>
                            <th className="px-6 py-4">Assigned Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Managemnt</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan={4} className="text-center py-12 text-slate-500">Loading directory...</td></tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr><td colSpan={4} className="text-center py-12 text-slate-500">No users found matching filters</td></tr>
                        ) : filteredUsers.map(user => (
                            <tr key={user.uid} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center mr-3 text-slate-400 overflow-hidden ring-2 ring-white shadow-sm">
                                            {user.photoURL ? <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" /> : <HiUserCircle className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{user.displayName || 'Unknown User'}</p>
                                            <p className="text-xs text-slate-500 font-medium">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {editingUser?.uid === user.uid ? (
                                        <div className="relative">
                                            <select
                                                value={editingUser?.role || user.role}
                                                onChange={(e) => handleRoleUpdate(user.uid, e.target.value as UserRole)}
                                                className="text-sm border-2 border-amber-500 rounded-lg px-3 py-2 bg-white shadow-lg w-full outline-none"
                                                autoFocus
                                                onBlur={() => setEditingUser(null)}
                                            >
                                                <optgroup label="System">
                                                    <option value="super_admin">Super Admin</option>
                                                    <option value="admin">Admin</option>
                                                </optgroup>
                                                <optgroup label="Ministry Leaders">
                                                    <option value="evangelism_leader">Evangelism Leader</option>
                                                    <option value="usher_leader">Usher Leader</option>
                                                    <option value="hospitality_leader">Hospitality Leader</option>
                                                    <option value="worship_leader">Worship Leader</option>
                                                    <option value="media_leader">Media Leader</option>
                                                    <option value="prayer_leader">Prayer Leader</option>
                                                </optgroup>
                                                <optgroup label="Members">
                                                    <option value="usher_member">Usher Member</option>
                                                    <option value="evangelism_member">Evangelism Member</option>
                                                    <option value="member">General Member</option>
                                                    <option value="user">User</option>
                                                </optgroup>
                                            </select>
                                            <div className="text-[10px] text-amber-600 mt-1 font-bold">Press selection to save</div>
                                        </div>
                                    ) : (
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getRoleBadgeColor(user.role)}`}>
                                            {user.role?.replace(/_/g, ' ')}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-green-600 bg-green-50 border border-green-100 px-2 py-1 rounded text-xs font-bold flex w-fit items-center gap-1">
                                        <HiCheckCircle className="w-3 h-3" /> Active
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => setEditingUser(user)}
                                            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                            title="Edit Role"
                                        >
                                            <HiPencilAlt className="w-5 h-5" />
                                        </button>
                                        <button
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Suspend User"
                                            onClick={() => toast("Suspend feature restricted")}
                                        >
                                            <HiBan className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManager;
