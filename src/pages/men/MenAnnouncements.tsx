import React from 'react';
import { HiLightningBolt } from 'react-icons/hi';

const POSTS = [
    {
        id: 1,
        title: "Protocol: Watch Your Six",
        author: "Pastor David",
        date: "Oct 24, 2023",
        preview: "In spiritual warfare, you cannot fight alone. Who is covering your blind spots? We discuss the importance of accountability partners.",
        image: "https://images.unsplash.com/photo-1505536561118-2830230206b1?q=80&w=2940&auto=format&fit=crop",
        tags: ["Brotherhood", "Warfare"]
    },
    {
        id: 2,
        title: "Discipline Equals Freedom",
        author: "Bro. Michael",
        date: "Oct 22, 2023",
        preview: "Exploring how spiritual disciplines—prayer, fasting, and study—liberate us from the bondage of sin and mediocrity.",
        image: "https://images.unsplash.com/photo-1549488390-d5a2390886c5?w=800&auto=format&fit=crop&q=60",
        tags: ["Discipline", "Growth"]
    }
];

const MenAnnouncements: React.FC = () => {
    return (
        <div className="space-y-8 font-sans">
            <div className="mb-12 border-l-4 border-orange-600 pl-6">
                <span className="text-orange-600 font-bold tracking-widest uppercase text-xs mb-2 block">Briefings & Intel</span>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic">Intel</h1>
                <p className="text-slate-500 font-medium mt-2 max-w-2xl">
                    "Knowledge is power." Stay updated with the latest devotionals, tactical advice, and ministry news.
                </p>
            </div>

            <div className="grid gap-8">
                {POSTS.map((post) => (
                    <article key={post.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all flex flex-col md:flex-row group">
                        <div className="md:w-1/3 h-64 md:h-auto overflow-hidden relative">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-indigo-900/20 group-hover:bg-transparent transition-colors"></div>
                        </div>
                        <div className="p-8 md:p-10 flex-1 flex flex-col justify-center">
                            <div className="flex gap-2 mb-4">
                                {post.tags.map(tag => (
                                    <span key={tag} className="bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase italic group-hover:text-indigo-600 transition-colors">
                                {post.title}
                            </h2>
                            <p className="text-slate-500 font-medium mb-6 leading-relaxed">
                                {post.preview}
                            </p>
                            <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-auto">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">
                                        {post.author[0]}
                                    </div>
                                    <div className="text-xs">
                                        <span className="font-bold text-slate-900 block uppercase">{post.author}</span>
                                        <span className="text-slate-400 font-mono">{post.date}</span>
                                    </div>
                                </div>
                                <button className="flex items-center text-indigo-600 font-bold text-sm uppercase tracking-wide hover:underline decoration-2 underline-offset-4">
                                    Read Briefing <HiLightningBolt className="w-4 h-4 ml-1" />
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {/* Newsletter Sign Up */}
            <div className="bg-slate-900 rounded-xl p-8 md:p-12 text-center text-white relative overflow-hidden mt-8 border border-slate-800">
                <div className="relative z-10 max-w-xl mx-auto">
                    <h3 className="text-2xl font-black uppercase italic mb-4">Subscribe to Daily Intel</h3>
                    <p className="text-slate-400 mb-8 font-medium">Get the "Morning Briefing" devotional sent to your inbox at 0600 daily.</p>
                    <div className="flex gap-2">
                        <input
                            type="email"
                            placeholder="EMAIL ADDRESS"
                            className="flex-1 px-4 py-3 rounded bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-bold uppercase tracking-wider"
                        />
                        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded font-black uppercase tracking-widest transition-colors">
                            Join
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenAnnouncements;
