import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { HiShieldCheck, HiArrowRight } from 'react-icons/hi';
import { toast, Toaster } from 'react-hot-toast';

const MenLogin: React.FC = () => {
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
                if (['mens_member', 'mens_leader', 'admin', 'super_admin'].includes(role)) {
                    toast.success('Welcome to HQ, Brother.');
                    navigate('/men/dashboard');
                } else {
                    toast.error('Access Restricted. Men of Valor Only.');
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
        <div className="min-h-screen bg-slate-900 flex flex-col md:flex-row shadow-2xl overflow-hidden font-sans">
            <Toaster position="top-right" toastOptions={{ className: '!font-bold !text-sm !bg-slate-800 !text-white' }} />

            {/* Image Side */}
            <div className="hidden md:block w-1/2 relative">
                <img
                    src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=2940&auto=format&fit=crop"
                    alt="Men Fellowship"
                    className="w-full h-full object-cover grayscale contrast-125"
                />
                <div className="absolute inset-0 bg-indigo-900/60 mix-blend-multiply"></div>
                <div className="absolute bottom-12 left-12 text-white max-w-lg">
                    <p className="font-bold text-sm tracking-widest uppercase mb-4 text-indigo-400">Proverbs 27:17</p>
                    <h2 className="text-5xl font-black leading-tight mb-6 italic uppercase">"As iron sharpens iron, so one person sharpens another."</h2>
                </div>
            </div>

            {/* Form Side */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-slate-950 relative">
                <div className="max-w-md w-full">
                    <div className="mb-10 text-center md:text-left">
                        <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20 mx-auto md:mx-0">
                            <HiShieldCheck className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-black text-white uppercase italic tracking-wide mb-2">Access HQ</h2>
                        <p className="text-slate-400 font-medium">Enter your credentials to proceed.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-4 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-bold"
                                placeholder="john.doe@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-4 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-bold"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-lg flex items-center justify-center text-white font-black uppercase tracking-wider transition-all shadow-lg ${loading
                                    ? 'bg-slate-700 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/30'
                                }`}
                        >
                            {loading ? 'Authenticating...' : 'Enter Portal'} <HiArrowRight className="ml-2 w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MenLogin;
