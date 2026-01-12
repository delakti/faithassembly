import React, { useState, useEffect } from 'react';
import { HiUserGroup, HiBadgeCheck, HiMail, HiHeart, HiSparkles } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import sisiImage from '../../assets/sisi-david.png';

interface Member {
    id: string;
    name: string;
    role: string;
    team: string; // 'Greeting', 'Coffee', etc.
}

const HospitalityTeam: React.FC = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const q = query(collection(db, 'hospitality_team'), orderBy('name'));
                const snapshot = await getDocs(q);
                setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member)));
            } catch (error) {
                console.error("Error fetching team", error);
                toast.error("Failed to load team data");
            } finally {
                setLoading(false);
            }
        };
        fetchTeam();
    }, []);

    const handleContact = (name: string) => {
        toast.success(`Starting chat with ${name}...`);
    };

    // Group members by team
    const teamsDict: Record<string, Member[]> = {};
    members.forEach(m => {
        if (!teamsDict[m.team]) teamsDict[m.team] = [];
        teamsDict[m.team].push(m);
    });

    const teamDescriptions: Record<string, string> = {
        'Greeting': "The first smile of the day.",
        'Coffee': "Serving warmth one cup at a time.",
        'Cooking': "Nourishing the body and soul.",
        'Setup': "Preferring one another in service.",
        'Events': "Excellence for special occasions."
    };

    return (
        <div className="space-y-12 font-sans text-stone-800 animate-fade-in">
            {/* Header Section */}
            <div className="border-l-4 border-orange-400 pl-6">
                <span className="text-orange-500 font-bold tracking-widest uppercase text-xs mb-2 block">Our Family</span>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900">Volunteer Teams</h1>
                <p className="text-stone-500 font-medium mt-2 max-w-2xl">
                    "Just as a body, though one, has many parts, but all its many parts form one body, so it is with Christ." — 1 Corinthians 12:12
                </p>
            </div>

            {/* Department Lead Hero */}
            <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-orange-500 rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/2"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                    <div className="shrink-0 relative">
                        <div className="w-48 h-48 md:w-56 md:h-56 rounded-full border-4 border-orange-500/30 p-2">
                            <img
                                src={sisiImage}
                                alt="Sisi David"
                                className="w-full h-full object-cover rounded-full border-4 border-stone-800 shadow-2xl"
                            />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white p-3 rounded-full shadow-lg">
                            <HiSparkles className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="text-center md:text-left space-y-4">
                        <span className="inline-block px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-bold uppercase tracking-widest border border-orange-500/20">
                            Hospitality Lead
                        </span>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold">Sisi David</h2>
                        <p className="text-stone-300 max-w-lg leading-relaxed text-lg">
                            "Welcome to the Hospitality Ministry! My heart is to ensure every person who walks through our doors feels the love of Christ and the warmth of family. We are here to serve you."
                        </p>
                        <button
                            onClick={() => handleContact("Sisi David")}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-stone-900 rounded-xl font-bold hover:bg-orange-50 transition-colors shadow-lg"
                        >
                            <HiMail className="w-5 h-5 text-orange-500" /> Connect with Sisi
                        </button>
                    </div>
                </div>
            </div>

            {/* Dynamic Teams Grid */}
            <div className="grid gap-8">
                {Object.keys(teamsDict).length === 0 && !loading ? (
                    <div className="text-center py-12 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                        <p className="text-stone-400">Teams are being assembled. Check back soon!</p>
                    </div>
                ) : (
                    Object.entries(teamsDict).map(([teamName, teamMembers]) => {
                        // Find a team lead if exists, otherwise first member or none
                        const lead = teamMembers.find(m => m.role === 'Team Lead');
                        const otherMembers = teamMembers.filter(m => m !== lead);

                        return (
                            <div key={teamName} className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="bg-stone-50 p-6 border-b border-stone-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-orange-500 shadow-sm">
                                            <HiUserGroup className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-stone-900">{teamName} Team</h2>
                                            <p className="text-sm text-stone-500">{teamDescriptions[teamName] || "Serving with excellence."}</p>
                                        </div>
                                    </div>
                                    <button className="hidden md:flex px-4 py-2 bg-white border border-stone-200 text-stone-600 text-sm font-bold rounded-lg hover:border-orange-300 hover:text-orange-600 transition-colors items-center gap-2">
                                        <HiMail className="w-4 h-4" /> Message Group
                                    </button>
                                </div>

                                <div className="p-6 md:p-8 grid md:grid-cols-4 gap-8">
                                    {/* Leader Card - If exists */}
                                    {lead ? (
                                        <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-stone-100 pb-6 md:pb-0 md:pr-8">
                                            <span className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-4 block flex items-center gap-1">
                                                <HiBadgeCheck className="w-4 h-4" /> Team Lead
                                            </span>
                                            <div className="flex flex-col items-center text-center">
                                                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg mb-3 bg-stone-200 flex items-center justify-center text-2xl font-bold text-stone-400">
                                                    {lead.name.charAt(0)}
                                                </div>
                                                <h3 className="font-bold text-lg text-stone-900">{lead.name}</h3>
                                                <p className="text-sm text-stone-500 mb-4">{lead.role}</p>
                                                <button
                                                    onClick={() => handleContact(lead.name)}
                                                    className="w-full py-2 rounded-lg bg-stone-800 text-white text-xs font-bold uppercase tracking-wider hover:bg-stone-900 transition-colors"
                                                >
                                                    Contact
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-stone-100 pb-6 md:pb-0 md:pr-8 flex flex-col justify-center items-center text-center">
                                            <span className="text-xs font-bold text-stone-300 uppercase tracking-widest mb-2">Team Lead</span>
                                            <p className="text-sm text-stone-400 italic">Position Open</p>
                                        </div>
                                    )}

                                    {/* Members Grid */}
                                    <div className="md:col-span-3">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest block">Team Members</span>
                                            <span className="text-xs bg-stone-100 text-stone-500 px-2 py-1 rounded-full font-bold">{otherMembers.length} Active</span>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            {otherMembers.map((member) => (
                                                <div key={member.id} className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100 group hover:border-orange-200 transition-colors">
                                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-stone-400 text-xs font-bold border border-stone-100 group-hover:bg-orange-50 group-hover:text-orange-500">
                                                        {member.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <span className="block text-sm font-bold text-stone-800 group-hover:text-orange-900">{member.name}</span>
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
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default HospitalityTeam;
