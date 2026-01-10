import React, { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // Import signIn
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { HiShieldCheck, HiUser, HiLockClosed } from 'react-icons/hi';
import { toast, Toaster } from 'react-hot-toast';

const AdminSetup: React.FC = () => {
    const auth = getAuth();
    const db = getFirestore();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [currentRole, setCurrentRole] = useState('loading...');

    // Login State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    useEffect(() => {
        // Authenticated State Checker
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists()) {
                    setCurrentRole(userDoc.data().role || 'none');
                } else {
                    setCurrentRole('No Database Entry');
                }
            } else {
                setUser(null);
                setCurrentRole('');
            }
        });
        return () => unsubscribe();
    }, [auth, db]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoggingIn(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success('Logged in successfully');
        } catch (error: any) {
            console.error(error);
            toast.error('Login failed: ' + error.message);
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handlePromote = async () => {
        if (!user) return;
        setLoading(true);
        try {
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                role: 'super_admin',
                updatedAt: new Date().toISOString()
            }, { merge: true });

            toast.success('Success! You are now a Super Admin.');
            setCurrentRole('super_admin');

            setTimeout(() => {
                window.location.href = '/admin/super/dashboard';
            }, 1500);

        } catch (error) {
            console.error(error);
            toast.error('Failed to update role.');
        } finally {
            setLoading(false);
        }
    };

    // If NOT logged in, show simple login form
    if (!user) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <Toaster />
                <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-8 text-center space-y-6">
                    <h2 className="text-xl font-bold text-slate-800">Setup Login</h2>
                    <p className="text-sm text-slate-500">Log in to your account to enable promotion.</p>

                    <form onSubmit={handleLogin} className="space-y-4 text-left">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                            <div className="relative">
                                <HiUser className="absolute left-3 top-3 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
                            <div className="relative">
                                <HiLockClosed className="absolute left-3 top-3 text-slate-400" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoggingIn}
                            className="w-full py-2 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-900 transition"
                        >
                            {isLoggingIn ? 'Verifying...' : 'Login for Setup'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <Toaster />
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <HiShieldCheck className="w-10 h-10 text-red-600" />
                </div>

                <h1 className="text-2xl font-bold text-slate-900">Super Admin Setup</h1>
                <p className="text-slate-500">
                    Use this tool to promote your current account to Super Admin status.
                    <br /><span className="text-xs text-red-500 font-bold uppercase mt-2 block">For Development Use Only</span>
                </p>

                <div className="bg-slate-50 p-4 rounded-xl text-left space-y-2 border border-slate-200">
                    <div className="flex items-center gap-2">
                        <HiUser className="text-slate-400" />
                        <span className="text-sm font-medium text-slate-700">{user?.email}</span>
                    </div>
                    <div>
                        <span className="text-xs text-slate-400 uppercase font-bold">Current Role:</span>
                        <span className="ml-2 text-xs font-mono bg-slate-200 px-2 py-1 rounded">{currentRole}</span>
                    </div>
                </div>

                <button
                    onClick={handlePromote}
                    disabled={loading || currentRole === 'super_admin'}
                    className={`w-full py-3 rounded-lg font-bold text-white transition-all transform active:scale-95 ${currentRole === 'super_admin'
                            ? 'bg-emerald-500 cursor-default'
                            : 'bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-red-500/30'
                        }`}
                >
                    {loading ? 'Updating...' : currentRole === 'super_admin' ? 'Already Super Admin' : 'Make Me Super Admin'}
                </button>

                {currentRole === 'super_admin' && (
                    <a href="/admin/super/dashboard" className="block text-sky-600 font-medium hover:underline text-sm">
                        Go to Dashboard →
                    </a>
                )}

                <button onClick={() => auth.signOut()} className="text-xs text-slate-400 hover:text-slate-600 underline">
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default AdminSetup;
