import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { FaLandmark, FaLock, FaEnvelope, FaSpinner } from 'react-icons/fa';

const FinanceLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const auth = getAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Check role
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData.role === 'finance' || userData.role === 'admin') {
                    navigate('/finance/dashboard');
                } else {
                    setError('Access Denied: Authorized Finance Personnel Only.');
                    await auth.signOut();
                }
            } else {
                setError('User profile not found.');
                await auth.signOut();
            }
        } catch (err: any) {
            console.error("Login error", err);
            setError('Invalid credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-700">
                <div className="bg-emerald-600 p-8 text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg text-emerald-600 text-3xl">
                        <FaLandmark />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Finance Portal</h1>
                    <p className="text-emerald-100 mt-1 opacity-90 text-sm">Restricted Access System</p>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm flex items-center border border-red-100">
                            <FaLock className="mr-2" /> {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 ml-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <FaEnvelope />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition bg-gray-50"
                                    placeholder="Enter secure email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 ml-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <FaLock />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition bg-gray-50"
                                    placeholder="Enter secure password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-800 text-white py-3.5 rounded-lg font-bold hover:bg-slate-900 focus:ring-4 focus:ring-slate-500 transition shadow-lg flex items-center justify-center uppercase text-sm tracking-wider"
                        >
                            {loading ? <FaSpinner className="animate-spin" /> : 'Authenticate'}
                        </button>
                    </form>
                </div>
                <div className="bg-gray-100 p-4 text-center text-[10px] text-gray-400 uppercase tracking-widest font-bold border-t border-gray-200">
                    Faith Assembly Church • Finance Dept
                </div>
            </div>
        </div>
    );
};

export default FinanceLogin;
