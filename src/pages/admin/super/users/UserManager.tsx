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
    const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
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
            toast.success("User role updated");
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
            user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Toolbar */}
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="relative w-full md:w-96">
                    <HiSearch className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto">
                    <HiFilter className="text-gray-400" />
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
                        className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-red-500"
                    >
                        <option value="all">All Roles</option>
                        <option value="super_admin">Super Admin</option>
                        <option value="admin">Admin</option>
                        <option value="finance">Finance</option>
                        <option value="children_staff">Children's Staff</option>
                        <option value="volunteer">Volunteer</option>
                        <option value="member">Member</option>
                        <option value="user">User (Pending)</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Current Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={4} className="text-center py-8">Loading users...</td></tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr><td colSpan={4} className="text-center py-8">No users found</td></tr>
                        ) : filteredUsers.map(user => (
                            <tr key={user.uid} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center mr-3 text-slate-500 overflow-hidden">
                                            {user.photoURL ? <img src={user.photoURL} className="w-full h-full object-cover" /> : <HiUserCircle className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{user.displayName || 'Unknown User'}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {editingUser?.uid === user.uid ? (
                                        <select
                                            value={editingUser?.role || user.role}
                                            onChange={(e) => handleRoleUpdate(user.uid, e.target.value as UserRole)}
                                            className="text-sm border rounded px-2 py-1"
                                            autoFocus
                                            onBlur={() => setEditingUser(null)}
                                        >
                                            <option value="super_admin">Super Admin</option>
                                            <option value="admin">Admin</option>
                                            <option value="finance">Finance</option>
                                            <option value="children_staff">Children Staff</option>
                                            <option value="volunteer">Volunteer</option>
                                            <option value="member">Member</option>
                                            <option value="user">User</option>
                                        </select>
                                    ) : (
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                            ${user.role === 'super_admin' ? 'bg-red-100 text-red-800' :
                                                user.role === 'admin' ? 'bg-orange-100 text-orange-800' :
                                                    user.role === 'finance' ? 'bg-green-100 text-green-800' :
                                                        user.role === 'volunteer' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-gray-100 text-gray-800'}`}>
                                            {user.role}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-green-600 flex items-center text-sm font-medium">
                                        <HiCheckCircle className="w-4 h-4 mr-1" /> Active
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        onClick={() => setEditingUser(user)}
                                        className="text-gray-400 hover:text-blue-600 transition-colors"
                                        title="Edit Role"
                                    >
                                        <HiPencilAlt className="w-5 h-5" />
                                    </button>
                                    <button
                                        className="text-gray-400 hover:text-red-600 transition-colors"
                                        title="Suspend User"
                                        onClick={() => toast("Suspend feature coming soon")}
                                    >
                                        <HiBan className="w-5 h-5" />
                                    </button>
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
