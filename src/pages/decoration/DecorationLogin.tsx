import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { HiSparkles } from 'react-icons/hi';

const DecorationLogin: React.FC = () => {
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

            // Check Role
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                const role = userDoc.data().role;
                if (['decor_member', 'decor_leader', 'hospitality_leader', 'admin', 'super_admin'].includes(role)) {
                    toast.success('Welcome back to the Creative Team!');
                    navigate('/decoration/dashboard');
                } else {
                    toast.error('Access restricted to Decoration Team members.');
                    await auth.signOut();
                }
            } else {
                toast.error('User profile not found.');
                await auth.signOut();
            }
        } catch (error: any) {
            console.error(error);
            toast.error('Login failed. Please check credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-fuchsia-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-100 rounded-bl-full -mr-8 -mt-8 opacity-50 pointer-events-none"></div>

                <div className="text-center mb-8 relative z-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-fuchsia-100 text-fuchsia-600 rounded-full mb-4">
                        <HiSparkles className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-serif text-slate-900 mb-2">Decoration Team</h1>
                    <p className="text-slate-500">Sign in to access the creative portal</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 outline-none transition-all"
                            placeholder="flower.lady@faithassembly.org.uk"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-fuchsia-600 text-white font-bold py-3.5 rounded-lg hover:bg-fuchsia-700 transition-colors shadow-lg shadow-fuchsia-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating Magic...' : 'Sign In'}
                    </button>

                    <div className="text-center text-sm text-slate-400 mt-4">
                        <p>Unauthorized access is prohibited.</p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DecorationLogin;
