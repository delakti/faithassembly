import React, { useState, useEffect } from 'react';
import { HiPlus, HiUsers } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { db } from '../../firebase';
import { collection, query, getDocs, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import type { EstherGroup } from '../../types/esther';

const EstherGroups: React.FC = () => {
    const [groups, setGroups] = useState<EstherGroup[]>([]); // Note: We might want to extend this with local state 'joined'
    // For now we will allow joining with a mock user. In a real app we'd check if currentUser is in `esther_group_members`

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const q = query(collection(db, 'esther_groups'), orderBy('name', 'asc'));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EstherGroup));
                setGroups(data);
            } catch (error) {
                console.error("Error fetching groups:", error);
            }
        };
        fetchGroups();
    }, []);

    const toggleJoin = async (group: EstherGroup) => {
        // Mock join logic - this adds a record to esther_group_members
        // In reality, checks would be done.
        const userName = prompt("Enter your name to join this group:");
        if (!userName) return;

        try {
            await addDoc(collection(db, 'esther_group_members'), {
                groupId: group.id,
                userId: 'mock_user_' + Date.now(),
                userName: userName,
                joinedAt: serverTimestamp()
            });
            toast.success(`Welcome to ${group.name}!`);
        } catch (error) {
            console.error("Error joining group:", error);
            toast.error("Could not join group.");
        }
    };

    const handlePropose = async () => {
        const proposal = prompt("What kind of group would you like to start? (e.g. 'Monday Night Bible Study for Moms')");
        if (!proposal) return;

        try {
            await addDoc(collection(db, 'esther_group_proposals'), {
                proposal: proposal,
                proposerId: "mock_user_" + Date.now(),
                createdAt: serverTimestamp(),
                status: 'pending'
            });
            toast.success("Thank you! Your proposal has been sent to leadership.");
        } catch (error) {
            console.error("Error submitting proposal:", error);
            toast.error("Could not submit proposal.");
        }
    };

    return (
        <div className="space-y-8 font-sans">
            <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-rose-500 font-bold tracking-widest uppercase text-xs mb-2 block">Circle of Friends</span>
                <h1 className="text-4xl md:text-5xl font-serif text-rose-950 mb-4">Connect & Grow</h1>
                <p className="text-gray-500">
                    "As iron sharpens iron..." Join a mentoring circle or small group to walk this journey together.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {groups.map((group) => (
                    <div key={group.id} className="bg-white rounded-3xl overflow-hidden border border-rose-100 shadow-sm hover:shadow-lg transition-all group flex flex-col">
                        <div className="h-48 overflow-hidden relative">
                            <img src={group.image} alt={group.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-rose-600 flex items-center shadow-sm">
                                <HiUsers className="w-4 h-4 mr-1" /> {group.memberCount || group.members || 0}
                            </div>
                        </div>
                        <div className="p-8 flex-1 flex flex-col">
                            <h3 className="text-xl font-serif text-rose-950 mb-2">{group.name}</h3>
                            <p className="text-rose-500 text-sm font-bold mb-4">{group.schedule} • Lead: {group.leader}</p>
                            <p className="text-gray-500 text-sm mb-6 leading-relaxed flex-1">
                                {group.desc}
                            </p>

                            <button
                                onClick={() => toggleJoin(group)}
                                className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 bg-rose-500 text-white hover:bg-rose-600 shadow-md shadow-rose-200`}
                            >
                                <><HiPlus className="w-5 h-5" /> Join Circle</>
                            </button>
                        </div>
                    </div>
                ))}

                {/* Create New Group Card */}
                <div className="bg-rose-50 rounded-3xl overflow-hidden border border-rose-200 border-dashed flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                        <HiPlus className="w-8 h-8 text-rose-400" />
                    </div>
                    <h3 className="text-xl font-serif text-rose-950 mb-2">Start a New Circle</h3>
                    <p className="text-gray-500 text-sm mb-6 max-w-xs">
                        Called to lead? Propose a new prayer circle or bible study group.
                    </p>
                    <button
                        onClick={handlePropose}
                        className="px-6 py-3 bg-white text-rose-600 font-bold rounded-xl hover:bg-rose-100 transition-colors shadow-sm"
                    >
                        Propose Group
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EstherGroups;
