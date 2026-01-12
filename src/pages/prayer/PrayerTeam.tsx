import React, { useState, useEffect } from 'react';
import { HiUserGroup, HiBadgeCheck, HiMail, HiShieldCheck } from 'react-icons/hi';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'react-hot-toast';

const PrayerTeam: React.FC = () => {
    const [teams, setTeams] = useState<any[]>([]);

    useEffect(() => {
        const q = query(collection(db, 'prayer_teams'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setTeams(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    const handleContact = (name: string) => {
        toast.success(`Message sent to ${name}.`);
    };

    return (
        <div className="space-y-8 font-sans text-slate-200">
            <div className="mb-8 border-l-4 border-indigo-500 pl-6">
                <span className="text-indigo-400 font-bold tracking-widest uppercase text-xs mb-2 block">Our Family</span>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">Intercessors</h1>
                <p className="text-slate-400 font-medium mt-2 max-w-2xl">
                    "And I sought for a man among them who should build up the wall and stand in the breach before me for the land." — Ezekiel 22:30
                </p>
            </div>

            <div className="grid gap-8">
                {teams.length === 0 && (
                    <div className="p-8 text-center border border-slate-800 rounded-xl bg-slate-900/50">
                        <p className="text-slate-500 italic">No prayer teams currently forming.</p>
                    </div>
                )}
                {teams.map((team) => (
                    <div key={team.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-all">
                        <div className="bg-slate-950 p-6 border-b border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 shadow-sm">
                                    <HiUserGroup className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">{team.name}</h2>
                                    <p className="text-sm text-slate-500">{team.description}</p>
                                </div>
                            </div>
                            <button className="hidden md:flex px-4 py-2 bg-slate-900 border border-slate-800 text-slate-400 text-sm font-bold rounded-lg hover:border-indigo-500/50 hover:text-indigo-400 transition-colors items-center gap-2">
                                <HiMail className="w-4 h-4" /> Message Group
                            </button>
                        </div>

                        <div className="p-6 md:p-8 grid md:grid-cols-4 gap-8">
                            {/* Leader Card */}
                            <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-slate-800 pb-6 md:pb-0 md:pr-8">
                                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4 block flex items-center gap-1">
                                    <HiBadgeCheck className="w-4 h-4" /> Team Leader
                                </span>
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-800 shadow-lg mb-4">
                                        <img src={team.leader?.image || `https://ui-avatars.com/api/?name=${team.leader?.name}&background=random`} alt={team.leader?.name} className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="font-bold text-lg text-white">{team.leader?.name}</h3>
                                    <p className="text-sm text-slate-500 mb-4">{team.leader?.role}</p>
                                    <button
                                        onClick={() => handleContact(team.leader?.name)}
                                        className="w-full py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-indigo-500 transition-colors"
                                    >
                                        Contact
                                    </button>
                                </div>
                            </div>

                            {/* Members Grid */}
                            <div className="md:col-span-3">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 block">Team Members</span>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {team.members?.map((member: any, idx: number) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                                            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-slate-600 text-xs font-bold border border-slate-800 uppercase">
                                                {member.name.charAt(0)}
                                            </div>
                                            <div>
                                                <span className="block text-sm font-bold text-slate-300">{member.name}</span>
                                                <span className="block text-xs text-slate-500">{member.role}</span>
                                            </div>
                                        </div>
                                    ))}
                                    <button className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-slate-800 text-slate-600 hover:border-indigo-500/30 hover:text-indigo-400 transition-colors text-sm font-bold">
                                        <HiShieldCheck className="w-4 h-4" /> Join Team
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

export default PrayerTeam;
