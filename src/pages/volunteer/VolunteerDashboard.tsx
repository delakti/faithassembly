import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { FaClock, FaCheckCircle, FaStar, FaCalendarDay } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const VolunteerDashboard: React.FC = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning');
        else if (hour < 18) setGreeting('Good afternoon');
        else setGreeting('Good evening');
    }, []);

    // Mock Data for Phase 1 Demo
    const nextShift = {
        title: "Sunday Service Greeting",
        date: "Sunday, Oct 29",
        time: "9:00 AM - 11:30 AM",
        role: "Welcome Team"
    };

    const stats = [
        { label: "Hours Logged", value: "24.5", icon: <FaClock className="text-blue-500" /> },
        { label: "Tasks Completed", value: "12", icon: <FaCheckCircle className="text-green-500" /> },
        { label: "Badges Earned", value: "3", icon: <FaStar className="text-yellow-500" /> },
    ];

    return (
        <div className="space-y-8">
            {/* Wellness Check / Greeting */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 text-white shadow-lg">
                <h1 className="text-3xl font-bold mb-2">{greeting}, {user?.displayName?.split(' ')[0] || 'Volunteer'}!</h1>
                <p className="text-orange-100 text-lg max-w-2xl">
                    "Serve wholeheartedly, as if you were serving the Lord, not people." — Ephesians 6:7
                </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                        <div className="p-3 bg-gray-50 rounded-full text-2xl">
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Next Shift Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Next Shift</h2>
                        <Link to="/volunteer/schedule" className="text-sm text-orange-600 font-semibold hover:underline">View Calendar</Link>
                    </div>

                    <div className="bg-orange-50 rounded-xl p-5 border border-orange-100">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 mt-1">
                                <FaCalendarDay className="text-orange-500 text-xl" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-bold text-gray-900">{nextShift.title}</h3>
                                <p className="text-orange-700 font-medium">{nextShift.date} • {nextShift.time}</p>
                                <span className="inline-block mt-2 px-2 py-1 bg-orange-200 text-orange-800 text-xs font-bold rounded uppercase">
                                    {nextShift.role}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <button className="w-full py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition">
                            Check In Available (Oct 29)
                        </button>
                    </div>
                </div>

                {/* Announcements / Updates */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Updates</h2>
                        <Link to="/volunteer/messages" className="text-sm text-orange-600 font-semibold hover:underline">View All</Link>
                    </div>

                    <div className="space-y-4">
                        <div className="pb-4 border-b border-gray-100 last:border-0">
                            <span className="text-xs font-bold text-gray-400">Oct 24, 2025</span>
                            <h4 className="text-md font-bold text-gray-800 mt-1">Christmas Service Prep</h4>
                            <p className="text-sm text-gray-600 mt-1">
                                All hands currently needed for the upcoming Christmas decor setup next Tuesday evening. Pizza provided!
                            </p>
                        </div>
                        <div className="pb-4 border-b border-gray-100 last:border-0">
                            <span className="text-xs font-bold text-gray-400">Oct 20, 2025</span>
                            <h4 className="text-md font-bold text-gray-800 mt-1">New Safety Guidelines</h4>
                            <p className="text-sm text-gray-600 mt-1">
                                Please review the updated safety protocols for Kids Church in the Resources tab.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VolunteerDashboard;
