import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore';
import { getDatabase, ref, set } from 'firebase/database';
import { FaUserPlus, FaLock, FaUser, FaPhone, FaMapMarkerAlt, FaHome, FaCity, FaMailBulk } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';

const MemberRegister: React.FC = () => {
    // Personal Details
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [mobilePhone, setMobilePhone] = useState('');

    // Address Details
    const [houseNumber, setHouseNumber] = useState('');
    const [streetName, setStreetName] = useState('');
    const [city, setCity] = useState('');
    const [postcode, setPostcode] = useState('');

    // Security
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const auth = getAuth();
    const db = getFirestore();
    const rtdb = getDatabase();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            // 1. Create Authentication User
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const fullName = `${firstName} ${lastName}`;

            // 2. Update Profile Display Name
            await updateProfile(user, {
                displayName: fullName
            });

            // 3. Create Firestore User Document
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                displayName: fullName,
                email: email,
                role: 'user', // Default role pending approval
                createdAt: Timestamp.now(),
                photoURL: user.photoURL || null
            });

            // 4. Create Donor Record in Realtime Database
            await set(ref(rtdb, 'donor/' + user.uid), {
                'First Name': firstName,
                'Last Name': lastName,
                'Email': email,
                'Mobile Phone': mobilePhone,
                'House Number': houseNumber,
                'Street Name': streetName,
                'City': city,
                'Postcode': postcode,
                'BranchName': 'Main Branch', // Default
                'GiftAidAccepted': false,
                'Reference': user.uid.substring(0, 8).toUpperCase(), // Generate short ref
                'Role': 'user',
                'timestamp': Date.now(),
                'worker': false,
                'HouseName': '', // Optional, left blank for now
                'HouseFellowship': '',
                'HouseFellowshipLeaders': '',
                'birthDate': ''
            });

            toast.success("Account created successfully!");

            // 5. Redirect to Dashboard
            setTimeout(() => {
                navigate('/members/dashboard');
            }, 1500);

        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                toast.error('Email is already registered.');
            } else {
                toast.error('Failed to create account: ' + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Toaster />
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="mx-auto h-16 w-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
                    <FaUserPlus className="text-white text-3xl" />
                </div>
                <h2 className="text-center text-3xl font-extrabold text-white">
                    Create Account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-400">
                    Join the Faith Assembly Portal
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleRegister}>

                        {/* Personal Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">First Name</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUser className="text-gray-400 sm:text-xs" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 py-2 border"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUser className="text-gray-400 sm:text-xs" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 py-2 border"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mobile Phone</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaPhone className="text-gray-400 sm:text-xs" />
                                </div>
                                <input
                                    type="tel"
                                    required
                                    value={mobilePhone}
                                    onChange={(e) => setMobilePhone(e.target.value)}
                                    className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 py-2 border"
                                />
                            </div>
                        </div>

                        {/* Address Info */}
                        <div className="border-t pt-4">
                            <h3 className="text-sm font-medium text-gray-900 mb-3">Address Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">House Number/Name</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaHome className="text-gray-400 sm:text-xs" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={houseNumber}
                                            onChange={(e) => setHouseNumber(e.target.value)}
                                            className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 py-2 border"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Street Name</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaMapMarkerAlt className="text-gray-400 sm:text-xs" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={streetName}
                                            onChange={(e) => setStreetName(e.target.value)}
                                            className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 py-2 border"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">City</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaCity className="text-gray-400 sm:text-xs" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 py-2 border"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Postcode</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaMailBulk className="text-gray-400 sm:text-xs" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={postcode}
                                            onChange={(e) => setPostcode(e.target.value)}
                                            className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 py-2 border"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Password */}
                        <div className="border-t pt-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Password</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaLock className="text-gray-400 sm:text-xs" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 py-2 border"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaLock className="text-gray-400 sm:text-xs" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 py-2 border"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition`}
                            >
                                {loading ? 'Creating Service Account...' : 'Register'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account? <Link to="/members/login" className="font-medium text-green-600 hover:text-green-500">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberRegister;
