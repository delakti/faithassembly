import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { HiBookOpen, HiLockClosed, HiAcademicCap } from 'react-icons/hi';
import { toast, Toaster } from 'react-hot-toast';

const LifeDiscussionLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const auth = getAuth();
        const db = getFirestore();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const allowedRoles = ['sunday_student', 'sunday_teacher', 'sunday_admin', 'super_admin'];

                if (allowedRoles.includes(userData.role)) {
                    toast.success('Welcome to Sunday School');
                    navigate('/life-discussion/dashboard');
                } else {
                    toast.error('Access denied. You do not have permission.');
                    await auth.signOut();
                }
            } else {
                toast.error('User profile not found.');
                await auth.signOut();
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to sign in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <Toaster position="top-center" />
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                <div className="bg-sky-50 p-8 text-center border-b border-sky-100">
                    <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                        <HiBookOpen className="w-8 h-8 text-sky-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Life Discussion</h2>
                    <p className="text-slate-500 mt-2">Sign in to your classroom portal</p>
                </div>

                <form onSubmit={handleLogin} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <HiAcademicCap className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <HiLockClosed className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:ring-4 focus:ring-sky-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            'Enter Classroom'
                        )}
                    </button>

                    <div className="text-center">
                        <a href="/forgot-password" className="text-sm text-sky-600 hover:text-sky-700 font-medium">
                            Forgot your password?
                        </a>
                    </div>
                </form>

                <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-400">Faith Assembly Church &bull; Education Department</p>
                </div>
            </div>
        </div>
    );
};

export default LifeDiscussionLogin;
