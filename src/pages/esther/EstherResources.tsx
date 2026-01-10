import React, { useState, useEffect } from 'react';
import { HiDownload, HiPlay, HiDocumentText, HiSearch } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { db } from '../../firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import type { EstherResource } from '../../types/esther';

const EstherResources: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [resources, setResources] = useState<EstherResource[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const q = query(collection(db, 'esther_resources'), orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EstherResource));
                setResources(data);
            } catch (error) {
                console.error("Error fetching resources:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResources();
    }, []);

    const filteredResources = resources.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAction = (type: string, title: string, url: string) => {
        if (!url) {
            toast.error("Resource link not available.");
            return;
        }
        window.open(url, '_blank');
        if (type === 'video') {
            toast.success(`Playing: ${title}`);
        } else {
            toast.success(`Downloading: ${title}`);
        }
    };

    return (
        <div className="space-y-8 font-sans">
            <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-rose-500 font-bold tracking-widest uppercase text-xs mb-2 block">Equipping the Saints</span>
                <h1 className="text-4xl md:text-5xl font-serif text-rose-950 mb-4">Resource Library</h1>
                <p className="text-gray-500">
                    Access study guides, sermon recordings, and spiritual tools to deepen your walk.
                </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-md mx-auto relative mb-12">
                <HiSearch className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search for guides, videos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all shadow-sm"
                />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    <div className="col-span-full text-center py-12 text-gray-400">Loading resources...</div>
                ) : filteredResources.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-400">No resources found matching your search.</div>
                ) : (
                    filteredResources.map((resource) => (
                        <div key={resource.id} className="bg-white rounded-2xl overflow-hidden border border-rose-100 shadow-sm hover:shadow-lg transition-all group">
                            <div className="h-48 overflow-hidden relative">
                                <img src={resource.image || 'https://images.unsplash.com/photo-1544928147-79a774bed935?w=800&auto=format&fit=crop&q=60'} alt={resource.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                    <button
                                        onClick={() => handleAction(resource.type, resource.title, resource.url)}
                                        className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white hover:text-rose-600 transition-all scale-90 group-hover:scale-100"
                                    >
                                        {resource.type === 'video' ? <HiPlay className="w-6 h-6 ml-1" /> : <HiDownload className="w-6 h-6" />}
                                    </button>
                                </div>
                                <span className={`absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-white/90 backdrop-blur ${resource.type === 'video' ? 'text-red-600' : 'text-blue-600'
                                    }`}>
                                    {resource.type}
                                </span>
                            </div>

                            <div className="p-6">
                                <h3 className="text-lg font-serif text-rose-950 mb-2 line-clamp-2">{resource.title}</h3>
                                <div className="flex items-center text-xs text-gray-400 mb-3 space-x-3">
                                    <span>{resource.author}</span>
                                    <span>•</span>
                                    <span>{resource.type === 'video' ? resource.duration : resource.size}</span>
                                </div>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                    {resource.desc}
                                </p>
                                <button
                                    onClick={() => handleAction(resource.type, resource.title, resource.url)}
                                    className="w-full py-2.5 rounded-lg border border-gray-100 hover:border-rose-200 hover:bg-rose-50 text-gray-600 hover:text-rose-600 font-medium text-sm transition-all flex items-center justify-center"
                                >
                                    {resource.type === 'video' ?
                                        <><HiPlay className="w-4 h-4 mr-2" /> Watch Now</> :
                                        <><HiDocumentText className="w-4 h-4 mr-2" /> Download PDF</>
                                    }
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default EstherResources;
