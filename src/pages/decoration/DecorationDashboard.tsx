import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { HiSparkles, HiCalendar, HiSpeakerphone, HiColorSwatch } from 'react-icons/hi';
import { format } from 'date-fns';

const DecorationDashboard: React.FC = () => {
    const navigate = useNavigate();
    const auth = getAuth();
    const db = getFirestore();
    const [stats, setStats] = useState({
        assets: 0,
        upcomingEvents: 0,
        activeAnnouncements: 0
    });
    const [nextEvent, setNextEvent] = useState<any>(null);
    const [latestAnnouncement, setLatestAnnouncement] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Stats
                // Note: In a real app we might use aggregation queries or counters
                // For now, we'll do simple fetches or mocks for speed
                const assetsSnap = await getDocs(collection(db, 'decor_assets'));
                const announcementsSnap = await getDocs(collection(db, 'decor_announcements'));

                // 2. Fetch Next Event
                const today = new Date().toISOString();
                const eventsRef = collection(db, 'decor_rota');
                const qEvents = query(
                    eventsRef,
                    where('date', '>=', today),
                    orderBy('date', 'asc'),
                    limit(1)
                );
                const eventSnap = await getDocs(qEvents);

                // 3. Fetch Latest Announcement
                const qAnnounce = query(
                    collection(db, 'decor_announcements'),
                    orderBy('timestamp', 'desc'),
                    limit(1)
                );
                const announceSnap = await getDocs(qAnnounce);

                setStats({
                    assets: assetsSnap.size,
                    upcomingEvents: 0, // We'd need a separate query for count
                    activeAnnouncements: announcementsSnap.size
                });

                if (!eventSnap.empty) {
                    setNextEvent({ id: eventSnap.docs[0].id, ...eventSnap.docs[0].data() });
                }

                if (!announceSnap.empty) {
                    setLatestAnnouncement({ id: announceSnap.docs[0].id, ...announceSnap.docs[0].data() });
                }

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchData();
    }, [db]);

    const QuickAction: React.FC<{ title: string, icon: any, color: string, onClick: () => void }> = ({ title, icon, color, onClick }) => (
        <button
            onClick={onClick}
            className="flex items-center p-4 bg-white border border-fuchsia-50 rounded-xl hover:shadow-md transition-all group"
        >
            <div className={`w-10 h-10 ${color} rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <span className="font-bold text-slate-700">{title}</span>
        </button>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-fuchsia-600 to-purple-600 p-8 rounded-3xl text-white shadow-xl shadow-fuchsia-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-16 -mt-16 blur-2xl"></div>

                <h1 className="text-3xl font-serif font-bold mb-2 relative z-10">
                    Hello, {auth.currentUser?.displayName?.split(' ')[0] || 'Creative'}
                </h1>
                <p className="text-fuchsia-100 relative z-10 max-w-lg">
                    Ready to transform spaces into sanctuaries? Check upcoming events and inventory status below.
                </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-fuchsia-50 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Assets</p>
                        <h3 className="text-3xl font-bold text-slate-800">{stats.assets}</h3>
                    </div>
                    <div className="w-12 h-12 bg-fuchsia-50 rounded-full flex items-center justify-center text-fuchsia-500">
                        <HiColorSwatch className="w-6 h-6" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-fuchsia-50 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Upcoming Duties</p>
                        <h3 className="text-3xl font-bold text-slate-800">--</h3>
                    </div>
                    <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-500">
                        <HiCalendar className="w-6 h-6" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-fuchsia-50 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Team Updates</p>
                        <h3 className="text-3xl font-bold text-slate-800">{stats.activeAnnouncements}</h3>
                    </div>
                    <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center text-pink-500">
                        <HiSpeakerphone className="w-6 h-6" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Feed / Next Up */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <HiSparkles className="text-fuchsia-500" /> Next Setup
                    </h2>

                    {nextEvent ? (
                        <div className="bg-white p-6 rounded-2xl border-l-4 border-fuchsia-500 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">{nextEvent.title}</h3>
                                    <p className="text-slate-500 text-sm">{format(new Date(nextEvent.date), 'EEEE, MMMM do, yyyy')}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${nextEvent.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {nextEvent.status || 'Planned'}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-600 mb-6">
                                <span className="flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-lg">
                                    ⏰ {nextEvent.time || '09:00 AM'}
                                </span>
                                <span className="flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-lg">
                                    📍 {nextEvent.location || 'Main Sanctuary'}
                                </span>
                            </div>
                            <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                                <div className="flex -space-x-2">
                                    {/* Mock Team Avatars */}
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"></div>
                                    ))}
                                    <div className="w-8 h-8 rounded-full bg-fuchsia-100 border-2 border-white flex items-center justify-center text-[10px] text-fuchsia-600 font-bold">+2</div>
                                </div>
                                <button onClick={() => navigate('/decoration/rota')} className="text-fuchsia-600 font-bold text-sm hover:underline">View Rota details →</button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-200 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                <HiCalendar className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-700">No upcoming duties</h3>
                            <p className="text-slate-500 text-sm mb-4">The calendar is clear for now.</p>
                            <button onClick={() => navigate('/decoration/rota')} className="text-fuchsia-600 font-bold text-sm">View Full Schedule</button>
                        </div>
                    )}

                    {/* Recent Announcement Preview */}
                    <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                        <div className="flex items-center gap-2 mb-2 text-amber-800 font-bold text-sm uppercase tracking-wide">
                            <HiSpeakerphone /> Latest Update
                        </div>
                        {latestAnnouncement ? (
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">{latestAnnouncement.title}</h3>
                                <p className="text-slate-600 text-sm line-clamp-2">{latestAnnouncement.content}</p>
                                <button onClick={() => navigate('/decoration/announcements')} className="mt-3 text-amber-700 font-bold text-xs">Read More</button>
                            </div>
                        ) : (
                            <p className="text-slate-500 italic text-sm">No recent team messages.</p>
                        )}
                    </div>
                </div>

                {/* Sidebar / Quick Actions */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-800">Quick Actions</h2>
                    <div className="grid grid-cols-1 gap-3">
                        <QuickAction
                            title="Check Rota"
                            icon={<HiCalendar className="w-5 h-5 text-purple-600" />}
                            color="bg-purple-100"
                            onClick={() => navigate('/decoration/rota')}
                        />
                        <QuickAction
                            title="View Inventory"
                            icon={<HiColorSwatch className="w-5 h-5 text-fuchsia-600" />}
                            color="bg-fuchsia-100"
                            onClick={() => navigate('/decoration/assets')}
                        />
                        <QuickAction
                            title="Team Chat"
                            icon={<HiSpeakerphone className="w-5 h-5 text-pink-600" />}
                            color="bg-pink-100"
                            onClick={() => navigate('/decoration/announcements')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DecorationDashboard;
