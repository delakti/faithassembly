import React, { useState, useEffect } from 'react';
import { FaChild, FaCalendarCheck, FaBirthdayCake, FaUserPlus, FaCalendarPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, query, getDocs, orderBy, limit, where } from 'firebase/firestore';
import type { Event } from '../../types/children';

const ChildrenDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState<Event[]>([]);
    const [stats, setStats] = useState({
        totalChildren: 0,
        checkedIn: 0,
        newRegistrations: 0,
        birthdays: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 1. Fetch Upcoming Events
                const eventsQuery = query(
                    collection(db, 'children_events'),
                    where('date', '>=', new Date().toISOString().split('T')[0]),
                    orderBy('date', 'asc'),
                    limit(3)
                );
                const eventsSnap = await getDocs(eventsQuery);
                const eventsData = eventsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
                setEvents(eventsData);

                // 2. Fetch Stats (Simplified for performance)
                // Total Children
                const kidsSnap = await getDocs(collection(db, 'children'));
                const totalKids = kidsSnap.size;

                // For verified check-ins, we'd query the attendance collection for today
                // For now, we'll keep these other stats as placeholders or simplified estimates
                // to avoid overly complex queries in this dashboard view for now.

                setStats({
                    totalChildren: totalKids,
                    checkedIn: 0, // Would need dynamic query
                    newRegistrations: 0, // Would need date query
                    birthdays: 0 // Would need complex date matching
                });

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            weekday: date.toLocaleDateString('en-GB', { weekday: 'long' }),
            day: date.getDate(),
            month: date.toLocaleDateString('en-GB', { month: 'short' }),
            full: date.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        };
    };

    const statCards = [
        { label: 'Total Children', value: stats.totalChildren.toString(), icon: <FaChild />, color: 'bg-blue-500' },
        { label: 'Checked In (Today)', value: '-', icon: <FaCalendarCheck />, color: 'bg-green-500' }, // Placeholder until attendance wired fully
        { label: 'New Registrations', value: '-', icon: <FaUserPlus />, color: 'bg-purple-500' },
        { label: 'Upcoming Birthdays', value: '-', icon: <FaBirthdayCake />, color: 'bg-pink-500' },
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
                {statCards.map((stat, index) => (
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
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
                        <button onClick={() => navigate('/children/events')} className="text-indigo-600 text-sm font-bold hover:underline">View All</button>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <p className="text-gray-400 text-center py-4">Loading events...</p>
                        ) : events.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-xl">
                                <p className="text-gray-500">No upcoming events scheduled.</p>
                                <button onClick={() => navigate('/children/events')} className="mt-2 text-indigo-600 font-bold text-sm">Schedule One</button>
                            </div>
                        ) : (
                            events.map(event => {
                                const dateInfo = formatDate(event.date);
                                return (
                                    <div key={event.id} className="flex items-center p-4 rounded-xl bg-gray-50 hover:bg-sky-50 transition border border-gray-100 hover:border-sky-100 group cursor-pointer" onClick={() => navigate('/children/events')}>
                                        <div className="bg-white w-16 h-16 rounded-lg flex flex-col items-center justify-center text-center shadow-sm border border-gray-200 mr-4 group-hover:border-sky-200 transition">
                                            <span className="text-xs font-bold text-red-500 uppercase">{dateInfo.month}</span>
                                            <span className="text-xl font-bold text-gray-800">{dateInfo.day}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg group-hover:text-sky-700 transition">{event.title}</h3>
                                            <p className="text-gray-500 text-sm">{event.time} • {event.location || 'Church Hall'}</p>
                                        </div>
                                        <button className="ml-auto text-gray-400 font-medium group-hover:text-sky-600 text-sm transition">
                                            Details
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Quick Actions / Recent Activity */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/children/register')}
                            className="w-full py-4 px-4 bg-sky-50 text-sky-700 rounded-xl font-bold hover:bg-sky-100 text-left flex items-center transition"
                        >
                            <span className="bg-sky-200 p-2 rounded-lg mr-3"><FaUserPlus size={16} /></span>
                            Register New Child
                        </button>
                        <button
                            onClick={() => navigate('/children/attendance')}
                            className="w-full py-4 px-4 bg-purple-50 text-purple-700 rounded-xl font-bold hover:bg-purple-100 text-left flex items-center transition"
                        >
                            <span className="bg-purple-200 p-2 rounded-lg mr-3"><FaCalendarCheck size={16} /></span>
                            Start Check-In
                        </button>
                        <button
                            onClick={() => navigate('/children/events')}
                            className="w-full py-4 px-4 bg-orange-50 text-orange-700 rounded-xl font-bold hover:bg-orange-100 text-left flex items-center transition"
                        >
                            <span className="bg-orange-200 p-2 rounded-lg mr-3"><FaCalendarPlus size={16} /></span>
                            Add New Event
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChildrenDashboard;
