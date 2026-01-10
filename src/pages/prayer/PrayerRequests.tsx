import React, { useState, useEffect } from 'react';
import { HiPlus, HiLockClosed, HiHand, HiCheck, HiGlobe } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { collection, query, orderBy, onSnapshot, addDoc, doc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import type { PrayerRequest } from '../../types/prayer';

const PrayerRequests: React.FC = () => {
    const [requests, setRequests] = useState<PrayerRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [newRequest, setNewRequest] = useState({
        author: '', category: 'General', content: '', isPrivate: false
    });

    useEffect(() => {
        const q = query(collection(db, 'prayer_requests'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PrayerRequest)));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handlePray = async (id: string) => {
        try {
            const reqRef = doc(db, 'prayer_requests', id);
            await updateDoc(reqRef, {
                praying: increment(1)
            });
            toast.success('Prayer recorded. Heaven hears.');
        } catch (error) {
            toast.error("Failed to action");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'prayer_requests'), {
                ...newRequest,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
                praying: 0,
                answered: false,
                createdAt: serverTimestamp()
            });
            toast.success("Request Submitted");
            setIsFormOpen(false);
            setNewRequest({ author: '', category: 'General', content: '', isPrivate: false });
        } catch (error) {
            toast.error("Failed to submit request");
        }
    };

    return (
        <div className="space-y-8 font-sans text-slate-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                <div className="border-l-4 border-indigo-500 pl-6">
                    <span className="text-indigo-400 font-bold tracking-widest uppercase text-xs mb-2 block">Intercession</span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">Prayer Wall</h1>
                    <p className="text-slate-400 font-medium mt-2 max-w-2xl">
                        "Bear one another's burdens, and so fulfill the law of Christ." — Galatians 6:2
                    </p>
                </div>
                <button
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-900/30 hover:bg-indigo-500 transition-colors flex items-center gap-2"
                >
                    <HiPlus className="w-5 h-5" /> Share Burden
                </button>
            </div>

            {isFormOpen && (
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 mb-8 animate-in slide-in-from-top-4">
                    <h3 className="font-bold text-white mb-4">Submit Prayer Request</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Your Name (or Anonymous)"
                                value={newRequest.author}
                                onChange={e => setNewRequest({ ...newRequest, author: e.target.value })}
                                className="bg-slate-950 border border-slate-700 rounded p-2 text-white"
                                required
                            />
                            <select
                                value={newRequest.category}
                                onChange={e => setNewRequest({ ...newRequest, category: e.target.value })}
                                className="bg-slate-950 border border-slate-700 rounded p-2 text-white"
                            >
                                <option value="General">General</option>
                                <option value="Healing">Healing</option>
                                <option value="Deliverance">Deliverance</option>
                                <option value="Salvation">Salvation</option>
                                <option value="Family">Family</option>
                            </select>
                        </div>
                        <textarea
                            placeholder="What should we pray for?"
                            value={newRequest.content}
                            onChange={e => setNewRequest({ ...newRequest, content: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white h-24"
                            required
                        />
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={newRequest.isPrivate}
                                onChange={e => setNewRequest({ ...newRequest, isPrivate: e.target.checked })}
                                id="private"
                            />
                            <label htmlFor="private" className="text-sm text-slate-400">Mark as Private (Only Leaders can see)</label>
                        </div>
                        <button className="w-full py-2 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-700">Submit</button>
                    </form>
                </div>
            )}

            {loading && <p className="text-slate-500 animate-pulse">Loading requests...</p>}
            {requests.length === 0 && !loading && <p className="text-slate-500 italic">No active requests.</p>}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {requests.map((req) => (
                    <div key={req.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col relative group hover:border-indigo-500/30 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold border border-slate-700">
                                    {req.author.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">{req.author}</h3>
                                    <span className="text-xs text-slate-500 uppercase tracking-wide">{req.date}</span>
                                </div>
                            </div>
                            {req.isPrivate ? (
                                <HiLockClosed className="w-4 h-4 text-slate-600" title="Private Request" />
                            ) : (
                                <HiGlobe className="w-4 h-4 text-slate-600" title="Public Request" />
                            )}
                        </div>

                        <div className="mb-6 flex-1">
                            <span className="inline-block px-2 py-1 bg-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider rounded mb-3">
                                {req.category}
                            </span>
                            <p className="text-slate-300 leading-relaxed text-sm">
                                {req.content}
                            </p>
                        </div>

                        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                            <span className="text-xs font-bold text-indigo-400 flex items-center gap-1">
                                <HiHand className="w-4 h-4" /> {req.praying} Praying
                            </span>
                            <button
                                onClick={() => handlePray(req.id)}
                                className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-2"
                            >
                                <HiCheck className="w-3 h-3" /> I Prayed
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PrayerRequests;
