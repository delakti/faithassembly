import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import { FaBullhorn } from 'react-icons/fa';

const MemberNews: React.FC = () => {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                // Use 'member_news' or 'announcements' collection
                const q = query(
                    collection(db, 'member_news'),
                    orderBy('date', 'desc'),
                    limit(20)
                );
                const snap = await getDocs(q);
                // If empty, fall back to mock data for demo if collection doesn't exist yet
                if (snap.empty) {
                    setNews([
                        { id: '1', title: 'Welcome to the New Portal', content: 'We are excited to launch this new digital space for our members.', date: new Date().toISOString(), category: 'General' },
                        { id: '2', title: 'Annual General Meeting', content: 'Join us next month for our AGM. Reports will be available for download.', date: new Date().toISOString(), category: 'Important' },
                    ]);
                } else {
                    setNews(snap.docs.map(d => ({ id: d.id, ...d.data() })));
                }
            } catch (error) {
                console.error("Error fetching news:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <FaBullhorn className="mr-3 text-orange-500" /> Member News
            </h1>

            {loading ? <p className="text-center text-gray-500">Loading updates...</p> : (
                <div className="space-y-6">
                    {news.map(item => (
                        <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${item.category === 'Important' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {item.category || 'General'}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {new Date(item.date).toLocaleDateString()}
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h2>
                            <p className="text-gray-700 leading-relaxed">{item.content}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MemberNews;
