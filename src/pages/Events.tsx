import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaClock, FaCalendarAlt } from 'react-icons/fa';

interface EventData {
    date: string;
    description: string;
    endDate: string;
    endTime: string;
    id: string;
    image: string;
    location: string;
    startDate: string;
    startTime: string;
    text: string;
    time: string;
    title: string;
}

import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';

interface EventData {
    date: string;
    description: string;
    endDate: string;
    endTime: string;
    id: string;
    image: string;
    location: string;
    startDate: string;
    startTime: string;
    text: string;
    time: string;
    title: string;
}

const Events: React.FC = () => {
    const [events, setEvents] = React.useState<EventData[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [filter, setFilter] = React.useState('All');

    useEffect(() => {
        window.scrollTo(0, 0);

        const eventsRef = ref(database, 'Event');
        const unsubscribe = onValue(eventsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const now = new Date();
                // Set to midnight to include events happening today
                now.setHours(0, 0, 0, 0);

                const loadedEvents: EventData[] = Object.keys(data)
                    .map((key) => ({
                        ...data[key],
                        id: key,
                    }))
                    .filter(event => {
                        // Prioritize 'date' as per user screenshot which has correct future date
                        // Fallback to startDate, then just ensure validity
                        const dateStr = event.date || event.startDate;
                        if (!dateStr) return false;
                        const date = new Date(dateStr);

                        // Check validity
                        if (isNaN(date.getTime())) return false;

                        // Filter for upcoming events (future or today)
                        return date >= now;
                    })
                    .sort((a, b) => {
                        const dateA = new Date(a.date || a.startDate).getTime();
                        const dateB = new Date(b.date || b.startDate).getTime();
                        return dateA - dateB;
                    });

                setEvents(loadedEvents);
            } else {
                setEvents([]);
            }
            setLoading(false);
        });

        // Cleanup subscription
        return () => unsubscribe();
    }, []);

    // Helper to format date nicely
    const formatDate = (dateString: string) => {
        if (!dateString) return 'Date TBA';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;

        return date.toLocaleDateString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Helper to get effective date
    const getEventDate = (event: EventData) => new Date(event.date || event.startDate);

    // Get unique months for filter
    const months = React.useMemo(() => {
        const uniqueMonths = new Set(events.map(event => {
            return getEventDate(event).toLocaleString('default', { month: 'long', year: 'numeric' });
        }));
        return Array.from(uniqueMonths);
    }, [events]);

    // Filter events
    const filteredEvents = React.useMemo(() => {
        if (filter === 'All') return events;
        return events.filter(event => {
            return getEventDate(event).toLocaleString('default', { month: 'long', year: 'numeric' }) === filter;
        });
    }, [events, filter]);

    // Group events by month for "All" view
    const groupedEvents = React.useMemo(() => {
        if (filter !== 'All') return { [filter]: filteredEvents };

        const groups: { [key: string]: EventData[] } = {};
        filteredEvents.forEach(event => {
            const monthYear = getEventDate(event).toLocaleString('default', { month: 'long', year: 'numeric' });
            if (!groups[monthYear]) {
                groups[monthYear] = [];
            }
            groups[monthYear].push(event);
        });
        return groups;
    }, [filteredEvents, filter]);

    if (loading) {
        return (
            <div className="pt-24 px-4 max-w-7xl mx-auto min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    return (
        <div className="pt-24 px-4 max-w-7xl mx-auto min-h-screen pb-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Upcoming Events</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                    Stay connected and get involved. Here is what is happening at Faith Assembly.
                </p>

                {/* Filter Pills */}
                <div className="flex flex-wrap justify-center gap-3">
                    <button
                        onClick={() => setFilter('All')}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${filter === 'All'
                            ? 'bg-cyan-600 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        All Events
                    </button>
                    {months.map(month => (
                        <button
                            key={month}
                            onClick={() => setFilter(month)}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${filter === month
                                ? 'bg-cyan-600 text-white shadow-lg scale-105'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {month.split(' ')[0]} {/* Showing only Month name for brevity if needed, or keep full */}
                        </button>
                    ))}
                </div>
            </div>

            {events.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                    <p className="text-xl">No upcoming events found.</p>
                </div>
            ) : (
                <div className="space-y-16">
                    {Object.entries(groupedEvents).map(([month, monthEvents]) => (
                        <div key={month}>
                            {/* Month Header - Only show if we have events and potentially if "All" is selected, 
                                 but it looks good to always show headers to separate groups */}
                            <div className="sticky top-20 z-10 bg-white/95 backdrop-blur py-4 mb-6 border-b border-gray-100">
                                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                    <span className="w-2 h-8 bg-cyan-500 rounded-full inline-block"></span>
                                    {month}
                                </h3>
                            </div>

                            <div className="space-y-12">
                                {monthEvents.map((event) => (
                                    <div key={event.id} className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                                        {/* Image Section */}
                                        <div className="md:w-1/3 relative h-64 md:h-auto">
                                            <img
                                                src={event.image}
                                                alt={event.title}
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                            {/* Date Badge (Mobile) */}
                                            <div className="absolute top-4 left-4 md:hidden bg-white/95 backdrop-blur rounded-lg px-3 py-2 text-center shadow-lg">
                                                <span className="block text-xs font-bold text-gray-500 uppercase">{new Date(event.date || event.startDate).toLocaleString('default', { month: 'short' })}</span>
                                                <span className="block text-2xl font-bold text-cyan-600">{new Date(event.date || event.startDate).getDate()}</span>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="md:w-2/3 p-8 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3 font-medium uppercase tracking-wider">
                                                    <div className="flex items-center gap-1">
                                                        <FaCalendarAlt className="text-cyan-500" />
                                                        {formatDate(event.date || event.startDate)}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <FaClock className="text-cyan-500" />
                                                        {event.startTime} - {event.endTime}
                                                    </div>
                                                </div>

                                                <h2 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h2>

                                                <div className="flex items-center gap-2 text-gray-600 mb-6 bg-gray-50 p-3 rounded-lg w-fit">
                                                    <FaMapMarkerAlt className="text-cyan-600" />
                                                    <span className="font-semibold">{event.location}</span>
                                                </div>

                                                <p className="text-gray-600 leading-relaxed whitespace-pre-line mb-6 line-clamp-4">
                                                    {event.description}
                                                </p>
                                            </div>

                                            <Link
                                                to={`/events/${event.id}`}
                                                className="self-start px-8 py-3 bg-black text-white rounded-lg font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors"
                                            >
                                                Event Details
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Events;
