import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { FaUsers, FaMapMarkerAlt, FaClock, FaCheck, FaPlus } from 'react-icons/fa';

const Groups: React.FC = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const [groups, setGroups] = useState<any[]>([]);
    const [myGroupIds, setMyGroupIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            // Fetch all groups (assuming 'small_groups' collection)
            // If the user's groups are stored in their profile, we could fetch that too.
            // For now, we'll assume groups have a 'members' array we can check.
            const groupsSnap = await getDocs(collection(db, 'small_groups'));
            const groupsList = groupsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
            setGroups(groupsList);

            // Determine which groups the user is in
            if (user) {
                const myGroups = groupsList.filter((g: any) => g.members?.includes(user.uid)).map((g: any) => g.id);
                setMyGroupIds(myGroups);
            }
        } catch (error) {
            console.error("Error fetching groups:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async (groupId: string) => {
        if (!user) return;
        try {
            const groupRef = doc(db, 'small_groups', groupId);
            await updateDoc(groupRef, {
                members: arrayUnion(user.uid)
            });
            setMyGroupIds(prev => [...prev, groupId]);
            // Also update user profile? Optional but good for redundancy.
            await updateDoc(doc(db, 'users', user.uid), {
                groups: arrayUnion(groupId)
            });
        } catch (error) {
            console.error("Error joining group:", error);
            alert("Failed to join group.");
        }
    };

    const handleLeave = async (groupId: string) => {
        if (!user) return;
        if (!window.confirm("Are you sure you want to leave this group?")) return;
        try {
            const groupRef = doc(db, 'small_groups', groupId);
            await updateDoc(groupRef, {
                members: arrayRemove(user.uid)
            });
            setMyGroupIds(prev => prev.filter(id => id !== groupId));
            await updateDoc(doc(db, 'users', user.uid), {
                groups: arrayRemove(groupId)
            });
        } catch (error) {
            console.error("Error leaving group:", error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <FaUsers className="mr-3 text-blue-600" /> Small Groups
                </h1>
                <p className="text-gray-600 mt-2">Connect with others, grow in faith, and do life together.</p>
            </div>

            {loading ? <p className="text-center py-12 text-gray-400">Loading directory...</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map(group => {
                        const isMember = myGroupIds.includes(group.id);
                        return (
                            <div key={group.id} className={`rounded-xl shadow-sm border ${isMember ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'} bg-white overflow-hidden flex flex-col`}>
                                <div className="h-32 bg-gray-100 relative">
                                    {group.image && <img src={group.image} alt={group.name} className="w-full h-full object-cover" />}
                                    {isMember && (
                                        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center shadow">
                                            <FaCheck className="mr-1" /> MEMBER
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{group.name}</h3>
                                    <div className="text-sm text-gray-500 space-y-2 mb-4 flex-1">
                                        <div className="flex items-center"><FaClock className="mr-2" /> {group.meetingTime || 'TBA'}</div>
                                        <div className="flex items-center"><FaMapMarkerAlt className="mr-2" /> {group.location || 'Online'}</div>
                                        <p className="line-clamp-2">{group.description}</p>
                                    </div>

                                    {isMember ? (
                                        <button
                                            onClick={() => handleLeave(group.id)}
                                            className="w-full border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium transition"
                                        >
                                            Leave Group
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleJoin(group.id)}
                                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm font-bold transition flex items-center justify-center"
                                        >
                                            <FaPlus className="mr-2" /> Join Group
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {!loading && groups.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <p className="text-gray-500">No active small groups found at the moment.</p>
                </div>
            )}
        </div>
    );
};

export default Groups;
