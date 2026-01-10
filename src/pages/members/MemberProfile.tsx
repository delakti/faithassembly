import React, { useEffect, useState } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import type { UserProfile } from '../../types/auth'; // Ensure path is correct
import { toast } from 'react-hot-toast';
import { FaUserCircle, FaSave, FaEdit } from 'react-icons/fa';

const MemberProfile: React.FC = () => {
    const auth = getAuth();
    const db = getFirestore();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [displayName, setDisplayName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!auth.currentUser) return;
            try {
                const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data() as UserProfile;
                    setProfile(userData);
                    setDisplayName(userData.displayName || '');
                } else {
                    setDisplayName(auth.currentUser.displayName || '');
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [auth.currentUser, db]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth.currentUser) return;
        setIsSaving(true);

        try {
            // Update Firestore
            await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                displayName: displayName
            });

            // Update Auth Profile (so sidebar updates immediately without refresh)
            await updateProfile(auth.currentUser, {
                displayName: displayName
            });

            setProfile(prev => prev ? { ...prev, displayName } : null);
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-8">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border-4 border-white shadow-lg">
                                {auth.currentUser?.photoURL ? (
                                    <img src={auth.currentUser.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <FaUserCircle className="text-8xl" />
                                )}
                            </div>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize">
                                {profile?.role?.replace('_', ' ') || 'Member'}
                            </span>
                        </div>

                        {/* Form Section */}
                        <form onSubmit={handleSave} className="flex-1 space-y-6 w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                                    <div className="relative rounded-md shadow-sm">
                                        <input
                                            type="text"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            className="block w-full pr-10 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3 border"
                                            placeholder="Your Name"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <FaEdit className="text-gray-400" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        value={auth.currentUser?.email || ''}
                                        disabled
                                        className="block w-full border-gray-300 rounded-lg bg-gray-50 text-gray-500 sm:text-sm p-3 border cursor-not-allowed"
                                    />
                                    <p className="mt-1 text-xs text-gray-400">Email cannot be changed</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                                    <input
                                        type="text"
                                        value={auth.currentUser?.metadata.creationTime ? new Date(auth.currentUser.metadata.creationTime).toLocaleDateString() : 'N/A'}
                                        disabled
                                        className="block w-full border-gray-300 rounded-lg bg-gray-50 text-gray-500 sm:text-sm p-3 border cursor-not-allowed"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Account ID</label>
                                    <input
                                        type="text"
                                        value={auth.currentUser?.uid || ''}
                                        disabled
                                        className="block w-full border-gray-300 rounded-lg bg-gray-50 text-gray-500 sm:text-sm p-3 border cursor-not-allowed font-mono"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="animate-spin -ml-1 mr-3 h-5 w-5 text-white">
                                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            </div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <FaSave className="-ml-1 mr-2 h-5 w-5" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberProfile;
