import React, { useState, useEffect } from 'react';
import { HiUserGroup, HiShieldCheck, HiSparkles, HiChat } from 'react-icons/hi';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';

const EvangelismTeam: React.FC = () => {
    const [squads, setSquads] = useState<any[]>([]);

    useEffect(() => {
        const q = query(collection(db, 'evangelism_squads'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setSquads(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    const getTheme = (color: string) => {
        switch (color) {
            case 'red': return { icon: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' };
            case 'blue': return { icon: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
            case 'purple': return { icon: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' };
            case 'green': return { icon: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' };
            default: return { icon: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' };
        }
    };

    return (
        <div className="space-y-8 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <span className="text-orange-500 font-bold text-xs mb-2 block tracking-widest uppercase">Force Structure</span>
                    <h1 className="text-3xl font-black text-white uppercase italic tracking-tight">Active Squads</h1>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {squads.length === 0 && (
                    <div className="col-span-full py-12 text-center border border-dashed border-stone-800 rounded-xl">
                        <p className="text-stone-500 italic">No active squads deployed. Check back later.</p>
                    </div>
                )}
                {squads.map((team) => {
                    const theme = getTheme(team.colorTheme);
                    return (
                        <div key={team.id} className="bg-stone-950 border border-stone-800 rounded-xl p-6 hover:border-orange-500/30 transition-all group relative overflow-hidden">
                            <div className="flex items-start justify-between mb-6">
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center border-2 ${theme.icon} ${theme.bg} ${theme.border}`}>
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
                                    <HiShieldCheck className={`w-5 h-5 ${theme.icon}`} />
                                    <span className="text-sm font-bold text-white">Lead: {team.lead}</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 bg-stone-900 rounded-full">
                                    <HiSparkles className="w-4 h-4 text-stone-400" />
                                    <span className="text-xs font-bold text-stone-300">{team.members} Members</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EvangelismTeam;
