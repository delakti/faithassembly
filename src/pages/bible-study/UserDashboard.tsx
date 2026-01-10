import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import type { StudyGuide } from '../../types/bibleStudy';
import StudyGuideCard from '../../components/bible-study/StudyGuideCard';
import { FaBookmark, FaChartLine } from 'react-icons/fa';

const UserDashboard: React.FC = () => {
    const [bookmarkedGuides, setBookmarkedGuides] = useState<StudyGuide[]>([]);
    const [loading, setLoading] = useState(true);
    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                // In a real app, we'd query a 'userProgress' collection
                // For this demo, we'll simulate fetching bookmarked items
                // You would typically have a collection: userProgress/{userId}/guides/{guideId}

                // Placeholder: Fetch a few random guides to simulate "bookmarked"
                const q = query(collection(db, 'studyGuides'), where('visibility', '==', 'public'));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StudyGuide));

                setBookmarkedGuides(data.slice(0, 2)); // Mock data
            } catch (error) {
                console.error("Error fetching user dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Log In</h2>
                    <p className="text-gray-500">You need to be signed in to view your dashboard.</p>
                </div>
            </div>
        );
    }

    if (loading) return <div>Loading dashboard...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 pt-24">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Study Dashboard</h1>
                    <p className="text-gray-500">Welcome back, {user.displayName || 'Member'}</p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                        <div className="p-4 bg-purple-100 rounded-full text-purple-600 mr-4">
                            <FaBookmark />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Saved Guides</p>
                            <p className="text-2xl font-bold text-gray-900">{bookmarkedGuides.length}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                        <div className="p-4 bg-green-100 rounded-full text-green-600 mr-4">
                            <FaChartLine />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Completed</p>
                            <p className="text-2xl font-bold text-gray-900">0</p>
                        </div>
                    </div>
                </div>

                {/* Bookmarked Section */}
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <FaBookmark className="mr-2 text-purple-600" /> Saved For Later
                </h2>

                {bookmarkedGuides.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {bookmarkedGuides.map(guide => (
                            <StudyGuideCard key={guide.id} guide={guide} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-12 text-center rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500">You haven't saved any guides yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
