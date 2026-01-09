import React, { useState } from 'react';
import { HiPlus, HiCheck, HiUsers } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const GROUPS = [
    {
        id: 1,
        name: "Mothers of Grace",
        leader: "Deaconess Sarah",
        schedule: "Tuesdays @ 10:00 AM",
        desc: "A safe haven for mothers to share, pray, and navigate the joys and challenges of raising godly children.",
        members: 12,
        image: "https://images.unsplash.com/photo-1531123414780-f74242c2b052?w=800&auto=format&fit=crop&q=60",
        joined: false
    },
    {
        id: 2,
        name: "Esther's Daughters (Young Adults)",
        leader: "Sis. Kehinde",
        schedule: "Fridays @ 7:00 PM",
        desc: "Navigating career, relationships, and faith in the modern world. For women ages 18-30.",
        members: 24,
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=60",
        joined: true
    },
    {
        id: 3,
        name: "Golden Vessels (Seniors)",
        leader: "Mama Ojo",
        schedule: "Wednesdays @ 4:00 PM",
        desc: "Wisdom, worship, and fellowship for our cherished senior sisters.",
        members: 15,
        image: "https://images.unsplash.com/photo-1573166368366-06d01eb666aa?w=800&auto=format&fit=crop&q=60",
        joined: false
    }
];

const EstherGroups: React.FC = () => {
    const [groups, setGroups] = useState(GROUPS);

    const toggleJoin = (id: number) => {
        setGroups(groups.map(g => {
            if (g.id === id) {
                const newStatus = !g.joined;
                toast.success(newStatus ? `Welcome to ${g.name}!` : `You have left ${g.name}.`);
                return { ...g, joined: newStatus, members: newStatus ? g.members + 1 : g.members - 1 };
            }
            return g;
        }));
    };

    return (
        <div className="space-y-8 font-sans">
            <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-rose-500 font-bold tracking-widest uppercase text-xs mb-2 block">Circle of Friends</span>
                <h1 className="text-4xl md:text-5xl font-serif text-rose-950 mb-4">Connect & Grow</h1>
                <p className="text-gray-500">
                    "As iron sharpens iron..." Join a mentoring circle or small group to walk this journey together.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {groups.map((group) => (
                    <div key={group.id} className="bg-white rounded-3xl overflow-hidden border border-rose-100 shadow-sm hover:shadow-lg transition-all group flex flex-col">
                        <div className="h-48 overflow-hidden relative">
                            <img src={group.image} alt={group.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-rose-600 flex items-center shadow-sm">
                                <HiUsers className="w-4 h-4 mr-1" /> {group.members}
                            </div>
                        </div>
                        <div className="p-8 flex-1 flex flex-col">
                            <h3 className="text-xl font-serif text-rose-950 mb-2">{group.name}</h3>
                            <p className="text-rose-500 text-sm font-bold mb-4">{group.schedule} • Lead: {group.leader}</p>
                            <p className="text-gray-500 text-sm mb-6 leading-relaxed flex-1">
                                {group.desc}
                            </p>

                            <button
                                onClick={() => toggleJoin(group.id)}
                                className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${group.joined
                                    ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                    : 'bg-rose-500 text-white hover:bg-rose-600 shadow-md shadow-rose-200'
                                    }`}
                            >
                                {group.joined ? <><HiCheck className="w-5 h-5" /> Member</> : <><HiPlus className="w-5 h-5" /> Join Circle</>}
                            </button>
                        </div>
                    </div>
                ))}

                {/* Create New Group Card */}
                <div className="bg-rose-50 rounded-3xl overflow-hidden border border-rose-200 border-dashed flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                        <HiPlus className="w-8 h-8 text-rose-400" />
                    </div>
                    <h3 className="text-xl font-serif text-rose-950 mb-2">Start a New Circle</h3>
                    <p className="text-gray-500 text-sm mb-6 max-w-xs">
                        Called to lead? Propose a new prayer circle or bible study group.
                    </p>
                    <button className="px-6 py-3 bg-white text-rose-600 font-bold rounded-xl hover:bg-rose-100 transition-colors shadow-sm">
                        Propose Group
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EstherGroups;
