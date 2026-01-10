import React from 'react';
import { getAuth } from 'firebase/auth';
import { FaHandHoldingHeart, FaCalendarAlt, FaStar, FaArrowRight, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { database } from '../../firebase';

const MemberDashboard: React.FC = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const [myGroup, setMyGroup] = React.useState<{
        name: string;
        leaders: string;
        details?: any;
    } | null>(null);
    const [loadingGroup, setLoadingGroup] = React.useState(true);
    const [showModal, setShowModal] = React.useState(false);

    React.useEffect(() => {
        const fetchMyGroup = async () => {
            if (!user?.email) return;

            try {
                const db = database;

                // 1. Fetch Donor to get HouseFellowship name
                // Note: 'donor' query might also need index on 'Email'
                const donorRef = ref(db, 'donor');
                const donorQ = query(donorRef, orderByChild('Email'), equalTo(user.email));
                const donorSnapshot = await get(donorQ);

                if (donorSnapshot.exists()) {
                    const donorVal = donorSnapshot.val();
                    const donorKey = Object.keys(donorVal)[0];
                    const donorData = donorVal[donorKey];

                    if (donorData.HouseFellowship) {
                        const houseFellowshipName = donorData.HouseFellowship;
                        // Set basic info IMMEDIATELY so UI shows something
                        const basicGroupInfo = {
                            name: houseFellowshipName,
                            leaders: donorData.HouseFellowshipLeaders || 'Contact Admin',
                            details: null
                        };
                        setMyGroup(basicGroupInfo);

                        try {
                            // 2. Fetch ALL churchGroups and find match client-side to avoid Index error
                            const groupsRef = ref(db, 'churchGroups');
                            const groupsSnapshot = await get(groupsRef);

                            if (groupsSnapshot.exists()) {
                                const groupsVal = groupsSnapshot.val();
                                // Manual find to avoid .indexOn error
                                // Safe navigation .? used to avoid processing invalid entries
                                const groupKey = Object.keys(groupsVal).find(key =>
                                    groupsVal[key]?.title === houseFellowshipName
                                );

                                if (groupKey) {
                                    const groupDetails = groupsVal[groupKey];
                                    setMyGroup(prev => prev ? ({ ...prev, details: groupDetails }) : null);
                                }
                            }
                        } catch (detailErr) {
                            console.warn("Could not fetch extra group details:", detailErr);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching group:", error);
            } finally {
                setLoadingGroup(false);
            }
        };

        fetchMyGroup();
    }, [user]);

    return (
        <div className="max-w-7xl mx-auto relative">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-lg mb-8">
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.displayName?.split(' ')[0] || 'Member'}!</h1>
                <p className="text-blue-100 max-w-2xl">
                    We're glad to see you. Here is your personal overview of what's happening at Faith Assembly.
                </p>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 text-xl">
                        <FaHandHoldingHeart />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Give Online</h3>
                    <p className="text-sm text-gray-500 mb-4">Support the ministry with your tithes and offerings.</p>
                    <Link to="/members/giving" className="text-blue-600 font-medium hover:text-blue-700 flex items-center text-sm">
                        Give Now <FaArrowRight className="ml-2 text-xs" />
                    </Link>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4 text-xl">
                        <FaCalendarAlt />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Upcoming Events</h3>
                    <p className="text-sm text-gray-500 mb-4">See what's happening this week at church.</p>
                    <Link to="/events" className="text-blue-600 font-medium hover:text-blue-700 flex items-center text-sm">
                        View Calendar <FaArrowRight className="ml-2 text-xs" />
                    </Link>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4 text-xl">
                        <FaStar />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Prayer Request</h3>
                    <p className="text-sm text-gray-500 mb-4">Let our pastoral team stand in agreement with you.</p>
                    <Link to="/members/prayer" className="text-blue-600 font-medium hover:text-blue-700 flex items-center text-sm">
                        Submit Request <FaArrowRight className="ml-2 text-xs" />
                    </Link>
                </div>
            </div>

            {/* Recent Activity / News Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Latest Announcements</h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">General</span>
                            <h3 className="font-bold text-gray-800 mt-1">Mid-Week Service Resumes</h3>
                            <p className="text-sm text-gray-600 mt-1">Join us this Wednesday at 7PM for our Bible Study series.</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <span className="text-xs font-bold text-green-600 uppercase tracking-wide">Groups</span>
                            <h3 className="font-bold text-gray-800 mt-1">New Small Groups Launching</h3>
                            <p className="text-sm text-gray-600 mt-1">Sign up for the Fall semester groups starting next week.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">My Group</h2>
                    {loadingGroup ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : myGroup ? ( // Show Group Details
                        <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                            <h3 className="text-xl font-bold text-blue-900 mb-2">{myGroup.name}</h3>
                            <p className="text-blue-700 text-sm mb-4">
                                <strong>Leaders:</strong> {myGroup.leaders}
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
                                >
                                    View Details
                                </button>
                                {myGroup.details?.leaderEmail && (
                                    <a
                                        href={`mailto:${myGroup.details.leaderEmail}`}
                                        className="px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-md text-sm font-medium hover:bg-blue-50 transition"
                                    >
                                        Contact Leader
                                    </a>
                                )}
                            </div>
                        </div>
                    ) : ( // Show Empty State
                        <div className="flex flex-col items-center justify-center h-48 bg-gray-50 rounded-lg text-center p-6">
                            <p className="text-gray-500 mb-4">You haven't joined a small group yet.</p>
                            <Link to="/members/groups" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                Find a Group
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* View Details Modal */}
            {showModal && myGroup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                        >
                            <FaTimes className="text-xl" />
                        </button>

                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{myGroup.name}</h3>
                        <p className="text-blue-600 font-medium mb-6">Led by {myGroup.leaders}</p>

                        <div className="space-y-6">
                            {myGroup.details?.description && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 tracking-wide">Description</h4>
                                    <p className="text-gray-700 leading-relaxed">{myGroup.details.description}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                {myGroup.details?.meetingDays && (
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-1 tracking-wide">Meeting Time</h4>
                                        <p className="text-gray-800 font-medium flex items-center">
                                            <FaCalendarAlt className="mr-2 text-blue-500" />
                                            {myGroup.details.meetingDays}
                                        </p>
                                    </div>
                                )}

                                {myGroup.details?.venue && (
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-1 tracking-wide">Venue</h4>
                                        <p className="text-gray-800 font-medium flex items-center">
                                            {myGroup.details.venue}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition"
                            >
                                Close
                            </button>
                            {myGroup.details?.leaderEmail && (
                                <a
                                    href={`mailto:${myGroup.details.leaderEmail}`}
                                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
                                >
                                    Email Leader
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MemberDashboard;
