import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { HiFire, HiArrowRight } from 'react-icons/hi';
import { toast, Toaster } from 'react-hot-toast';

const PrayerLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const auth = getAuth();
    const db = getFirestore();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                const role = userDoc.data().role;
                if (['prayer_member', 'prayer_leader', 'admin', 'super_admin'].includes(role)) {
                    toast.success('Entering the Inner Room...');
                    navigate('/prayer/dashboard');
                } else {
                    toast.error('Access Restricted: Prayer Team Only.');
                    await auth.signOut();
                }
            } else {
                toast.error('Access Restricted.');
                await auth.signOut();
            }
        } catch (error: any) {
            toast.error('Invalid credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans relative overflow-hidden">
            <Toaster position="top-right" toastOptions={{
                style: {
                    background: '#1e293b',
                    color: '#fff',
                    border: '1px solid #334155'
                },
            }} />

            {/* Background Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-900/20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[100px]"></div>

            <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl relative z-10">
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 shadow-lg shadow-indigo-900/20">
                        <HiFire className="w-8 h-8 text-indigo-400" />
                    </div>
                </div>

                <div className="text-center mb-10">
                    <h2 className="text-3xl font-serif font-bold text-white mb-2">The Upper Room</h2>
                    <p className="text-slate-400 text-sm">Prayer Team Access</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder-slate-700"
                            placeholder="intercessor@faithassembly.org"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder-slate-700"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3.5 rounded-xl flex items-center justify-center text-white font-bold tracking-wide transition-all shadow-lg shadow-indigo-900/20 mt-6 ${loading
                                ? 'bg-slate-800 cursor-not-allowed text-slate-500'
                                : 'bg-indigo-600 hover:bg-indigo-500 hover:scale-[1.02]'
                            }`}
                    >
                        {loading ? 'Authenticating...' : 'Enter Sanctuary'} <HiArrowRight className="ml-2 w-4 h-4" />
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-slate-800 text-center">
                    <p className="text-slate-600 text-xs italic font-serif">
                        "The prayer of a righteous person is powerful and effective."
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrayerLogin;
