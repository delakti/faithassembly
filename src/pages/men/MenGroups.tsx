import React, { useState } from 'react';
import { HiUserGroup, HiPlus, HiCheck, HiShieldCheck } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const GROUPS = [
    {
        id: 1,
        name: "Squad Alpha",
        leader: "Deacon James",
        schedule: "Tuesdays @ 1900",
        focus: "Purity & Integrity",
        members: 6,
        image: "https://images.unsplash.com/photo-1575439462433-8e1969065df7?w=800&auto=format&fit=crop&q=60",
        joined: true
    },
    {
        id: 2,
        name: "Squad Bravo",
        leader: "Bro. Peters",
        schedule: "Saturdays @ 0700",
        focus: "Leadership Development",
        members: 8,
        image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&auto=format&fit=crop&q=60",
        joined: false
    },
    {
        id: 3,
        name: "Squad Charlie",
        leader: "Min. Paul",
        schedule: "Thursdays @ 2000",
        focus: "Fatherhood & Family",
        members: 10,
        image: "https://images.unsplash.com/photo-1544256671-55dbd743a60a?w=800&auto=format&fit=crop&q=60",
        joined: false
    }
];

const MenGroups: React.FC = () => {
    const [groups, setGroups] = useState(GROUPS);

    const toggleJoin = (id: number) => {
        setGroups(groups.map(g => {
            if (g.id === id) {
                const newStatus = !g.joined;
                toast.success(newStatus ? `Welcome to ${g.name}.` : `You have stood down from ${g.name}.`);
                return { ...g, joined: newStatus, members: newStatus ? g.members + 1 : g.members - 1 };
            }
            return g;
        }));
    };

    return (
        <div className="space-y-8 font-sans">
            <div className="mb-12 border-l-4 border-green-600 pl-6">
                <span className="text-green-600 font-bold tracking-widest uppercase text-xs mb-2 block">Accountability Units</span>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic">Squads</h1>
                <p className="text-slate-500 font-medium mt-2 max-w-2xl">
                    Small teams for deep discipleship. "Two are better than one... if either of them falls down, one can help the other up."
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {groups.map((group) => (
                    <div key={group.id} className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all group flex flex-col">
                        <div className="h-48 overflow-hidden relative">
                            <img src={group.image} alt={group.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 contrast-125" />
                            <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur px-3 py-1 rounded text-xs font-black text-white uppercase tracking-wider flex items-center shadow-lg">
                                <HiUserGroup className="w-4 h-4 mr-1 text-green-500" /> {group.members} Active
                            </div>
                        </div>
                        <div className="p-8 flex-1 flex flex-col bg-slate-50">
                            <h3 className="text-2xl font-black text-slate-900 mb-1 uppercase italic">{group.name}</h3>
                            <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-6">Lead: {group.leader}</p>

                            <div className="space-y-4 mb-8">
                                <div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Mission Focus</span>
                                    <p className="text-slate-700 font-bold">{group.focus}</p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Rendezvous</span>
                                    <p className="text-slate-700 font-bold">{group.schedule}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => toggleJoin(group.id)}
                                className={`w-full py-4 rounded font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 mt-auto border-2 ${group.joined
                                        ? 'bg-slate-200 text-slate-600 border-slate-200'
                                        : 'bg-transparent text-indigo-600 border-indigo-600 hover:bg-indigo-600 hover:text-white'
                                    }`}
                            >
                                {group.joined ? <><HiCheck className="w-5 h-5" /> Assigned</> : <><HiPlus className="w-5 h-5" /> Join Squad</>}
                            </button>
                        </div>
                    </div>
                ))}

                {/* Create New Group Card */}
                <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex flex-col items-center justify-center p-8 text-center min-h-[400px] relative group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-xl relative z-10 group-hover:scale-110 transition-transform">
                        <HiShieldCheck className="w-10 h-10 text-indigo-500" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2 uppercase italic relative z-10">Commission New Squad</h3>
                    <p className="text-slate-400 text-sm mb-8 max-w-xs font-medium relative z-10">
                        Step up to lead a new accountability unit. Training required.
                    </p>
                    <button className="px-8 py-3 bg-white text-slate-900 font-black rounded uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-colors relative z-10">
                        Request Command
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MenGroups;
