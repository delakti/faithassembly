import React from 'react';
import { HiMail, HiPhone, HiUserGroup, HiBadgeCheck } from 'react-icons/hi';

const TEAM_DATA = [
    {
        name: "Team Alpha",
        shift: "Sunday Morning (Week A)",
        leader: "Dcn. Michael O.",
        members: [
            { id: 1, name: "Bro. David K.", role: "Senior Usher", phone: "07123 456789", email: "david.k@example.com", status: "active" },
            { id: 2, name: "Sis. Sarah J.", role: "Usher", phone: "07987 654321", email: "sarah.j@example.com", status: "active" },
            { id: 3, name: "Bro. Peter L.", role: "Trainee", phone: "07456 123789", email: "peter.l@example.com", status: "probation" },
        ]
    },
    {
        name: "Midweek Squad",
        shift: "Wednesday Bible Study",
        leader: "Sis. Ruth M.",
        members: [
            { id: 4, name: "Sis. Mary B.", role: "Usher", phone: "07555 123456", email: "mary.b@example.com", status: "active" },
            { id: 5, name: "Bro. John D.", role: "Usher", phone: "07888 999000", email: "john.d@example.com", status: "leave" },
        ]
    }
];

const UsherTeam: React.FC = () => {
    return (
        <div className="font-sans text-slate-900 space-y-8">
            <header className="border-b border-slate-200 pb-6">
                <h1 className="text-3xl font-serif font-bold text-slate-900">Squad Directory</h1>
                <p className="text-slate-500 font-medium mt-2">Team structure and contact information.</p>
            </header>

            <div className="grid gap-8">
                {TEAM_DATA.map((team, index) => (
                    <div key={index} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-slate-50 p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <HiUserGroup className="text-amber-600" /> {team.name}
                                </h2>
                                <p className="text-sm text-slate-500 font-medium mt-1 uppercase tracking-wide">{team.shift}</p>
                            </div>
                            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-slate-200">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Team Lead</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-xs font-bold">
                                        <HiBadgeCheck />
                                    </div>
                                    <span className="font-bold text-slate-800 text-sm">{team.leader}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                            {team.members.map((member) => (
                                <div key={member.id} className="border border-slate-100 rounded-xl p-4 hover:border-amber-200 hover:shadow-md transition-all group bg-white">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-bold text-slate-900">{member.name}</h3>
                                            <p className="text-xs text-amber-600 font-bold uppercase tracking-wide mt-0.5">{member.role}</p>
                                        </div>
                                        <span className={`w-2 h-2 rounded-full ${member.status === 'active' ? 'bg-green-500' :
                                                member.status === 'probation' ? 'bg-amber-400' : 'bg-slate-300'
                                            }`} title={member.status}></span>
                                    </div>

                                    <div className="space-y-2 pt-3 border-t border-slate-50">
                                        <a href={`tel:${member.phone}`} className="flex items-center gap-3 text-sm text-slate-500 hover:text-amber-600 transition-colors">
                                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-amber-50">
                                                <HiPhone />
                                            </div>
                                            {member.phone}
                                        </a>
                                        <a href={`mailto:${member.email}`} className="flex items-center gap-3 text-sm text-slate-500 hover:text-amber-600 transition-colors">
                                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-amber-50">
                                                <HiMail />
                                            </div>
                                            {member.email}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UsherTeam;
