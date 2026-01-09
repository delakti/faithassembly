import React from 'react';
import { FaChild, FaCalendarCheck, FaBirthdayCake, FaUserPlus } from 'react-icons/fa';

const ChildrenDashboard: React.FC = () => {
    // Mock data for dashboard
    const stats = [
        { label: 'Total Children', value: '142', icon: <FaChild />, color: 'bg-blue-500' },
        { label: 'Checked In (Sun)', value: '85', icon: <FaCalendarCheck />, color: 'bg-green-500' },
        { label: 'New Registrations', value: '3', icon: <FaUserPlus />, color: 'bg-purple-500' },
        { label: 'Birthdays (May)', value: '7', icon: <FaBirthdayCake />, color: 'bg-pink-500' },
    ];

    const upcomingEvents = [
        { id: 1, title: 'Sunday School - Noah\'s Ark', date: 'Sunday, May 12', time: '10:00 AM' },
        { id: 2, title: 'Kids Movie Night', date: 'Friday, May 17', time: '06:00 PM' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome back, Service Leader</p>
                </div>
                <div className="text-sm text-gray-400 bg-white px-3 py-1 rounded-lg border shadow-sm">
                    {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upcoming Events */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
                    <div className="space-y-4">
                        {upcomingEvents.map(event => (
                            <div key={event.id} className="flex items-center p-4 rounded-xl bg-gray-50 hover:bg-sky-50 transition border border-gray-100 hover:border-sky-100">
                                <div className="bg-white w-16 h-16 rounded-lg flex flex-col items-center justify-center text-center shadow-sm border border-gray-200 mr-4">
                                    <span className="text-xs font-bold text-red-500 uppercase">{event.date.split(',')[0]}</span>
                                    <span className="text-xl font-bold text-gray-800">{event.date.split(' ')[2]}</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">{event.title}</h3>
                                    <p className="text-gray-500 text-sm">{event.time}</p>
                                </div>
                                <button className="ml-auto text-sky-600 font-medium hover:text-sky-800 text-sm">
                                    Details
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions / Recent Activity */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                    <div className="space-y-3">
                        <button className="w-full py-3 px-4 bg-sky-50 text-sky-700 rounded-xl font-semibold hover:bg-sky-100 text-left flex items-center transition">
                            <span className="bg-sky-200 p-2 rounded-lg mr-3"><FaUserPlus size={14} /></span>
                            Register New Child
                        </button>
                        <button className="w-full py-3 px-4 bg-purple-50 text-purple-700 rounded-xl font-semibold hover:bg-purple-100 text-left flex items-center transition">
                            <span className="bg-purple-200 p-2 rounded-lg mr-3"><FaCalendarCheck size={14} /></span>
                            Start Check-In
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChildrenDashboard;
