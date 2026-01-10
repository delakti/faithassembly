import React, { useState, useEffect } from 'react';
import { HiMail, HiPhone, HiStar } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import type { WorshipMember } from '../../types/worship';

const WorshipTeam: React.FC = () => {
    const [members, setMembers] = useState<WorshipMember[]>([]);
    const [activeTab, setActiveTab] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'worship_team'), orderBy('name', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorshipMember)));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const filteredTeam = activeTab === 'All' ? members : members.filter(m => m.section === activeTab);

    const handleContact = (name: string) => {
        toast.success(`Opening mail client for ${name}...`);
    };

    return (
        <div className="space-y-8 font-sans text-gray-200">
            <div className="mb-12 border-l-4 border-pink-500 pl-6">
                <span className="text-pink-500 font-bold tracking-widest uppercase text-xs mb-2 block">Roster & Directory</span>
                <h1 className="text-4xl md:text-5xl font-serif text-white">The Ensemble</h1>
                <p className="text-gray-400 font-medium mt-2 max-w-2xl">
                    "From whom the whole body, joined and held together..." Connect with your section leaders and team members.
                </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                {['All', 'Vocals', 'Band', 'Tech', 'Media'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${activeTab === tab
                            ? 'bg-pink-600 border-pink-600 text-white shadow-lg shadow-pink-900/50'
                            : 'bg-transparent border-white/10 text-gray-500 hover:border-white/30 hover:text-white'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {loading && <p className="text-gray-500">Loading ensemble...</p>}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTeam.map((member) => (
                    <div key={member.id} className="bg-neutral-900/30 border border-white/10 rounded-2xl p-6 flex items-center gap-6 hover:bg-neutral-900/60 hover:border-pink-500/30 transition-all group">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-pink-500 transition-colors bg-neutral-800">
                                {member.image ? (
                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-600">{member.name.charAt(0)}</div>
                                )}
                            </div>
                            {(member.role === 'Worship Leader' || member.role === 'Musical Director') && (
                                <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-black rounded-full p-1 border-2 border-black" title="Leader">
                                    <HiStar className="w-3 h-3" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-0.5 group-hover:text-pink-400 transition-colors">{member.name}</h3>
                            <p className="text-pink-500 text-xs font-bold uppercase tracking-wider mb-2">{member.part}</p>
                            <p className="text-gray-500 text-xs mb-4">{member.role}</p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleContact(member.name)}
                                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors" title="Email"
                                >
                                    <HiMail className="w-4 h-4" />
                                </button>
                                <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors" title="Call">
                                    <HiPhone className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorshipTeam;
