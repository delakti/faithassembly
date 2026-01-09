import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { FaFilePdf, FaVideo, FaDownload, FaSpinner, FaBookOpen } from 'react-icons/fa';

interface Resource {
    id: string;
    title: string;
    description: string;
    type: 'pdf' | 'video' | 'link';
    url: string;
    category: string;
    dateAdded: any;
}

const VolunteerResources: React.FC = () => {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const q = query(collection(db, 'volunteer_resources'), orderBy('dateAdded', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Resource[];
            setResources(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const categories = ['All', ...Array.from(new Set(resources.map(r => r.category)))];
    const filteredResources = filter === 'All' ? resources : resources.filter(r => r.category === filter);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Resource Library</h1>

                <div className="flex space-x-2 overflow-x-auto pb-2 w-full md:w-auto">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${filter === cat
                                    ? 'bg-orange-600 text-white shadow-md'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <FaSpinner className="animate-spin text-orange-500 text-3xl" />
                </div>
            ) : filteredResources.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                    <FaBookOpen className="mx-auto text-4xl text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">No resources found in this category.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredResources.map(resource => (
                        <div key={resource.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition group overflow-hidden flex flex-col">
                            <div className="p-6 flex-1">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-lg ${resource.type === 'pdf' ? 'bg-red-100 text-red-600' :
                                            resource.type === 'video' ? 'bg-blue-100 text-blue-600' :
                                                'bg-gray-100 text-gray-600'
                                        }`}>
                                        {resource.type === 'pdf' ? <FaFilePdf className="text-xl" /> :
                                            resource.type === 'video' ? <FaVideo className="text-xl" /> :
                                                <FaBookOpen className="text-xl" />}
                                    </div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-2 py-1 rounded">
                                        {resource.category}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition">
                                    {resource.title}
                                </h3>
                                <p className="text-sm text-gray-600 line-clamp-3">
                                    {resource.description}
                                </p>
                            </div>

                            <div className="p-4 border-t border-gray-50 bg-gray-50/50">
                                <a
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-orange-600 hover:border-orange-200 transition"
                                >
                                    <FaDownload />
                                    {resource.type === 'video' ? 'Watch Now' : 'Download / View'}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VolunteerResources;
