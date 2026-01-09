import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { HiLightningBolt, HiArrowRight, HiLockClosed } from 'react-icons/hi';
import { toast, Toaster } from 'react-hot-toast';

const MediaLogin: React.FC = () => {
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
                if (['media_member', 'media_leader', 'admin', 'super_admin'].includes(role)) {
                    toast.success('System Access Granted.');
                    navigate('/media/dashboard');
                } else {
                    toast.error('Unauthorized: Media Team Access Only.');
                    await auth.signOut();
                }
            } else {
                toast.error('Access Denied.');
                await auth.signOut();
            }
        } catch (error: any) {
            toast.error('Authentication Failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans relative overflow-hidden">
            <Toaster position="bottom-right" toastOptions={{
                style: {
                    background: '#0f172a',
                    color: '#22d3ee',
                    border: '1px solid #1e293b',
                    fontFamily: 'monospace'
                },
                iconTheme: {
                    primary: '#22d3ee',
                    secondary: '#0f172a',
                },
            }} />

            {/* Tech Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>

            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 md:p-12 shadow-2xl relative z-10">
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-slate-950 rounded-xl flex items-center justify-center border border-slate-800 shadow-lg shadow-cyan-900/10">
                        <HiLightningBolt className="w-8 h-8 text-cyan-500" />
                    </div>
                </div>

                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Media<span className="text-cyan-500">Box</span></h2>
                    <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">Authorized Personnel Only</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">ID / Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all placeholder-slate-800 font-mono text-sm"
                            placeholder="techie@faithassembly.org"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">Passcode</label>
                            <HiLockClosed className="w-3 h-3 text-slate-600" />
                        </div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all placeholder-slate-800 font-mono text-sm"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3.5 rounded-lg flex items-center justify-center text-slate-950 font-bold tracking-wide transition-all shadow-lg mt-6 font-mono uppercase text-sm ${loading
                                ? 'bg-slate-800 cursor-not-allowed text-slate-500'
                                : 'bg-cyan-500 hover:bg-cyan-400 hover:shadow-cyan-500/20'
                            }`}
                    >
                        {loading ? 'Verifying...' : 'Initialize Session'} <HiArrowRight className="ml-2 w-4 h-4" />
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                    <div className="flex items-center justify-center gap-2 text-[10px] uppercase font-mono text-slate-600">
                        <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                        Secure Connection Est. 2026
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MediaLogin;
