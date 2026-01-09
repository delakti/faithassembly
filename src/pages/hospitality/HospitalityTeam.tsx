import React from 'react';
import { HiUserGroup, HiBadgeCheck, HiMail, HiHeart } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const TEAMS = [
    {
        id: 'coffee',
        name: "Coffee & Refreshments",
        description: "Serving warmth one cup at a time.",
        leader: {
            name: "Sarah Andrews",
            role: "Team Lead",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60"
        },
        members: [
            { name: "John Doe", role: "Barista" },
            { name: "Jane Smith", role: "Server" },
            { name: "Mike Ross", role: "Setup" }
        ]
    },
    {
        id: 'greeters',
        name: "Welcome & Greeters",
        description: "The first smile of the day.",
        leader: {
            name: "David Chen",
            role: "Head Greeter",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60"
        },
        members: [
            { name: "Lisa Wong", role: "Front Door" },
            { name: "Tom Baker", role: "Welcome Desk" },
            { name: "Amanda Lee", role: "Floater" }
        ]
    },
    {
        id: 'events',
        name: "Special Events & Catering",
        description: "Excellence for special occasions.",
        leader: {
            name: "Maria Rodriguez",
            role: "Events Coordinator",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60"
        },
        members: [
            { name: "Chris Evans", role: "Chef" },
            { name: "Pat Wright", role: "Server" },
            { name: "Sam Green", role: "Logistics" }
        ]
    }
];

const HospitalityTeam: React.FC = () => {
    const handleContact = (name: string) => {
        toast.success(`Starting chat with ${name}...`);
    };

    return (
        <div className="space-y-8 font-sans text-stone-800">
            <div className="mb-8 border-l-4 border-orange-400 pl-6">
                <span className="text-orange-500 font-bold tracking-widest uppercase text-xs mb-2 block">Our Family</span>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900">Volunteer Teams</h1>
                <p className="text-stone-500 font-medium mt-2 max-w-2xl">
                    "Just as a body, though one, has many parts, but all its many parts form one body, so it is with Christ." — 1 Corinthians 12:12
                </p>
            </div>

            <div className="grid gap-8">
                {TEAMS.map((team) => (
                    <div key={team.id} className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="bg-stone-50 p-6 border-b border-stone-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-orange-500 shadow-sm">
                                    <HiUserGroup className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-stone-900">{team.name}</h2>
                                    <p className="text-sm text-stone-500">{team.description}</p>
                                </div>
                            </div>
                            <button className="hidden md:flex px-4 py-2 bg-white border border-stone-200 text-stone-600 text-sm font-bold rounded-lg hover:border-orange-300 hover:text-orange-600 transition-colors items-center gap-2">
                                <HiMail className="w-4 h-4" /> Message Group
                            </button>
                        </div>

                        <div className="p-6 md:p-8 grid md:grid-cols-4 gap-8">
                            {/* Leader Card */}
                            <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-stone-100 pb-6 md:pb-0 md:pr-8">
                                <span className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-4 block flex items-center gap-1">
                                    <HiBadgeCheck className="w-4 h-4" /> Team Leader
                                </span>
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
                                        <img src={team.leader.image} alt={team.leader.name} className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="font-bold text-lg text-stone-900">{team.leader.name}</h3>
                                    <p className="text-sm text-stone-500 mb-4">{team.leader.role}</p>
                                    <button
                                        onClick={() => handleContact(team.leader.name)}
                                        className="w-full py-2 rounded-lg bg-stone-800 text-white text-xs font-bold uppercase tracking-wider hover:bg-stone-900 transition-colors"
                                    >
                                        Contact
                                    </button>
                                </div>
                            </div>

                            {/* Members Grid */}
                            <div className="md:col-span-3">
                                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4 block">Team Members</span>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {team.members.map((member, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100">
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-stone-400 text-xs font-bold border border-stone-100">
                                                {member.name.charAt(0)}
                                            </div>
                                            <div>
                                                <span className="block text-sm font-bold text-stone-800">{member.name}</span>
                                                <span className="block text-xs text-stone-500">{member.role}</span>
                                            </div>
                                        </div>
                                    ))}
                                    <button className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-stone-200 text-stone-400 hover:border-orange-300 hover:text-orange-500 transition-colors text-sm font-bold">
                                        <HiHeart className="w-4 h-4" /> Join Team
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HospitalityTeam;
