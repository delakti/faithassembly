import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { HiShieldCheck, HiUser } from 'react-icons/hi';
import { toast, Toaster } from 'react-hot-toast';

const AdminSetup: React.FC = () => {
    const auth = getAuth();
    const db = getFirestore();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [currentRole, setCurrentRole] = useState('loading...');

    useEffect(() => {
        const checkUser = async () => {
            if (auth.currentUser) {
                setUser(auth.currentUser);
                const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
                if (userDoc.exists()) {
                    setCurrentRole(userDoc.data().role || 'none');
                } else {
                    setCurrentRole('No Database Entry');
                }
            }
        };
        checkUser();
    }, [auth, db]);

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

    if (!auth.currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-xl font-bold">Please Login First</h2>
                    <a href="/admin/super/login" className="text-blue-600 hover:underline">Go to Login</a>
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
                    <div>
                        <span className="text-xs text-slate-400 uppercase font-bold">UID:</span>
                        <span className="ml-2 text-xs font-mono text-slate-500 break-all">{user?.uid}</span>
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
            </div>
        </div>
    );
};

export default AdminSetup;
