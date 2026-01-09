import React from 'react';
import { getAuth } from 'firebase/auth';
import { FaHandHoldingHeart, FaCalendarAlt, FaStar, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const MemberDashboard: React.FC = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    return (
        <div className="max-w-7xl mx-auto">
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
                    <div className="flex flex-col items-center justify-center h-48 bg-gray-50 rounded-lg text-center p-6">
                        <p className="text-gray-500 mb-4">You haven't joined a small group yet.</p>
                        <Link to="/members/groups" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                            Find a Group
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberDashboard;
