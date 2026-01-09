import React, { useState } from 'react';
import { HiMail, HiPhone, HiBadgeCheck, HiUserGroup } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const TEAM = [
    {
        id: 1,
        name: "Deacon James Wilson",
        role: "Head Usher",
        squad: "Leadership",
        image: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=800&auto=format&fit=crop&q=60",
        phone: "555-0123",
        email: "james.w@faith.com"
    },
    {
        id: 2,
        name: "Sarah Andrews",
        role: "Team Captain (Morning)",
        squad: "Leadership",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60",
        phone: "555-0124",
        email: "sarah.a@faith.com"
    },
    {
        id: 3,
        name: "Kevin Peterson",
        role: "Usher",
        squad: "Sanctuary A",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60",
        phone: "555-0125",
        email: "kevin.p@faith.com"
    },
    {
        id: 4,
        name: "Lisa Wong",
        role: "Greeter",
        squad: "Foyer",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop&q=60",
        phone: "555-0126",
        email: "lisa.w@faith.com"
    },
    {
        id: 5,
        name: "Robert Fox",
        role: "Security Liaison",
        squad: "Parking",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=60",
        phone: "555-0127",
        email: "robert.f@faith.com"
    },
    {
        id: 6,
        name: "Anita Raj",
        role: "Usher",
        squad: "Sanctuary B",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60",
        phone: "555-0128",
        email: "anita.r@faith.com"
    }
];

const UsherTeam: React.FC = () => {
    const [activeTab, setActiveTab] = useState('All');

    const filteredTeam = activeTab === 'All' ? TEAM : TEAM.filter(m => m.squad.includes(activeTab) || (activeTab === 'Sanctuary' && m.squad.includes('Sanctuary')));

    const handleContact = (name: string, type: 'call' | 'email') => {
        toast.success(`${type === 'call' ? 'Calling' : 'Emailing'} ${name}...`);
    };

    return (
        <div className="space-y-8 font-sans text-slate-800">
            <div className="mb-8 border-l-4 border-slate-800 pl-6">
                <span className="text-slate-500 font-bold tracking-widest uppercase text-xs mb-2 block">Directory</span>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900">The Team</h1>
                <p className="text-slate-500 font-medium mt-2 max-w-2xl">
                    Know your squad. Stay connected. Service is a team effort.
                </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                {['All', 'Leadership', 'Sanctuary', 'Foyer', 'Parking'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${activeTab === tab
                            ? 'bg-slate-800 text-white shadow-lg'
                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-700'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTeam.map((member) => (
                    <div key={member.id} className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-start gap-4">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-100 group-hover:border-blue-500 transition-colors">
                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                </div>
                                {(member.role.includes('Head') || member.role.includes('Captain')) && (
                                    <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1 border-2 border-white" title="Leader">
                                        <HiBadgeCheck className="w-3 h-3" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 leading-tight">{member.name}</h3>
                                <p className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">{member.role}</p>
                                <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-slate-50 px-2 py-1 rounded">
                                    <HiUserGroup className="w-3 h-3" /> {member.squad}
                                </span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 mt-auto">
                            <button
                                onClick={() => handleContact(member.name, 'email')}
                                className="flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-50 text-slate-600 text-sm font-bold hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            >
                                <HiMail className="w-4 h-4" /> Message
                            </button>
                            <button
                                onClick={() => handleContact(member.name, 'call')}
                                className="flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-50 text-slate-600 text-sm font-bold hover:bg-green-50 hover:text-green-600 transition-colors"
                            >
                                <HiPhone className="w-4 h-4" /> Call
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UsherTeam;
