import React, { useState, useEffect } from 'react';
import { HiPlay, HiDocumentText, HiDownload } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import type { YouthMedia } from '../../types/youth';

const YouthResources: React.FC = () => {
    const [resources, setResources] = useState<YouthMedia[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'video' | 'document'>('all');

    useEffect(() => {
        const q = query(collection(db, 'youth_media'), orderBy('date', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as YouthMedia[];
            setResources(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredResources = resources.filter(r => filter === 'all' || r.type === filter);

    const handleDownload = (title: string, url: string) => {
        window.open(url, '_blank');
        toast.success(`Opening ${title}...`);
    };

    if (loading) {
        return <div className="text-white text-center py-20">Loading resources...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">The Vault</h1>
                    <p className="text-gray-400">Word, worship, and wisdom on demand.</p>
                </div>

                <div className="flex bg-gray-900 rounded-xl p-1 border border-gray-800">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'all' ? 'bg-yellow-400 text-black' : 'text-gray-400 hover:text-white'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('video')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'video' ? 'bg-yellow-400 text-black' : 'text-gray-400 hover:text-white'}`}
                    >
                        Videos
                    </button>
                    <button
                        onClick={() => setFilter('document')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'document' ? 'bg-yellow-400 text-black' : 'text-gray-400 hover:text-white'}`}
                    >
                        Docs
                    </button>
                </div>
            </div>

            {filteredResources.length === 0 ? (
                <div className="text-gray-500 text-center py-20 bg-gray-900/50 rounded-3xl border border-gray-800">
                    <p className="text-xl font-bold">No resources found.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.map((res) => (
                        <div key={res.id} className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden hover:border-blue-500 transition-all group">
                            {/* Thumbnail Area */}
                            <div className="h-48 bg-black relative flex items-center justify-center overflow-hidden">
                                {res.type === 'video' ? (
                                    <>
                                        <img src={res.thumbnail || ''} alt={res.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <HiPlay className="w-6 h-6 text-white ml-1" />
                                            </div>
                                        </div>
                                        {res.duration && (
                                            <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-bold text-white">
                                                {res.duration}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 group-hover:bg-gray-700 transition-colors">
                                        <HiDocumentText className="w-16 h-16 text-gray-600 group-hover:text-blue-400 transition-colors" />
                                    </div>
                                )}
                            </div>

                            {/* Content Area */}
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-white line-clamp-2">{res.title}</h3>
                                </div>
                                <div className="flex justify-between items-center text-xs text-gray-400 mb-6">
                                    <span>{res.author}</span>
                                    <span>{res.date}</span>
                                </div>

                                <button
                                    onClick={() => handleDownload(res.title, res.url)}
                                    className={`w-full py-3 rounded-xl font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 text-sm ${res.type === 'video'
                                        ? 'bg-blue-600 text-white hover:bg-blue-500'
                                        : 'bg-gray-800 text-white hover:bg-gray-700'
                                        }`}
                                >
                                    {res.type === 'video' ? <><HiPlay className="w-4 h-4" /> Watch Now</> : <><HiDownload className="w-4 h-4" /> Download {res.size && `(${res.size})`}</>}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default YouthResources;
