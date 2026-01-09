import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { HiShieldCheck, HiLockClosed } from 'react-icons/hi';
import { toast, Toaster } from 'react-hot-toast';

const SuperAdminLogin: React.FC = () => {
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

            // Verify Role
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists() && userDoc.data().role === 'super_admin') {
                toast.success('Welcome back, Super Admin.');
                navigate('/admin/super/dashboard');
            } else {
                toast.error('Access Denied. Insufficient privileges.');
                await auth.signOut(); // Force sign out if not super admin
            }
        } catch (error: any) {
            console.error("Login Error:", error);
            toast.error('Invalid credentials or access error.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
            <Toaster position="top-center" />
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-red-600 p-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                        <HiShieldCheck className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Restricted Access</h2>
                    <p className="text-red-100 mt-2">Super Admin Control Center</p>
                </div>

                <form onSubmit={handleLogin} className="p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Secure Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                            placeholder="admin@faithassembly.org.uk"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                placeholder="••••••••"
                            />
                            <HiLockClosed className="absolute right-4 top-3.5 text-gray-400" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-lg text-white font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1 ${loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600'
                            }`}
                    >
                        {loading ? 'Verifying...' : 'Authenticate'}
                    </button>

                    <div className="text-center mt-4">
                        <p className="text-xs text-gray-400">
                            Unauthorized access is prohibited and monitored.
                            <br />IP Address Logged.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SuperAdminLogin;
