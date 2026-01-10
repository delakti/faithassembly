import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { ref, get, set } from 'firebase/database';
import { FaUsers, FaMapMarkerAlt, FaClock, FaPlus, FaTimes, FaUserTie } from 'react-icons/fa';
import { database } from '../../firebase';

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

const Groups: React.FC = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [formData, setFormData] = useState({
        phone: '',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        setLoading(true);
        console.log("Groups.tsx: Fetching groups...");
        try {
            const db = database;
            const groupsRef = ref(db, 'churchGroups');
            const snapshot = await get(groupsRef);

            console.log("Groups.tsx: Snapshot exists?", snapshot.exists());
            if (snapshot.exists()) {
                const data = snapshot.val();
                console.log("Groups.tsx: Data:", data);

                const groupsList = Object.keys(data)
                    .map(key => ({
                        id: key,
                        ...data[key]
                    }))
                    // Filter out items that don't look like groups (MUST have a title)
                    .filter((g: any) => g && g.title && typeof g.title === 'string');

                console.log("Groups.tsx: Filtered List:", groupsList);

                // Sort by title alphabetically
                groupsList.sort((a, b) => a.title.localeCompare(b.title));
                setGroups(groupsList);
            } else {
                console.log("Groups.tsx: No data found.");
                setGroups([]);
            }
        } catch (error) {
            console.error("Error fetching groups:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinClick = (group: Group) => {
        setSelectedGroup(group);
        setShowModal(true);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !selectedGroup) return;

        setSubmitting(true);
        try {
            const db = database;
            // Path: groupJoinRequests / {groupId} / {userId}
            const requestRef = ref(db, `groupJoinRequests/${selectedGroup.id}/${user.uid}`);

            await set(requestRef, {
                userId: user.uid,
                userName: user.displayName || 'Anonymous',
                userEmail: user.email,
                userPhone: formData.phone,
                message: formData.message,
                groupName: selectedGroup.title,
                timestamp: new Date().toISOString(),
                status: 'pending'
            });

            alert(`Request to join ${selectedGroup.title} sent successfully! A leader will contact you soon.`);
            setShowModal(false);
            setFormData({ phone: '', message: '' });
        } catch (error) {
            console.error("Error creating join request:", error);
            alert("Failed to send request. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto relative">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <FaUsers className="mr-3 text-blue-600" /> Small Groups
                </h1>
                <p className="text-gray-600 mt-2">Connect with others, grow in faith, and do life together.</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map(group => (
                        <div key={group.id} className="rounded-xl shadow-sm border border-gray-200 bg-white overflow-hidden flex flex-col hover:shadow-md transition">
                            <div className="h-40 bg-gray-100 relative">
                                {group.image ? (
                                    <img src={group.image} alt={group.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-200">
                                        <FaUsers className="text-4xl" />
                                    </div>
                                )}
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{group.title}</h3>
                                {group.leaderName && (
                                    <div className="flex items-center text-sm text-blue-600 mb-3 font-medium">
                                        <FaUserTie className="mr-2" /> {group.leaderName}
                                    </div>
                                )}

                                <div className="text-sm text-gray-500 space-y-2 mb-4 flex-1">
                                    {group.meetingDays && (
                                        <div className="flex items-start">
                                            <FaClock className="mr-2 mt-0.5 text-gray-400 shrink-0" />
                                            <span>{group.meetingDays}</span>
                                        </div>
                                    )}
                                    {group.venue && (
                                        <div className="flex items-start">
                                            <FaMapMarkerAlt className="mr-2 mt-0.5 text-gray-400 shrink-0" />
                                            <span>{group.venue}</span>
                                        </div>
                                    )}
                                    {group.description && (
                                        <p className="line-clamp-3 text-gray-600 mt-2 text-xs leading-relaxed">
                                            {group.description}
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleJoinClick(group)}
                                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm font-bold transition flex items-center justify-center"
                                >
                                    <FaPlus className="mr-2" /> Join Group
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && groups.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <p className="text-gray-500">No active small groups found at the moment.</p>
                </div>
            )}

            {/* Interest Modal */}
            {showModal && selectedGroup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                        >
                            <FaTimes className="text-xl" />
                        </button>

                        <h3 className="text-xl font-bold text-gray-900 mb-1">Join {selectedGroup.title}</h3>
                        <p className="text-sm text-gray-500 mb-6">Complete the form below to express your interest.</p>

                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={user?.displayName || ''}
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="e.g. 07123 456789"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                                <textarea
                                    rows={3}
                                    placeholder="Any questions or specific availability?"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className={`w-full py-2 rounded-lg text-white font-bold transition flex items-center justify-center ${submitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                            >
                                {submitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Sending...
                                    </>
                                ) : (
                                    'Submit Request'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Groups;
