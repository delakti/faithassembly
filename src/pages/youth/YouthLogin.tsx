import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { HiLightningBolt } from 'react-icons/hi';
import { toast, Toaster } from 'react-hot-toast';

const YouthLogin: React.FC = () => {
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
                if (['youth_member', 'youth_leader', 'admin', 'super_admin'].includes(role)) {
                    toast.success('Welcome to the Fam!');
                    navigate('/youth/dashboard');
                } else {
                    toast.error('Access Denied. Youth Only.');
                    await auth.signOut();
                }
            } else {
                toast.error('Access Denied.');
                await auth.signOut();
            }
        } catch (error: any) {
            toast.error('Invalid credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[150px] opacity-20"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-500 rounded-full blur-[150px] opacity-20"></div>

            <Toaster position="top-center" />

            <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-3xl p-8 relative z-10 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-12 shadow-lg shadow-yellow-400/20">
                        <HiLightningBolt className="w-10 h-10 text-black" />
                    </div>
                    <h2 className="text-4xl font-black text-white italic tracking-tighter mb-2">YTH NATION</h2>
                    <p className="text-gray-400 font-medium">Log in to your account</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-6 py-4 bg-black border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all font-medium"
                            placeholder="Email address"
                        />
                    </div>
                    <div className="relative">
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-6 py-4 bg-black border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all font-medium"
                            placeholder="Password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-xl text-black font-black text-lg uppercase tracking-wide shadow-lg transform active:scale-95 transition-all ${loading
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-yellow-400 hover:bg-yellow-300 shadow-yellow-400/20'
                            }`}
                    >
                        {loading ? 'Logging In...' : 'Let\'s Go'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        Don't have an account? <span className="text-yellow-400 font-bold cursor-pointer hover:underline">Join the Squad</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default YouthLogin;
