
import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { HiLockClosed, HiShieldCheck, HiArrowRight } from 'react-icons/hi';

const UsherLogin: React.FC = () => {
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
                const userData = userDoc.data();
                const role = userData.role;

                if (['super_admin', 'admin', 'usher_leader', 'usher_member'].includes(role)) {
                    toast.success('Welcome, Gatekeeper.');
                    navigate('/ushering/dashboard');
                } else {
                    toast.error('Access Denied: Ushering Team Only');
                    await auth.signOut();
                }
            } else {
                toast.error('User profile not found.');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            toast.error('Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            <Toaster position="top-center" />

            {/* Background Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black opacity-80"></div>

            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative z-10">
                <div className="p-8 text-center border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                    <div className="w-20 h-20 bg-slate-950 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                        <HiShieldCheck className="w-10 h-10 text-amber-500" />
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-white tracking-wide">THE GATEKEEPERS</h1>
                    <p className="text-amber-500/80 text-xs font-bold uppercase tracking-[0.2em] mt-2">Ushering Department Portal</p>
                </div>

                <form onSubmit={handleLogin} className="p-8 space-y-6">
                    <div>
                        <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Officer Identity</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-950 text-white border border-slate-800 rounded-lg px-4 py-4 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder-slate-700 font-medium"
                            placeholder="officer@faithassembly.org"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Secure Key</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-950 text-white border border-slate-800 rounded-lg px-4 py-4 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder-slate-700 font-medium"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-3 uppercase tracking-wider text-xs disabled:opacity-50 disabled:cursor-not-allowed mt-4 group"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <HiLockClosed className="w-4 h-4 text-amber-200 group-hover:text-white transition-colors" /> Access Portal <HiArrowRight className="w-4 h-4 ml-1 opacity-60 group-hover:opacity-100 transition-opacity translate-x-0 group-hover:translate-x-1" />
                            </>
                        )}
                    </button>

                    <div className="text-center pt-4">
                        <p className="text-slate-600 text-[10px] uppercase tracking-widest">
                            Restricted Access • Logged Session
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UsherLogin;
