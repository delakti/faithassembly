import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { HiMusicNote, HiArrowRight } from 'react-icons/hi';
import { toast, Toaster } from 'react-hot-toast';

const WorshipLogin: React.FC = () => {
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
                if (['worship_member', 'worship_leader', 'admin', 'super_admin'].includes(role)) {
                    toast.success('Welcome to the Studio.');
                    navigate('/worship/dashboard');
                } else {
                    toast.error('Restricted Area: Musicians & Tech Only.');
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
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden text-white font-sans">
            <Toaster position="bottom-center" toastOptions={{ className: '!bg-neutral-800 !text-white !border !border-white/10' }} />

            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2940&auto=format&fit=crop" className="w-full h-full object-cover opacity-20 blur-sm" alt="Worship Background" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
            </div>

            <div className="max-w-md w-full relative z-10 bg-neutral-900/50 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30">
                        <HiMusicNote className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-serif text-white mb-2">Backstage Access</h2>
                    <p className="text-gray-400">Faith Assembly Worship & Creative Arts</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-5 py-4 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                            placeholder="vocalist@faithassembly.org"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-4 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-xl flex items-center justify-center text-white font-bold tracking-wide transition-all shadow-lg mt-4 ${loading
                                ? 'bg-neutral-800 cursor-not-allowed'
                                : 'bg-white text-black hover:bg-gray-200'
                            }`}
                    >
                        {loading ? 'Tuning In...' : 'Enter Studio'} <HiArrowRight className="ml-2 w-5 h-5" />
                    </button>
                </form>

                <p className="mt-8 text-center text-xs text-gray-600">
                    "Sing to the Lord a new song; sing to the Lord, all the earth." — Psalm 96:1
                </p>
            </div>
        </div>
    );
};

export default WorshipLogin;
