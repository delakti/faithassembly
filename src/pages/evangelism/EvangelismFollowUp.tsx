import React, { useState, useEffect } from 'react';
import { HiPhone, HiClock, HiArrowRight } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import type { EvangelismConvert } from '../../types/evangelism';

const EvangelismFollowUp: React.FC = () => {
    const [converts, setConverts] = useState<EvangelismConvert[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'evangelism_converts'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setConverts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EvangelismConvert)));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleAction = (name: string, action: string) => {
        toast.success(`${action} recorded for ${name}`);
    };

    return (
        <div className="space-y-8 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <span className="text-orange-500 font-bold text-xs mb-2 block tracking-widest uppercase">Harvest Tracker</span>
                    <h1 className="text-3xl font-black text-white uppercase italic tracking-tight">New Convert Log</h1>
                </div>

                <div className="px-6 py-3 bg-stone-900 border border-stone-800 text-stone-500 font-bold text-xs rounded-lg">
                    Admin Access Required for Full New Entry
                </div>
            </div>

            {loading && <p className="text-stone-500 animate-pulse">Loading harvest records...</p>}
            {converts.length === 0 && !loading && <p className="text-stone-500 italic">No recent converts logged.</p>}

            <div className="grid gap-4">
                {converts.map((person) => (
                    <div key={person.id} className="bg-stone-950 border border-stone-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-stone-700 transition-all">
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 font-bold text-lg ${person.status === 'New' ? 'border-red-500 text-red-500 bg-red-900/20' :
                                person.status === 'Contacted' ? 'border-yellow-500 text-yellow-500 bg-yellow-900/20' :
                                    'border-green-500 text-green-500 bg-green-900/20'
                                }`}>
                                {person.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">{person.name}</h3>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500 font-bold uppercase tracking-wide">
                                    <span>Date: {person.date}</span>
                                    <span>&bull;</span>
                                    <span>Loc: {person.location}</span>
                                    <span>&bull;</span>
                                    <span className="text-stone-400">Assigned: {person.assignedTo}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                            <div className="px-3 py-1 bg-stone-900 rounded border border-stone-800 text-xs font-bold uppercase tracking-wider text-stone-400">
                                Stat: <span className={
                                    person.status === 'New' ? 'text-red-500' :
                                        person.status === 'Contacted' ? 'text-yellow-500' :
                                            'text-green-500'
                                }>{person.status}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleAction(person.name, 'Call Attempt')}
                                    className="p-2 bg-stone-900 border border-stone-800 text-stone-400 hover:text-white hover:border-stone-600 rounded transition-colors"
                                    title="Log Call"
                                >
                                    <HiPhone className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleAction(person.name, 'Visit Scheduled')}
                                    className="p-2 bg-stone-900 border border-stone-800 text-stone-400 hover:text-white hover:border-stone-600 rounded transition-colors"
                                    title="Schedule Visit"
                                >
                                    <HiClock className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleAction(person.name, 'Status Updated')}
                                    className="px-4 py-2 bg-stone-900 border border-stone-800 text-stone-400 hover:text-orange-500 hover:border-orange-500 rounded transition-colors font-bold uppercase text-xs flex items-center gap-1"
                                >
                                    Update <HiArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EvangelismFollowUp;
