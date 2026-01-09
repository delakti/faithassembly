import React, { useState } from 'react';
import { HiChatAlt2, HiThumbUp, HiPencilAlt } from 'react-icons/hi';

const TOPICS = [
    {
        id: 1,
        author: "Bro. James",
        initial: "J",
        category: "Leadership",
        title: "Leading your family in devotions",
        content: "Men, I've been struggling to be consistent with family altar. What resources or schedules work for you guys with young kids?",
        likes: 15,
        replies: 8,
        time: "4h ago"
    },
    {
        id: 2,
        author: "Deacon Mike",
        initial: "M",
        category: "Work/Life",
        title: "Prayer for job interview tomorrow",
        content: "Heading into a final round interview for a management role. Need agreement in prayer for favor and wisdom.",
        likes: 28,
        replies: 12,
        time: "6h ago"
    }
];

const MenForum: React.FC = () => {
    const [threads] = useState(TOPICS);
    const [activeTab, setActiveTab] = useState<'all' | 'prayer' | 'discussion'>('all');

    return (
        <div className="grid lg:grid-cols-3 gap-8 font-sans h-[calc(100vh-140px)]">
            {/* Main Feed */}
            <div className="lg:col-span-2 flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <h2 className="text-2xl font-black text-slate-900 uppercase italic">The Locker Room</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-4 py-2 rounded font-bold text-xs uppercase tracking-wider transition-all ${activeTab === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-200'}`}
                        >
                            All Comms
                        </button>
                        <button
                            onClick={() => setActiveTab('prayer')}
                            className={`px-4 py-2 rounded font-bold text-xs uppercase tracking-wider transition-all ${activeTab === 'prayer' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-200'}`}
                        >
                            Prayer Ops
                        </button>
                        <button
                            onClick={() => setActiveTab('discussion')}
                            className={`px-4 py-2 rounded font-bold text-xs uppercase tracking-wider transition-all ${activeTab === 'discussion' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-200'}`}
                        >
                            Tactical
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-100">
                    {threads.map((thread) => (
                        <div key={thread.id} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded bg-slate-900 flex items-center justify-center font-black text-white shrink-0 text-xl">
                                    {thread.initial}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="font-bold text-slate-900 uppercase tracking-wide text-sm">{thread.author}</h3>
                                        <span className="text-xs font-mono text-slate-400">{thread.time}</span>
                                    </div>
                                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider mb-2 ${thread.category === 'Leadership' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                                        }`}>
                                        {thread.category}
                                    </span>
                                    <h4 className="font-bold text-lg text-slate-800 mb-2">{thread.title}</h4>
                                    <p className="text-slate-600 text-sm leading-relaxed mb-4 border-l-2 border-slate-300 pl-4">
                                        {thread.content}
                                    </p>
                                    <div className="flex gap-6 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                        <button className="flex items-center hover:text-indigo-600 transition-colors">
                                            <HiThumbUp className="w-4 h-4 mr-1" /> {thread.likes} Affirmations
                                        </button>
                                        <button className="flex items-center hover:text-indigo-600 transition-colors">
                                            <HiChatAlt2 className="w-4 h-4 mr-1" /> {thread.replies} Replies
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sidebar / Post New */}
            <div className="flex flex-col gap-6">
                <div className="bg-indigo-700 text-white rounded-xl p-8 text-center shadow-xl shadow-indigo-900/20 border border-indigo-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 pointer-events-none"></div>
                    <div className="w-16 h-16 bg-indigo-500/50 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur border border-indigo-400/30">
                        <HiPencilAlt className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-black uppercase italic mb-2 relative z-10">Initiate Topic</h3>
                    <p className="text-indigo-200 text-sm mb-8 font-medium relative z-10">
                        Seek counsel, share a victory, or mobilize prayer support.
                    </p>
                    <button className="w-full py-4 bg-white text-indigo-700 font-black rounded uppercase tracking-widest hover:bg-indigo-50 transition-colors shadow-lg relative z-10">
                        Start Comms
                    </button>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 flex-1 shadow-sm">
                    <h3 className="text-slate-900 font-black text-xs uppercase tracking-widest mb-4 flex items-center">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span> Rules of Engagement
                    </h3>
                    <ul className="space-y-4 text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-wide">
                        <li className="flex gap-3">
                            <span className="text-slate-300">01</span>
                            What is said in the Locker Room stays in the Locker Room.
                        </li>
                        <li className="flex gap-3">
                            <span className="text-slate-300">02</span>
                            Speak truth in love. Iron sharpens iron.
                        </li>
                        <li className="flex gap-3">
                            <span className="text-slate-300">03</span>
                            No sales pitches or business promotions.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MenForum;
