import React from 'react';
import { HiSpeakerphone, HiChat, HiPaperClip } from 'react-icons/hi';

const POSTS = [
    {
        id: 1,
        author: "Sarah Andrews",
        role: "Team Leader",
        date: "2 hours ago",
        title: "Menu Update for Sunday",
        content: "Hi team! Just a heads up that we're switching the pastries for this Sunday's service. We'll be serving croissants instead of muffins. Please update the allergy signs accordingly.",
        comments: 3,
        attachments: 1
    },
    {
        id: 2,
        author: "Pastor Solomon",
        role: "Senior Pastor",
        date: "Yesterday",
        title: "A Big Thank You!",
        content: "I wanted to personally thank the hospitality team for the incredible service during the guest speaker lunch yesterday. The food was excellent, but your smiles were even better. Keep shining!",
        comments: 12,
        attachments: 0
    },
    {
        id: 3,
        author: "Admin",
        role: "System",
        date: "2 days ago",
        title: "New Aprons Have Arrived",
        content: "The new branded aprons are now in the storage closet. Please sign one out for your next shift. Remember to return them to the laundry bin after use.",
        comments: 0,
        attachments: 0
    }
];

const HospitalityAnnouncements: React.FC = () => {
    return (
        <div className="space-y-8 font-sans text-stone-800">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                <div className="border-l-4 border-orange-400 pl-6">
                    <span className="text-orange-500 font-bold tracking-widest uppercase text-xs mb-2 block">Communication</span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900">Notice Board</h1>
                    <p className="text-stone-500 font-medium mt-2 max-w-2xl">
                        Stay updated with the latest news and conversations from the team.
                    </p>
                </div>
                <button className="px-6 py-3 bg-stone-800 text-white font-bold rounded-xl shadow hover:bg-stone-900 transition-colors flex items-center gap-2">
                    <HiSpeakerphone className="w-5 h-5" /> Post Update
                </button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Main Feed */}
                <div className="md:col-span-2 space-y-6">
                    {POSTS.map((post) => (
                        <div key={post.id} className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                                    {post.author.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-stone-900 text-sm">{post.author}</h3>
                                    <span className="text-xs text-stone-500 uppercase tracking-wide">{post.role} &bull; {post.date}</span>
                                </div>
                            </div>

                            <h2 className="text-xl font-bold text-stone-800 mb-3">{post.title}</h2>
                            <p className="text-stone-600 leading-relaxed mb-6">
                                {post.content}
                            </p>

                            <div className="flex items-center gap-4 text-sm font-bold text-stone-400 border-t border-stone-100 pt-4">
                                <button className="flex items-center gap-2 hover:text-orange-500 transition-colors">
                                    <HiChat className="w-5 h-5" /> {post.comments} Comments
                                </button>
                                {post.attachments > 0 && (
                                    <button className="flex items-center gap-2 hover:text-orange-500 transition-colors">
                                        <HiPaperClip className="w-5 h-5" /> {post.attachments} Attachment
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                        <h3 className="font-serif font-bold text-lg text-stone-800 mb-4">Team Verse</h3>
                        <blockquote className="italic text-stone-600 text-sm leading-relaxed mb-4">
                            "Share with the Lord’s people who are in need. Practice hospitality."
                        </blockquote>
                        <cite className="text-xs font-bold text-orange-500 uppercase tracking-widest not-italic">— Romans 12:13</cite>
                    </div>

                    <div className="bg-white border border-stone-200 rounded-2xl p-6">
                        <h3 className="font-bold text-stone-800 mb-4 text-sm uppercase tracking-widest">Active Discussions</h3>
                        <ul className="space-y-4">
                            <li>
                                <a href="#" className="block hover:bg-stone-50 -mx-2 p-2 rounded-lg transition-colors">
                                    <span className="text-sm font-bold text-stone-700 block mb-1">Christmas Decor Ideas</span>
                                    <span className="text-xs text-stone-400">5 new replies &bull; Last reply by Jenny</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="block hover:bg-stone-50 -mx-2 p-2 rounded-lg transition-colors">
                                    <span className="text-sm font-bold text-stone-700 block mb-1">Shift Swaps for Dec</span>
                                    <span className="text-xs text-stone-400">2 new replies &bull; Last reply by Mark</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HospitalityAnnouncements;
