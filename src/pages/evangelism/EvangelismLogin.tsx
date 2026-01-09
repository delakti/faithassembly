import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { HiFire, HiArrowRight, HiLockClosed } from 'react-icons/hi';
import { toast, Toaster } from 'react-hot-toast';

const EvangelismLogin: React.FC = () => {
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
                if (['evangelism_member', 'evangelism_leader', 'admin', 'super_admin'].includes(role)) {
                    toast.success('Access Granted. Welcome to the Field.');
                    navigate('/evangelism/dashboard');
                } else {
                    toast.error('Unauthorized: Evangelism Team Only.');
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
        <div className="min-h-screen bg-stone-900 flex items-center justify-center p-6 font-sans relative overflow-hidden">
            <Toaster position="bottom-right" toastOptions={{
                style: {
                    background: '#ea580c',
                    color: '#fff',
                    fontWeight: 'bold'
                },
                iconTheme: {
                    primary: '#fff',
                    secondary: '#ea580c',
                },
            }} />

            {/* Background Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/20 via-stone-900 to-stone-950"></div>

            <div className="max-w-md w-full bg-stone-950 border border-stone-800 rounded-2xl p-8 md:p-12 shadow-2xl relative z-10">
                <div className="flex justify-center mb-8">
                    <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center border-4 border-stone-900 shadow-xl shadow-orange-900/50">
                        <HiFire className="w-10 h-10 text-white" />
                    </div>
                </div>

                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase italic">Go<span className="text-orange-500">Ye</span></h2>
                    <p className="text-stone-500 text-xs font-bold uppercase tracking-widest">Evangelism Team Portal</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Email Access</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-stone-900 border border-stone-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-stone-700 font-bold"
                            placeholder="soulwinner@faithassembly.org"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Password</label>
                            <HiLockClosed className="w-3 h-3 text-stone-600" />
                        </div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-stone-900 border border-stone-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-stone-700 font-bold"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-lg flex items-center justify-center text-white font-black tracking-widest uppercase transition-all shadow-lg mt-8 ${loading
                                ? 'bg-stone-800 cursor-not-allowed text-stone-600'
                                : 'bg-orange-600 hover:bg-orange-500 hover:shadow-orange-600/30 hover:-translate-y-1'
                            }`}
                    >
                        {loading ? 'Authenticating...' : 'Enter Field'} <HiArrowRight className="ml-2 w-5 h-5" />
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-stone-900 text-center">
                    <p className="text-stone-600 text-xs italic">
                        "For the Son of Man came to seek and to save the lost." <br /> <span className="font-bold">- Luke 19:10</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EvangelismLogin;
