import React, { useState, useEffect } from 'react';
import { HiClock, HiCalendar, HiCheckCircle, HiRefresh, HiUser } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import type { PrayerSlot } from '../../types/prayer';

const PrayerSchedule: React.FC = () => {
    const [slots, setSlots] = useState<PrayerSlot[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'prayer_slots'), orderBy('day', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setSlots(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PrayerSlot)));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleCommit = async (id: string) => {
        try {
            await updateDoc(doc(db, 'prayer_slots', id), {
                status: 'Assigned',
                assignedTo: 'You' // In real app, use auth user name
            });
            toast.success('You have taken the watch.');
        } catch (error) {
            toast.error("Failed to take slot");
        }
    };

    const handleRelease = async (id: string) => {
        try {
            await updateDoc(doc(db, 'prayer_slots', id), {
                status: 'Open',
                assignedTo: null
            });
            toast('Watch slot released.', { icon: '🕊️' });
        } catch (error) {
            toast.error("Failed to release slot");
        }
    };

    const [filter, setFilter] = useState<'all' | 'mine'>('all');

    const mySlots = slots.filter(s => s.assignedTo === 'You');
    const myHours = mySlots.length; // Assuming 1 hour per slot for refined MVP

    return (
        <div className="space-y-8 font-sans text-slate-200">
            {/* Header & Stats */}
            <div className="flex flex-col md:flex-row gap-8 justify-between items-start">
                <div className="border-l-4 border-indigo-500 pl-6">
                    <span className="text-indigo-400 font-bold tracking-widest uppercase text-xs mb-2 block">Weekly Rota</span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">The Watch</h1>
                    <p className="text-slate-400 font-medium mt-2 max-w-2xl">
                        "I have posted watchmen on your walls, Jerusalem..." — Isaiah 62:6
                    </p>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl flex gap-8 shadow-xl">
                    <div className="text-center">
                        <span className="block text-3xl font-bold text-white">{mySlots.length}</span>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">My Slots</span>
                    </div>
                    <div className="w-px bg-slate-800"></div>
                    <div className="text-center">
                        <span className="block text-3xl font-bold text-indigo-400">{myHours}</span>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hrs / Week</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex border-b border-white/10">
                <button
                    onClick={() => setFilter('all')}
                    className={`pb-4 px-6 text-sm font-bold uppercase tracking-wider transition-colors ${filter === 'all' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    All Available
                </button>
                <button
                    onClick={() => setFilter('mine')}
                    className={`pb-4 px-6 text-sm font-bold uppercase tracking-wider transition-colors ${filter === 'mine' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    My Commitments
                </button>
            </div>

            {loading && <p className="text-slate-500 animate-pulse">Loading schedule...</p>}

            {!loading && slots.length === 0 && (
                <div className="bg-slate-900/50 p-12 text-center rounded-xl border border-slate-800">
                    <p className="text-slate-500 italic">No watch slots configured by leadership yet.</p>
                </div>
            )}

            {!loading && filter === 'mine' && mySlots.length === 0 && (
                <div className="bg-slate-900/50 p-12 text-center rounded-xl border border-slate-800">
                    <p className="text-slate-400 font-serif text-lg mb-2">You haven't committed to any slots yet.</p>
                    <button onClick={() => setFilter('all')} className="text-indigo-400 font-bold hover:underline">Browse available watches</button>
                </div>
            )}

            <div className="grid gap-4">
                {slots
                    .filter(s => filter === 'all' ? true : s.assignedTo === 'You')
                    .map((slot) => (
                        <div key={slot.id} className={`border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 transition-all ${slot.status === 'Assigned' && slot.assignedTo === 'You'
                            ? 'bg-indigo-900/10 border-indigo-500/50 shadow-lg shadow-indigo-900/10'
                            : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                            }`}>

                            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center">
                                <HiClock className={`w-8 h-8 ${slot.status === 'Assigned' && slot.assignedTo === 'You' ? 'text-indigo-400' : 'text-slate-600'}`} />
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                                    <span className="text-lg font-bold text-white">{slot.day} &bull; {slot.time}</span>
                                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block md:inline w-fit mx-auto md:mx-0 ${slot.status === 'Assigned' ? 'bg-slate-800 text-slate-400' : 'bg-green-900/30 text-green-400'
                                        }`}>
                                        {slot.status}
                                    </span>
                                </div>
                                <p className="text-indigo-200 font-medium">{slot.focus}</p>
                                {slot.assignedTo && (
                                    <p className="text-xs text-slate-500 mt-2 flex items-center justify-center md:justify-start gap-1">
                                        <HiUser className="w-3 h-3" /> Watchman: {slot.assignedTo}
                                    </p>
                                )}
                            </div>

                            <div className="flex-shrink-0 w-full md:w-auto">
                                {/* Logic: If open, show Stand. If mine, show Release. If someone else, show nothing or 'Taken' */}
                                {slot.status === 'Open' ? (
                                    <button
                                        onClick={() => handleCommit(slot.id)}
                                        className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <HiCheckCircle className="w-5 h-5" /> Stand in Gap
                                    </button>
                                ) : (
                                    slot.assignedTo === 'You' ? (
                                        <button
                                            onClick={() => handleRelease(slot.id)}
                                            className="w-full md:w-auto px-6 py-3 bg-slate-800 text-slate-400 font-bold rounded-xl hover:text-red-400 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <HiRefresh className="w-5 h-5" /> Release Slot
                                        </button>
                                    ) : (
                                        <span className="text-slate-600 text-sm font-bold italic">Slot Filled</span>
                                    )
                                )}
                            </div>
                        </div>
                    ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="font-bold text-white mb-1">Need coverage?</h3>
                    <p className="text-slate-500 text-sm">If you cannot make your assigned watch, please release it early so others may stand in.</p>
                </div>
                <button className="text-indigo-400 font-bold text-sm hover:text-indigo-300 transition-colors flex items-center gap-2">
                    <HiCalendar className="w-5 h-5" /> View Full Calendar
                </button>
            </div>
        </div>
    );
};

export default PrayerSchedule;
