import React from 'react';
import { HiMicrophone, HiSparkles } from 'react-icons/hi';

const ANNOUNCEMENTS = [
    {
        id: 1,
        title: "Weekly Focus: Posture of Praise",
        author: "Worship Pastor",
        date: "2 days ago",
        content: "Team, this Sunday lets focus on our physical expression of worship. Remember, our posture leads the congregation. Lifting hands isn't just a motion, it's a sign of surrender.",
        category: "Devotional"
    },
    {
        id: 2,
        title: "New In-Ear Monitor System",
        author: "Tech Director",
        date: "5 days ago",
        content: "The new Aviom units are installed. Please arrive 15 minutes early on Thursday to get your mix dialed in before downbeat.",
        category: "Tech Update"
    },
    {
        id: 3,
        title: "Christmas Choir Sign-ups",
        author: "Choir Director",
        date: "1 week ago",
        content: "If you want to be part of the mass choir for the Christmas special, please sign up by next Sunday. Rehearsals start Nov 1st.",
        category: "Important"
    }
];

const WorshipAnnouncements: React.FC = () => {
    return (
        <div className="space-y-10 font-sans text-gray-200">
            <div className="mb-12 border-l-4 border-purple-500 pl-6">
                <span className="text-purple-500 font-bold tracking-widest uppercase text-xs mb-2 block">Green Room Chatter</span>
                <h1 className="text-4xl md:text-5xl font-serif text-white">Backstage</h1>
                <p className="text-gray-400 font-medium mt-2 max-w-2xl">
                    Team updates, devotionals, and tech notes. Keep your ear to the ground.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Main Feed */}
                <div className="space-y-8">
                    {ANNOUNCEMENTS.map((item) => (
                        <div key={item.id} className="bg-neutral-900/50 border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.category === 'Devotional' ? 'bg-purple-500/20 text-purple-400' :
                                        item.category === 'Tech Update' ? 'bg-blue-500/20 text-blue-400' :
                                            'bg-red-500/20 text-red-400'
                                    }`}>
                                    {item.category}
                                </span>
                                <span className="text-xs text-gray-500 font-mono">{item.date}</span>
                            </div>

                            <h3 className="text-2xl font-serif text-white mb-4 group-hover:text-purple-400 transition-colors">{item.title}</h3>
                            <p className="text-gray-400 leading-relaxed mb-6 font-light text-lg">
                                {item.content}
                            </p>

                            <div className="flex items-center gap-3 border-t border-white/5 pt-6">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-xs font-bold text-white border border-white/10">
                                    {item.author[0]}
                                </div>
                                <span className="text-sm font-medium text-gray-500">{item.author}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                    <div className="bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/30 rounded-2xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 bg-purple-600/20 blur-[80px] rounded-full pointer-events-none"></div>

                        <div className="relative z-10 text-center">
                            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/30 text-purple-400">
                                <HiSparkles className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-serif text-white mb-2">Team Devotional</h3>
                            <p className="text-gray-400 text-sm mb-6">
                                Join us 30 minutes before every rehearsal for prayer and vision casting.
                            </p>
                            <button className="w-full py-3 bg-white text-black font-bold uppercase tracking-widest text-xs rounded hover:bg-gray-200 transition-colors">
                                Read This Week's Devotional
                            </button>
                        </div>
                    </div>

                    <div className="bg-neutral-900/30 border border-white/10 rounded-2xl p-8">
                        <h3 className="text-lg font-serif text-white mb-6 flex items-center gap-2">
                            <HiMicrophone className="w-5 h-5 text-gray-500" />
                            Quick Links
                        </h3>
                        <ul className="space-y-4">
                            <li>
                                <a href="#" className="flex justify-between items-center group">
                                    <span className="text-gray-400 group-hover:text-white transition-colors text-sm">Planning Center Online</span>
                                    <span className="text-gray-600 group-hover:text-white transition-colors">↗</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex justify-between items-center group">
                                    <span className="text-gray-400 group-hover:text-white transition-colors text-sm">Multitracks.com</span>
                                    <span className="text-gray-600 group-hover:text-white transition-colors">↗</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex justify-between items-center group">
                                    <span className="text-gray-400 group-hover:text-white transition-colors text-sm">Team Handbook (PDF)</span>
                                    <span className="text-gray-600 group-hover:text-white transition-colors">⬇</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorshipAnnouncements;
