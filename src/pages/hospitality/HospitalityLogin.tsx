import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { HiHeart, HiArrowRight } from 'react-icons/hi';
import { toast, Toaster } from 'react-hot-toast';

const HospitalityLogin: React.FC = () => {
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
                if (['hospitality_member', 'hospitality_leader', 'admin', 'super_admin'].includes(role)) {
                    toast.success('Welcome Home.');
                    navigate('/hospitality/dashboard');
                } else {
                    toast.error('Access Restricted: Hospitality Team Only.');
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
        <div className="min-h-screen bg-[#F0EBE3] flex items-center justify-center p-6 font-sans">
            <Toaster position="top-right" toastOptions={{
                style: {
                    background: '#363636',
                    color: '#fff',
                },
            }} />

            <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
                {/* Left Side - Image */}
                <div className="md:w-1/2 bg-orange-100 relative">
                    <div className="absolute inset-0">
                        <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2940&auto=format&fit=crop" className="w-full h-full object-cover opacity-90 sepia-[.3]" alt="Hospitality" />
                    </div>
                    <div className="absolute inset-0 bg-orange-900/40"></div>
                    <div className="relative z-10 p-12 h-full flex flex-col justify-between text-white">
                        <div>
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6 border border-white/30">
                                <HiHeart className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-4xl font-serif font-bold mb-2">Welcome Home</h2>
                            <p className="text-orange-50 text-lg font-medium">Faith Assembly Hospitality</p>
                        </div>
                        <div className="space-y-4">
                            <p className="text-sm text-orange-100 italic font-serif leading-relaxed">
                                "Do not neglect to show hospitality to strangers, for thereby some have entertained angels unawares." — Hebrews 13:2
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="md:w-1/2 p-12 flex flex-col justify-center bg-white">
                    <h3 className="text-2xl font-bold text-stone-800 mb-1">Sign In</h3>
                    <p className="text-stone-500 text-sm mb-8">Access the team portal.</p>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all"
                                placeholder="volunteer@faithassembly.org"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3.5 rounded-xl flex items-center justify-center text-white font-bold tracking-wide transition-all shadow-lg shadow-orange-500/20 mt-6 ${loading
                                    ? 'bg-stone-300 cursor-not-allowed'
                                    : 'bg-orange-600 hover:bg-orange-700 hover:-translate-y-0.5'
                                }`}
                        >
                            {loading ? 'Opening Door...' : 'Enter Portal'} <HiArrowRight className="ml-2 w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default HospitalityLogin;
