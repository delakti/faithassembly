import React from 'react';
import {
    HiOutlineFolder,
    HiDownload,
    HiDocumentText,
    HiPlay,
    HiMusicNote,
    HiSearch
} from 'react-icons/hi';

const LifeResources: React.FC = () => {
    const resources = [
        { id: 1, name: 'Term 1 Lesson Plan.pdf', type: 'pdf', size: '2.4 MB', date: 'Jan 05, 2024' },
        { id: 2, name: 'The Holy Spirit - Slide Deck.pptx', type: 'ppt', size: '5.1 MB', date: 'Jan 12, 2024' },
        { id: 3, name: 'Worship Playlist - Jan', type: 'audio', size: 'External Link', date: 'Jan 15, 2024' },
        { id: 4, name: 'Discussion Guide - Romans 8.docx', type: 'doc', size: '156 KB', date: 'Jan 18, 2024' },
    ];

    const getIcon = (type: string) => {
        switch (type) {
            case 'pdf': return <HiDocumentText className="w-6 h-6 text-rose-500" />;
            case 'ppt': return <HiPlay className="w-6 h-6 text-orange-500" />;
            case 'audio': return <HiMusicNote className="w-6 h-6 text-purple-500" />;
            default: return <HiDocumentText className="w-6 h-6 text-sky-500" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Resources Library</h1>
                    <p className="text-slate-500">Access lesson plans, guides, and media.</p>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search files..."
                        className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none w-full md:w-64"
                    />
                    <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Folder Cards (Categories) */}
                {['Bible Studies', 'Teacher Guides', 'Media Assets', 'Administrative'].map((folder) => (
                    <div key={folder} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center text-center gap-3">
                        <HiOutlineFolder className="w-12 h-12 text-sky-200" />
                        <span className="font-bold text-slate-700">{folder}</span>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">Recent Files</h3>
                    <button className="text-sm text-sky-600 font-medium hover:underline">View All</button>
                </div>
                <div className="divide-y divide-slate-100">
                    {resources.map((file) => (
                        <div key={file.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-white border border-transparent group-hover:border-slate-200 transition-all">
                                    {getIcon(file.type)}
                                </div>
                                <div>
                                    <p className="font-medium text-slate-800">{file.name}</p>
                                    <p className="text-xs text-slate-400">{file.date} &bull; {file.size}</p>
                                </div>
                            </div>
                            <button className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-full transition-colors">
                                <HiDownload className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LifeResources;
