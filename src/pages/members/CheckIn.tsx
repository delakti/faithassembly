import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import QRCode from 'react-qr-code'; // Ensure you have installed 'react-qr-code' or use another lib

const CheckIn: React.FC = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const [checkedIn, setCheckedIn] = useState(false);
    const [loading, setLoading] = useState(false);

    // Generate a unique value for the QR code (User ID + Current Date)
    const qrValue = JSON.stringify({
        uid: user?.uid,
        name: user?.displayName,
        date: new Date().toLocaleDateString()
    });

    const handleManualCheckIn = async () => {
        if (!user) return;
        setLoading(true);
        // In a real app, verify geolocation here
        try {
            await addDoc(collection(db, 'attendance'), {
                userId: user.uid,
                userName: user.displayName,
                timestamp: serverTimestamp(),
                method: 'manual_app',
                serviceDate: new Date().toISOString().split('T')[0]
            });
            setCheckedIn(true);
        } catch (error) {
            console.error("Check-in failed", error);
            alert("Check-in failed. Please try again or see an usher.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto text-center space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Check-In</h1>
                <p className="text-gray-500">Sunday Service • 10:00 AM</p>
            </div>

            {checkedIn ? (
                <div className="bg-green-50 p-8 rounded-2xl border border-green-100 animate-fade-in">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                        <FaCheckCircle />
                    </div>
                    <h2 className="text-2xl font-bold text-green-800">You're Checked In!</h2>
                    <p className="text-green-700 mt-2">Welcome to service. Enjoy the message!</p>
                </div>
            ) : (
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <div className="mb-8">
                        <div className="bg-gray-100 p-4 rounded-xl inline-block">
                            {/* Install react-qr-code if missing, or use a placeholder */}
                            <QRCode value={qrValue} size={180} />
                        </div>
                        <p className="text-sm text-gray-400 mt-4">Show this code to an usher to scan</p>
                    </div>

                    <div className="relative flex py-5 items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">OR</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    <button
                        onClick={handleManualCheckIn}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg flex items-center justify-center"
                    >
                        {loading ? 'Checking In...' : (
                            <>
                                <FaMapMarkerAlt className="mr-2" /> I am here now
                            </>
                        )}
                    </button>
                    <p className="text-xs text-center text-gray-400 mt-3">
                        Location services may be required
                    </p>
                </div>
            )}
        </div>
    );
};

export default CheckIn;
