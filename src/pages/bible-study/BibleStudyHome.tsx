import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import StudyGuideCard from '../../components/bible-study/StudyGuideCard';
import type { StudyGuide } from '../../types/bibleStudy';
import { FaSearch, FaFilter } from 'react-icons/fa';

const BibleStudyHome: React.FC = () => {
    const [guides, setGuides] = useState<StudyGuide[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Mock initial data fetch (Replace with real Firestore query later if needed)
    useEffect(() => {
        const fetchGuides = async () => {
            try {
                // For now, we fetch all and filter client side for better UX with small dataset
                // In production with thousands of records, we'd use Firestore compound queries
                const q = query(collection(db, 'studyGuides'), orderBy('createdAt', 'desc'));
                const snapshot = await getDocs(q);

                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as StudyGuide[];

                setGuides(data);
            } catch (error) {
                console.error("Error fetching study guides:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGuides();
    }, []);

    const filteredGuides = guides.filter(guide => {
        const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            guide.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || guide.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const categories = ['All', 'Faith', 'Discipleship', 'Prayer', 'Prophecy', 'Family'];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header / Hero */}
            <div className="bg-purple-900 text-white py-16 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Bible Study Portal</h1>
                    <p className="text-xl text-purple-200 max-w-2xl mx-auto mb-8">
                        Grow in your faith with our library of interactive study guides, PDFs, and video lessons.
                    </p>
                    <Link
                        to="/bible-study/dashboard"
                        className="inline-flex items-center px-6 py-3 bg-white text-purple-900 rounded-full font-bold hover:bg-purple-100 transition shadow-lg"
                    >
                        Go to My Dashboard
                    </Link>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="max-w-7xl mx-auto px-4 -mt-8">
                <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search topics, titles, or keywords..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                        />
                    </div>

                    <div className="flex items-center space-x-2 w-full md:w-auto">
                        <FaFilter className="text-gray-400" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full md:w-48 px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 outline-none bg-white"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="max-w-7xl mx-auto px-4 mt-12">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto"></div>
                        <p className="mt-4 text-gray-500">Loading resources...</p>
                    </div>
                ) : filteredGuides.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredGuides.map(guide => (
                            <StudyGuideCard key={guide.id} guide={guide} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-xl text-gray-500">No study guides found matching your criteria.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                            className="mt-4 text-purple-600 font-semibold hover:underline"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BibleStudyHome;
