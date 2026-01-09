import React from 'react';
import { HiUserGroup, HiShieldCheck, HiSparkles, HiChat } from 'react-icons/hi';

const TEAMS = [
    {
        id: 'alpha',
        name: "Team Alpha (Street)",
        focus: "High Street & Bus Station",
        lead: "Brother James",
        members: 12,
        color: "text-red-500",
        bg: "bg-red-500/10",
        border: "border-red-500/20"
    },
    {
        id: 'beta',
        name: "Team Beta (Market)",
        focus: "Central Market & Plazas",
        lead: "Sister Sarah",
        members: 8,
        color: "text-orange-500",
        bg: "bg-orange-500/10",
        border: "border-orange-500/20"
    },
    {
        id: 'followup',
        name: "Follow-Up Crew",
        focus: "Home Visits & Calls",
        lead: "Pastor Mark",
        members: 6,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20"
    },
    {
        id: 'prayer',
        name: "Intercession Squad",
        focus: "Backing Prayer",
        lead: "Mother Esther",
        members: 15,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20"
    }
];

const EvangelismTeam: React.FC = () => {
    return (
        <div className="space-y-8 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <span className="text-orange-500 font-bold text-xs mb-2 block tracking-widest uppercase">Force Structure</span>
                    <h1 className="text-3xl font-black text-white uppercase italic tracking-tight">Active Squads</h1>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {TEAMS.map((team) => (
                    <div key={team.id} className="bg-stone-950 border border-stone-800 rounded-xl p-6 hover:border-orange-500/30 transition-all group relative overflow-hidden">
                        <div className="flex items-start justify-between mb-6">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center border-2 ${team.color} ${team.bg} ${team.border}`}>
                                <HiUserGroup className="w-8 h-8" />
                            </div>
                            <button className="text-stone-500 hover:text-white transition-colors p-2 bg-stone-900 rounded-lg">
                                <HiChat className="w-5 h-5" />
                            </button>
                        </div>

                        <h3 className="text-2xl font-black text-white uppercase italic mb-1">{team.name}</h3>
                        <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-6">{team.focus}</p>

                        <div className="flex items-center justify-between border-t border-stone-900 pt-4">
                            <div className="flex items-center gap-2">
                                <HiShieldCheck className={`w-5 h-5 ${team.color}`} />
                                <span className="text-sm font-bold text-white">Lead: {team.lead}</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-stone-900 rounded-full">
                                <HiSparkles className="w-4 h-4 text-stone-400" />
                                <span className="text-xs font-bold text-stone-300">{team.members} Members</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EvangelismTeam;
