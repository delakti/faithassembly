import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { FaMapMarkerAlt, FaCheckCircle, FaQrcode, FaCamera } from 'react-icons/fa';
import QRCode from 'react-qr-code';
import { Scanner } from '@yudiel/react-qr-scanner';
import { toast } from 'react-hot-toast';

const CheckIn: React.FC = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    // Tab State: 'show' (User shows code) or 'scan' (User scans service code)
    const [mode, setMode] = useState<'show' | 'scan'>('scan'); // Default to scan as requested
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
        try {
            await recordAttendance('manual_app', new Date().toISOString().split('T')[0]);
            toast.success("Manual check-in successful");
        } catch (error) {
            console.error("Check-in failed", error);
            toast.error("Check-in failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleScan = async (text: string) => {
        if (!text || checkedIn || loading) return;

        try {
            // Validate payload
            const payload = JSON.parse(text);
            if (payload.t && payload.d) {
                setLoading(true);
                await recordAttendance('qr_self_scan', payload.d);
                toast.success(`Checked in for ${payload.t}`);
            } else {
                toast.error("Invalid QR Code");
            }
        } catch (e) {
            console.error("Scan Error", e);
            // toast.error("Could not read QR code"); 
        } finally {
            setLoading(false);
        }
    };

    const recordAttendance = async (method: string, serviceDate: string) => {
        if (!user) return;
        await addDoc(collection(db, 'attendance'), {
            userId: user.uid,
            userName: user.displayName,
            timestamp: serverTimestamp(),
            method: method,
            serviceDate: serviceDate
        });
        setCheckedIn(true);
    };

    if (checkedIn) {
        return (
            <div className="max-w-md mx-auto text-center p-8 mt-12">
                <div className="bg-green-50 p-8 rounded-2xl border border-green-100 animate-fade-in">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                        <FaCheckCircle />
                    </div>
                    <h2 className="text-2xl font-bold text-green-800">You're Checked In!</h2>
                    <p className="text-green-700 mt-2">Welcome to service. Enjoy the message!</p>
                    <button onClick={() => setCheckedIn(false)} className="mt-6 text-sm text-green-600 underline">Check in another person?</button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Check-In</h1>
                <p className="text-gray-500">Sunday Service • 10:00 AM</p>
            </div>

            {/* Mode Toggle */}
            <div className="bg-gray-100 p-1 rounded-xl flex">
                <button
                    onClick={() => setMode('scan')}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${mode === 'scan' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <FaCamera /> Scan Code
                </button>
                <button
                    onClick={() => setMode('show')}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${mode === 'show' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <FaQrcode /> Show My Code
                </button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 min-h-[400px]">
                {mode === 'scan' ? (
                    <div className="text-center">
                        <div className="mb-6 rounded-xl overflow-hidden border-2 border-slate-200">
                            <Scanner
                                onScan={(result) => result[0] && handleScan(result[0].rawValue)}
                                allowMultiple={true}
                                scanDelay={2000}
                            />
                        </div>
                        <p className="text-sm text-gray-500">Point your camera at the screen in the sanctuary.</p>

                        <div className="relative flex py-5 items-center">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">OR</span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </div>

                        <button
                            onClick={handleManualCheckIn}
                            disabled={loading}
                            className="w-full bg-slate-50 text-slate-700 border border-slate-200 py-3 rounded-xl font-bold hover:bg-slate-100 transition flex items-center justify-center"
                        >
                            <FaMapMarkerAlt className="mr-2" /> I am here (Manual)
                        </button>
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="mb-8">
                            <div className="bg-gray-100 p-4 rounded-xl inline-block">
                                <QRCode value={qrValue} size={180} />
                            </div>
                            <p className="text-sm text-gray-400 mt-4">Show this code to an usher to scan</p>
                        </div>
                        <p className="text-xs text-gray-400">
                            Your Personal ID: <span className="font-mono">{user?.uid?.substring(0, 6)}...</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckIn;
