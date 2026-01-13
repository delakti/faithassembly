import React, { useState, useEffect } from 'react';
import {
    getFirestore,
    collection,
    query,
    onSnapshot,
    where,
    orderBy,
    limit
} from 'firebase/firestore';
import {
    HiOutlineUserGroup,
    HiOutlineCalendar,
    HiOutlineClipboardList,
    HiSpeakerphone
} from 'react-icons/hi';
import { format } from 'date-fns';

interface Announcement {
    id: string;
    title: string;
    content: string;
    createdAt: any;
    priority: 'Low' | 'Medium' | 'High';
}

const VisitationDashboard: React.FC = () => {
    // Stats State
    const [upcomingCount, setUpcomingCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [activeTeamCount, setActiveTeamCount] = useState(0);

    // Updates State
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    const db = getFirestore();

    useEffect(() => {
        // 1. Fetch Stats: Upcoming Visits (Status 'Scheduled')
        const upcomingQ = query(
            collection(db, 'visitation_requests'),
            where('status', '==', 'Scheduled')
        );
        const unsubUpcoming = onSnapshot(upcomingQ, (snapshot) => {
            setUpcomingCount(snapshot.size);
        });

        // 2. Fetch Stats: Pending Requests
        const pendingQ = query(
            collection(db, 'visitation_requests'),
            where('status', '==', 'Pending')
        );
        const unsubPending = onSnapshot(pendingQ, (snapshot) => {
            setPendingCount(snapshot.size);
        });

        // 3. Fetch Stats: Active Team Members
        const teamQ = query(
            collection(db, 'users'),
            where('role', 'in', ['visitation_member', 'visitation_leader'])
        );
        const unsubTeam = onSnapshot(teamQ, (snapshot) => {
            setActiveTeamCount(snapshot.size);
        });

        // 4. Fetch Announcements
        const announcementsQ = query(
            collection(db, 'visitation_announcements'),
            orderBy('createdAt', 'desc'),
            limit(5)
        );
        const unsubAnnouncements = onSnapshot(announcementsQ, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Announcement[];
            setAnnouncements(data);
            setLoading(false);
        });

        return () => {
            unsubUpcoming();
            unsubPending();
            unsubTeam();
            unsubAnnouncements();
        };
    }, [db]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm flex items-center space-x-4 transition-transform hover:-translate-y-1 duration-300">
                    <div className="p-3 bg-teal-50 rounded-xl text-teal-600">
                        <HiOutlineCalendar className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-stone-500 text-sm font-medium">Upcoming Visits</p>
                        <h3 className="text-2xl font-bold text-stone-800 animate-fade-in">{upcomingCount}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm flex items-center space-x-4 transition-transform hover:-translate-y-1 duration-300">
                    <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
                        <HiOutlineClipboardList className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-stone-500 text-sm font-medium">Pending Requests</p>
                        <h3 className="text-2xl font-bold text-stone-800 animate-fade-in">{pendingCount}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm flex items-center space-x-4 transition-transform hover:-translate-y-1 duration-300">
                    <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
                        <HiOutlineUserGroup className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-stone-500 text-sm font-medium">Active Team</p>
                        <h3 className="text-2xl font-bold text-stone-800 animate-fade-in">{activeTeamCount}</h3>
                    </div>
                </div>
            </div>

            {/* Recent Activity / Announcements */}
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
                <div className="flex items-center space-x-2 mb-4">
                    <div className="p-2 bg-stone-100 rounded-lg">
                        <HiSpeakerphone className="w-5 h-5 text-stone-600" />
                    </div>
                    <h3 className="font-serif font-bold text-lg text-stone-800">Latest Updates</h3>
                </div>

                {loading ? (
                    <div className="space-y-4 animate-pulse">
                        <div className="h-24 bg-stone-50 rounded-xl"></div>
                        <div className="h-24 bg-stone-50 rounded-xl"></div>
                    </div>
                ) : announcements.length === 0 ? (
                    <div className="text-center py-8 bg-stone-50 rounded-xl">
                        <p className="text-stone-500">No recent announcements.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {announcements.map((announcement) => (
                            <div key={announcement.id} className="p-4 bg-stone-50 rounded-xl border border-stone-100 hover:border-teal-200 transition-colors">
                                <p className="text-sm text-stone-700">
                                    <span className="font-bold text-teal-700 block mb-1">{announcement.title}</span>
                                    {announcement.content}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                    <p className="text-xs text-stone-400">
                                        posted {announcement.createdAt ? format(announcement.createdAt.toDate(), 'MMM d, yyyy h:mm a') : 'Recently'}
                                    </p>
                                    {announcement.priority === 'High' && (
                                        <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full uppercase">
                                            High Priority
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VisitationDashboard;
