import React, { useState } from 'react';
import { HiChat, HiHeart, HiShare, HiPencilAlt } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const TESTIMONIES = [
    {
        id: 1,
        author: "Brother David",
        date: "2 hours ago",
        title: "Miracle on High Street!",
        content: "While sharing tracts today, I met a man who said he had been planning to end his life. We prayed right there on the pavement, and he gave his life to Christ! God is moving!",
        likes: 24,
        comments: 5
    },
    {
        id: 2,
        author: "Sister Mary",
        date: "Yesterday",
        title: "Healing during Door-to-Door",
        content: "We visited Mrs. Higgins at #42. She had severe arthritis. After prayer, she stood up and walked without pain for the first time in months. She is coming to service this Sunday!",
        likes: 18,
        comments: 3
    },
    {
        id: 3,
        author: "Team Alpha",
        date: "Dec 08, 2025",
        title: "5 Souls Won in 1 Hour",
        content: "The harvest is truly ripe. We just spent an hour at the bus station and 5 young people accepted Jesus. Please pray for their follow-up.",
        likes: 32,
        comments: 8
    }
];

const EvangelismTestimonies: React.FC = () => {

    const [liked, setLiked] = useState<number[]>([]);

    const handleLike = (id: number) => {
        if (liked.includes(id)) {
            setLiked(liked.filter(i => i !== id));
        } else {
            setLiked([...liked, id]);
            toast.success('Amen!');
        }
    };

    return (
        <div className="space-y-8 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <span className="text-orange-500 font-bold text-xs mb-2 block tracking-widest uppercase">Field Reports</span>
                    <h1 className="text-3xl font-black text-white uppercase italic tracking-tight">Testimonies</h1>
                </div>

                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-sm rounded-lg shadow-lg hover:shadow-blue-600/20 transition-all flex items-center gap-2 whitespace-nowrap">
                    <HiPencilAlt className="w-5 h-5" /> Share Report
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {TESTIMONIES.map((story) => (
                    <div key={story.id} className="bg-stone-950 border border-stone-800 rounded-xl p-6 md:p-8 flex flex-col gap-4 hover:border-orange-500/30 transition-all">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center font-bold text-stone-500">
                                    {story.author.charAt(0)}
                                </div>
                                <div>
                                    <span className="block text-white font-bold text-sm">{story.author}</span>
                                    <span className="block text-stone-500 text-xs font-mono uppercase">{story.date}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-white mb-2 italic">"{story.title}"</h3>
                            <p className="text-stone-400 leading-relaxed text-sm">
                                {story.content}
                            </p>
                        </div>

                        <div className="mt-auto pt-6 border-t border-stone-800 flex items-center gap-6">
                            <button
                                onClick={() => handleLike(story.id)}
                                className={`flex items-center gap-2 text-sm font-bold transition-colors ${liked.includes(story.id) ? 'text-red-500' : 'text-stone-500 hover:text-red-500'}`}
                            >
                                <HiHeart className="w-5 h-5" />
                                {story.likes + (liked.includes(story.id) ? 1 : 0)}
                            </button>
                            <button className="flex items-center gap-2 text-sm font-bold text-stone-500 hover:text-white transition-colors">
                                <HiChat className="w-5 h-5" />
                                {story.comments}
                            </button>
                            <button className="flex items-center gap-2 text-sm font-bold text-stone-500 hover:text-white transition-colors ml-auto">
                                <HiShare className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EvangelismTestimonies;
