import React from 'react';
import { HiHeart, HiShare } from 'react-icons/hi';

const DEVOTIONALS = [
    {
        id: 1,
        title: "Embracing Your Season",
        author: "Sister Grace",
        date: "Oct 24, 2023",
        preview: "In every season, God has a purpose. Whether you are in a winter of waiting or a summer of harvest, your posture matters...",
        image: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=2940&auto=format&fit=crop",
        tags: ["Faith", "Patience"]
    },
    {
        id: 2,
        title: "The Power of Gentle Speech",
        author: "Mother Mary",
        date: "Oct 22, 2023",
        preview: "Proverbs 15:1 tells us that a gentle answer turns away wrath. In our homes and workplaces, are we sowers of peace?",
        image: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=800&auto=format&fit=crop&q=60",
        tags: ["Wisdom", "Family"]
    }
];

const EstherDevotionals: React.FC = () => {
    return (
        <div className="space-y-8 font-sans">
            <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-rose-500 font-bold tracking-widest uppercase text-xs mb-2 block">Daily Manna</span>
                <h1 className="text-4xl md:text-5xl font-serif text-rose-950 mb-4">Inspiration for Your Soul</h1>
                <p className="text-gray-500">
                    Encouragement, biblical wisdom, and testimonies to ground you in your walk with Christ.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {DEVOTIONALS.map((post) => (
                    <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-rose-100 hover:shadow-md transition-shadow flex flex-col">
                        <div className="h-64 overflow-hidden relative group">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-4">
                                <button className="bg-white/20 backdrop-blur text-white p-2 rounded-full hover:bg-white hover:text-rose-500 transition-colors">
                                    <HiShare className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="p-8 flex-1 flex flex-col">
                            <div className="flex gap-2 mb-4">
                                {post.tags.map(tag => (
                                    <span key={tag} className="bg-rose-50 text-rose-600 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <h2 className="text-2xl font-serif text-rose-950 mb-3 hover:text-rose-600 transition-colors cursor-pointer">
                                {post.title}
                            </h2>
                            <p className="text-gray-500 mb-6 leading-relaxed flex-1">
                                {post.preview}
                            </p>
                            <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                                    By {post.author}
                                </span>
                                <div className="flex items-center text-rose-400 text-sm font-medium cursor-pointer group hover:text-rose-600">
                                    Read Full <HiHeart className="w-4 h-4 ml-1 group-hover:fill-rose-600" />
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {/* Newsletter / Daily Verse Signup */}
            <div className="bg-rose-900 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden mt-12">
                <div className="relative z-10 max-w-xl mx-auto">
                    <h3 className="text-2xl font-serif mb-4">Receive Daily Wisdom</h3>
                    <p className="text-rose-200 mb-8">Join 500+ women receiving daily scripture and encouragement directly to their inbox.</p>
                    <div className="flex gap-2">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-400"
                        />
                        <button className="bg-rose-500 hover:bg-rose-400 text-white px-6 py-3 rounded-lg font-bold transition-colors">
                            Subscribe
                        </button>
                    </div>
                </div>
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                        <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default EstherDevotionals;
