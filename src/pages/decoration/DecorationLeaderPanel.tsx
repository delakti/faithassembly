import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { HiShieldCheck, HiUserGroup, HiMail } from 'react-icons/hi';

interface TeamMember {
    uid: string;
    displayName: string;
    email: string;
    role: string;
    photoURL?: string;
}

const DecorationLeaderPanel: React.FC = () => {
    const db = getFirestore();
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const usersRef = collection(db, 'users');
                // Fetch members and leaders
                // Note: 'in' query allows up to 10 values
                const q = query(usersRef, where('role', 'in', ['decor_member', 'decor_leader', 'hospitality_leader']));
                const snapshot = await getDocs(q);

                const members = snapshot.docs.map(doc => ({
                    uid: doc.id,
                    ...doc.data()
                })) as TeamMember[];

                setTeam(members);
            } catch (error) {
                console.error("Error fetching team:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeam();
    }, [db]);

    return (
        <div className="space-y-8">
            <div className="bg-fuchsia-900 text-white p-8 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-800 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-serif font-bold mb-2">Decoration Leadership</h1>
                    <p className="text-fuchsia-200">Manage your team and oversee ministry operations.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Team Roster */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <HiUserGroup className="text-fuchsia-600" /> Team Roster
                    </h2>

                    {loading ? (
                        <div className="text-center py-8 text-slate-400">Loading team...</div>
                    ) : team.length === 0 ? (
                        <div className="text-center py-8 text-slate-500 italic">No team members found.</div>
                    ) : (
                        <div className="space-y-4">
                            {team.map(member => (
                                <div key={member.uid} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden">
                                            {member.photoURL ? (
                                                <img src={member.photoURL} alt={member.displayName} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center font-bold text-slate-400">{member.displayName?.[0]}</div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{member.displayName}</p>
                                            <p className="text-xs text-slate-500">{member.email}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${member.role.includes('leader')
                                            ? 'bg-fuchsia-100 text-fuchsia-700'
                                            : 'bg-slate-100 text-slate-600'
                                        }`}>
                                        {member.role.replace('decor_', '').replace('_', ' ')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions / Tips */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <HiShieldCheck className="text-green-600" /> Ministry Health
                        </h2>
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <div className="text-2xl font-bold text-slate-800">{team.length}</div>
                                <div className="text-xs text-slate-500 font-bold uppercase">Active Members</div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <div className="text-2xl font-bold text-slate-800">--</div>
                                <div className="text-xs text-slate-500 font-bold uppercase">Upcoming Duties</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2"><HiMail /> Communication Tip</h3>
                        <p className="text-sm text-blue-800">
                            Use the <span className="font-bold">Announcements</span> tab to keep everyone in sync. Pinned messages trigger higher visibility.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DecorationLeaderPanel;
