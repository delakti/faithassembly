import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import type { Announcement } from '../../types/volunteer';
import { FaBullhorn, FaCalendarAlt, FaUserCircle, FaSpinner } from 'react-icons/fa';

const VolunteerMessages: React.FC = () => {
    const [messages, setMessages] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'volunteer_announcements'), orderBy('date', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Announcement[];
            setMessages(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold text-gray-900">Team Announcements</h1>
                <p className="text-gray-500 mt-1">Stay updated with the latest news from your team leaders.</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <FaSpinner className="animate-spin text-orange-500 text-3xl" />
                </div>
            ) : messages.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                    <FaBullhorn className="mx-auto text-4xl text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">No announcements yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {messages.map(msg => (
                        <div key={msg.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                            <div className="p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xl">
                                            <FaUserCircle />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{msg.author || "Team Leader"}</p>
                                        <div className="flex items-center text-xs text-gray-500 gap-2">
                                            <FaCalendarAlt />
                                            {msg.date ? new Date(msg.date).toLocaleDateString() : 'Recent'}
                                        </div>
                                    </div>
                                    <div className="ml-auto">
                                        {msg.targetTeams.map(team => (
                                            <span key={team} className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-bold uppercase tracking-wider ml-1">
                                                {team}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <h2 className="text-xl font-bold text-gray-900 mb-3">{msg.title}</h2>
                                <div className="prose prose-orange max-w-none text-gray-600">
                                    <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VolunteerMessages;
