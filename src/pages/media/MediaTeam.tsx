import React from 'react';
import { HiMail, HiBadgeCheck, HiDesktopComputer, HiCamera, HiMicrophone, HiWifi } from 'react-icons/hi';

const TEAMS = [
    {
        id: 'visuals',
        name: "Visuals Team",
        lead: "Sarah Jenkins",
        icon: <HiDesktopComputer className="w-6 h-6" />,
        members: [
            { name: "Sarah Jenkins", role: "Lead", status: "online" },
            { name: "Mike T.", role: "Operator", status: "offline" },
            { name: "Jessica M.", role: "Graphics", status: "busy" },
        ]
    },
    {
        id: 'audio',
        name: "Audio Engineers",
        lead: "David Kim",
        icon: <HiMicrophone className="w-6 h-6" />,
        members: [
            { name: "David Kim", role: "FOH Lead", status: "online" },
            { name: "Jamal R.", role: "Monitor Eng", status: "offline" },
            { name: "Chris P.", role: "Broadcast Audio", status: "online" },
        ]
    },
    {
        id: 'stream',
        name: "Broadcast / Stream",
        lead: "Alex Chen",
        icon: <HiWifi className="w-6 h-6" />,
        members: [
            { name: "Alex Chen", role: "Director", status: "busy" },
            { name: "You", role: "Tech", status: "online" },
        ]
    },
    {
        id: 'camera',
        name: "Camera Ops",
        lead: "Rachel Green",
        icon: <HiCamera className="w-6 h-6" />,
        members: [
            { name: "Rachel Green", role: "Lead", status: "offline" },
            { name: "Tom H.", role: "Cam 2", status: "offline" },
            { name: "Lisa K.", role: "Cam 3", status: "online" },
        ]
    }
];

const MediaTeam: React.FC = () => {
    return (
        <div className="space-y-8 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <span className="text-cyan-500 font-mono font-bold text-xs mb-2 block tracking-widest uppercase">Crew Manifest</span>
                    <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Production Teams</h1>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {TEAMS.map((team) => (
                    <div key={team.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-cyan-500/30 transition-all">
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center text-cyan-500">
                                    {team.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white uppercase tracking-wide text-sm">{team.name}</h3>
                                    <span className="text-xs text-slate-500 font-mono uppercase">Lead: {team.lead}</span>
                                </div>
                            </div>
                            <button className="text-slate-400 hover:text-white transition-colors">
                                <HiMail className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-4">
                            <div className="space-y-1">
                                {team.members.map((member, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 hover:bg-slate-800/50 rounded-lg transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${member.status === 'online' ? 'bg-green-500' :
                                                member.status === 'busy' ? 'bg-red-500' :
                                                    'bg-slate-600'
                                                }`}></div>
                                            <span className={`text-sm font-medium ${member.name === 'You' ? 'text-cyan-400 font-bold' : 'text-slate-300'}`}>
                                                {member.name}
                                            </span>
                                            {member.role.includes('Lead') && (
                                                <HiBadgeCheck className="w-4 h-4 text-cyan-500" />
                                            )}
                                        </div>
                                        <span className="text-xs font-mono text-slate-500 uppercase group-hover:text-slate-300 transition-colors">
                                            {member.role}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MediaTeam;
