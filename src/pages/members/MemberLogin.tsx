import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { FaUserShield, FaLock, FaEnvelope, FaArrowLeft } from 'react-icons/fa';

const MemberLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const navigate = useNavigate();
    const auth = getAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Check if user has a profile and is a member
            const userDoc = await getDoc(doc(db, 'users', user.uid));

            if (userDoc.exists()) {
                const userData = userDoc.data();

                // Allow access if role is valid
                if (userData && userData.role) {
                    navigate('/members/dashboard');
                } else {
                    setError('Access restricted.');
                    await auth.signOut();
                }
            } else {
                // PROFILE MISSING: Auto-create it (Lazy Sync)
                try {
                    const { setDoc, doc, Timestamp } = await import('firebase/firestore');
                    await setDoc(doc(db, 'users', user.uid), {
                        uid: user.uid,
                        displayName: user.displayName || 'Unknown User',
                        email: user.email,
                        role: 'user', // Default to basic user
                        createdAt: Timestamp.now(),
                        photoURL: user.photoURL || null,
                        syncedFromAuth: true
                    });

                    // Proceed to dashboard
                    navigate('/members/dashboard');
                } catch (createErr) {
                    console.error("Error creating profile:", createErr);
                    setError('Failed to initialize account profile.');
                    await auth.signOut();
                }
            }

        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                setError('Invalid email or password.');
            } else {
                setError('Failed to login. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        if (!email) {
            setError('Please enter your email address.');
            setLoading(false);
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            setSuccessMessage('Password reset email sent! Check your inbox.');
            // Optionally switch back to login after a delay, or let user do it manually
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/user-not-found') {
                // For security, usually we don't say "user not found", but for internal apps/portals it might be okay.
                // Generic friendly error is safer.
                setError('If an account exists for this email, a reset link has been sent.');
            } else {
                setError('Failed to send reset email. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 transition-transform duration-500 hover:rotate-12">
                    {isResetting ? <FaEnvelope className="text-white text-3xl" /> : <FaUserShield className="text-white text-3xl" />}
                </div>
                <h2 className="text-center text-3xl font-extrabold text-white">
                    {isResetting ? 'Reset Password' : 'Members Portal'}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-400">
                    {isResetting ? 'Enter your email to receive a reset link' : 'Sign in to access your dashboard'}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-100">
                    {error && (
                        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md animate-pulse">
                            <p className="text-sm text-red-700 font-medium">{error}</p>
                        </div>
                    )}
                    {successMessage && (
                        <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-md">
                            <p className="text-sm text-green-700 font-medium">{successMessage}</p>
                        </div>
                    )}

                    {!isResetting ? (
                        // LOGIN FORM
                        <form className="space-y-6" onSubmit={handleLogin}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-bold text-gray-700">
                                    Email address
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope className="text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-bold text-gray-700">
                                    Password
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                        Remember me
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsResetting(true);
                                            setError('');
                                            setSuccessMessage('');
                                        }}
                                        className="font-medium text-blue-600 hover:text-blue-500 transition-colors focus:outline-none"
                                    >
                                        Forgot your password?
                                    </button>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white ${loading ? 'bg-blue-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform active:scale-95`}
                                >
                                    {loading ? 'Signing in...' : 'Sign In'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        // RESET PASSWORD FORM
                        <form className="space-y-6" onSubmit={handleResetPassword}>
                            <div>
                                <label htmlFor="reset-email" className="block text-sm font-bold text-gray-700">
                                    Email address
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope className="text-gray-400" />
                                    </div>
                                    <input
                                        id="reset-email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <p className="mt-2 text-xs text-gray-500">
                                    We'll send a link to reset your password to this email address.
                                </p>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white ${loading ? 'bg-blue-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all`}
                                >
                                    {loading ? 'Sending...' : 'Send Reset Link'}
                                </button>
                            </div>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsResetting(false);
                                        setError('');
                                        setSuccessMessage('');
                                    }}
                                    className="flex items-center justify-center mx-auto text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    <FaArrowLeft className="mr-2 h-3 w-3" /> Back to Login
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="mt-6 border-t border-gray-100 pt-6">
                        <p className="text-center text-sm text-gray-600">
                            Not a member yet? <Link to="/members/register" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">Create an account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberLogin;
