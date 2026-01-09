import React, { useState } from 'react';
import { HiDownload, HiFolder, HiSearch, HiCloudUpload } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const RESOURCES = [
    {
        id: 1,
        name: "Kingdom Come - Series Graphics",
        type: "folder",
        size: "1.2 GB",
        date: "Nov 28, 2025",
        items: 12
    },
    {
        id: 2,
        name: "Sunday Service Run Sheet Template.pdf",
        type: "file",
        size: "2.4 MB",
        date: "Oct 15, 2025",
        items: null
    },
    {
        id: 3,
        name: "Lower Thirds (Clean).png",
        type: "file",
        size: "5.1 MB",
        date: "Sep 01, 2025",
        items: null
    },
    {
        id: 4,
        name: "OBS Scene Collection Backup",
        type: "file",
        size: "45 KB",
        date: "Dec 01, 2025",
        items: null
    },
    {
        id: 5,
        name: "Announcement Loop (Winter)",
        type: "folder",
        size: "4.5 GB",
        date: "Dec 02, 2025",
        items: 8
    }
];

const MediaResources: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleDownload = (name: string) => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
                loading: `Downloading ${name}...`,
                success: 'Download Complete',
                error: 'Download Failed',
            }
        );
    };

    const filteredResources = RESOURCES.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-8 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <span className="text-cyan-500 font-mono font-bold text-xs mb-2 block tracking-widest uppercase">Asset Library</span>
                    <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Media Repository</h1>
                </div>

                <button className="px-6 py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-500 transition-colors flex items-center gap-2 font-mono uppercase text-sm">
                    <HiCloudUpload className="w-5 h-5" /> Upload Asset
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResources.map((resource) => (
                    <div key={resource.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-cyan-500/30 transition-all group">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${resource.type === 'folder'
                                    ? 'bg-cyan-900/10 border-cyan-500/20 text-cyan-500'
                                    : 'bg-slate-950 border-slate-700 text-slate-400'
                                }`}>
                                <HiFolder className="w-6 h-6" />
                            </div>
                            <button
                                onClick={() => handleDownload(resource.name)}
                                className="text-slate-600 hover:text-white transition-colors p-2"
                            >
                                <HiDownload className="w-5 h-5" />
                            </button>
                        </div>

                        <h3 className="font-bold text-white text-lg mb-1 truncate group-hover:text-cyan-400 transition-colors">{resource.name}</h3>

                        <div className="flex justify-between items-center text-xs font-mono text-slate-500 mt-4 border-t border-slate-800 pt-4">
                            <span>{resource.date}</span>
                            <span className="flex items-center gap-2">
                                {resource.items ? `${resource.items} items` : resource.size}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MediaResources;
