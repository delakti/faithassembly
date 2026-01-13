import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { HiHeart, HiArrowRight } from 'react-icons/hi';
import { toast, Toaster } from 'react-hot-toast';

const EstherLogin: React.FC = () => {
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
                if (['esther_member', 'esther_leader', 'hospitality_leader','admin', 'super_admin'].includes(role)) {
                    toast.success('Welcome home, Sister.');
                    navigate('/esther/dashboard');
                } else {
                    toast.error('Access Restricted. Women of Faith Only.');
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
        <div className="min-h-screen bg-rose-50 flex flex-col md:flex-row shadow-2xl overflow-hidden font-serif">
            <Toaster position="top-right" toastOptions={{ className: '!font-sans !text-sm' }} />

            {/* Image Side */}
            <div className="hidden md:block w-1/2 relative">
                <img
                    src="https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=2940&auto=format&fit=crop"
                    alt="Women Fellowship"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-rose-900/40 mix-blend-multiply"></div>
                <div className="absolute bottom-12 left-12 text-white max-w-lg">
                    <p className="font-sans text-sm tracking-widest uppercase mb-4 opacity-90">Esther 4:14</p>
                    <h2 className="text-5xl leading-tight mb-6">"Unless you have been created for such a time as this?"</h2>
                </div>
            </div>

            {/* Form Side */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white relative">
                <div className="max-w-md w-full">
                    <div className="mb-10">
                        <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-6">
                            <HiHeart className="w-6 h-6 text-rose-500" />
                        </div>
                        <h2 className="text-3xl text-rose-950 mb-3">Welcome Back</h2>
                        <p className="text-gray-500 font-sans">Please sign in to access your portal.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 font-sans mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-all font-sans"
                                placeholder="jane@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 font-sans mb-2">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-all font-sans"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-lg flex items-center justify-center text-white font-sans font-medium tracking-wide transition-all shadow-lg shadow-rose-200 ${loading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-rose-500 hover:bg-rose-600'
                                }`}
                        >
                            {loading ? 'Signing In...' : 'Sign In Note'} <HiArrowRight className="ml-2 w-4 h-4" />
                        </button>
                    </form>

                    <div className="mt-8 text-center font-sans">
                        <p className="text-gray-400 text-sm">
                            New here? <span className="text-rose-600 font-medium cursor-pointer hover:underline">Create an account</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EstherLogin;
