import React, { useState } from 'react';
import { HiPlus, HiCheck } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const MOCK_GROUPS = [
    {
        id: '1',
        name: 'The 180 (High School Boys)',
        leader: 'Mike O.',
        members: 12,
        desc: 'Brothers growing in faith, fitness, and fortitude. We meet every Tuesday.',
        image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&auto=format&fit=crop&q=60',
        joined: false
    },
    {
        id: '2',
        name: 'Uni Life (University Students)',
        leader: 'Sarah J.',
        members: 24,
        desc: 'Navigating exams, relationships, and purpose. Coffee meetups on Thursdays.',
        image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=60',
        joined: true
    },
    {
        id: '3',
        name: 'Creative Arts Squad',
        leader: 'David K.',
        members: 8,
        desc: 'For the creatives—music, media, drama. We build the Sunday experience.',
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=60',
        joined: false
    }
];

const YouthGroups: React.FC = () => {
    const [groups, setGroups] = useState(MOCK_GROUPS);

    const toggleJoin = (id: string) => {
        setGroups(groups.map(g => {
            if (g.id === id) {
                const newStatus = !g.joined;
                toast.success(newStatus ? `Welcome to ${g.name}! 🎉` : `You left ${g.name}.`);
                return { ...g, joined: newStatus, members: newStatus ? g.members + 1 : g.members - 1 };
            }
            return g;
        }));
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">My Squads</h1>
                    <p className="text-gray-400">Find your people. Do life together.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((group) => (
                    <div key={group.id} className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden flex flex-col hover:border-purple-500 transition-all group">
                        <div className="h-40 overflow-hidden relative">
                            <img
                                src={group.image}
                                alt={group.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                            <div className="absolute bottom-4 left-4">
                                <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                                    {group.members} Members
                                </span>
                            </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-xl font-black text-white italic uppercase mb-1">{group.name}</h3>
                            <p className="text-purple-400 text-sm font-bold mb-3">Leader: {group.leader}</p>
                            <p className="text-gray-400 text-sm mb-6 flex-1 leading-relaxed">
                                {group.desc}
                            </p>

                            <button
                                onClick={() => toggleJoin(group.id)}
                                className={`w-full py-3 rounded-xl font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${group.joined
                                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    : 'bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-600/30'
                                    }`}
                            >
                                {group.joined ? (
                                    <><HiCheck className="w-5 h-5" /> JOINED</>
                                ) : (
                                    <><HiPlus className="w-5 h-5" /> JOIN SQUAD</>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default YouthGroups;
