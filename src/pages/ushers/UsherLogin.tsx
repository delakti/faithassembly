import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { HiIdentification, HiArrowRight, HiLockClosed } from 'react-icons/hi';
import { toast, Toaster } from 'react-hot-toast';

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
                const role = userDoc.data().role;
                if (['usher_member', 'usher_leader', 'admin', 'super_admin'].includes(role)) {
                    toast.success('Access Granted.');
                    navigate('/ushers/dashboard');
                } else {
                    toast.error('Restricted Area: Ushering Team Only.');
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
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 font-sans">
            <Toaster position="top-right" />

            <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
                {/* Left Side - Image */}
                <div className="md:w-1/2 bg-blue-900 relative">
                    <div className="absolute inset-0">
                        <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2940&auto=format&fit=crop" className="w-full h-full object-cover mix-blend-overlay opacity-50" alt="Ushering" />
                    </div>
                    <div className="relative z-10 p-12 h-full flex flex-col justify-between text-white">
                        <div>
                            <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-lg flex items-center justify-center mb-6">
                                <HiIdentification className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold mb-2">Usher & Protocol</h2>
                            <p className="text-blue-100">Managing excellence in service.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm text-blue-200">
                                <HiLockClosed className="w-5 h-5" />
                                <span>Designated Personnel Only</span>
                            </div>
                            <p className="text-xs text-blue-300/60 leading-relaxed">
                                "Better is one day in your courts than a thousand elsewhere; I would rather be a doorkeeper in the house of my God than dwell in the tents of the wicked." — Psalm 84:10
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="md:w-1/2 p-12 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold text-slate-800 mb-8">Sign In</h3>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                                placeholder="usher@faithassembly.org"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded-lg flex items-center justify-center text-white font-bold tracking-wide transition-all shadow-lg shadow-blue-600/20 mt-6 ${loading
                                    ? 'bg-slate-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {loading ? 'Verifying...' : 'Access Portal'} <HiArrowRight className="ml-2 w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UsherLogin;
