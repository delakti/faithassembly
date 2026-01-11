import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { database } from "../firebase";
import { ref, set, get, query, orderByChild, equalTo } from "firebase/database";
import { FaCheckCircle, FaExclamationCircle, FaSpinner } from "react-icons/fa";

const AttendanceLog: React.FC = () => {
    const [searchParams] = useSearchParams();
    const service = searchParams.get("service");

    const [status, setStatus] = useState("loading"); // loading, input-phone, logging, success, error
    const [message, setMessage] = useState("");
    const [inputPhone, setInputPhone] = useState("");

    useEffect(() => {
        if (!service) {
            setStatus("error");
            setMessage("No service specified. Please scan a valid QR code.");
            return;
        }

        const storedPhone = localStorage.getItem("phone");
        if (storedPhone) {
            checkDonorAndLog(storedPhone, service);
        } else {
            setStatus("input-phone");
        }
    }, [service]);

    const checkDonorAndLog = async (phoneNumber: string, serviceName: string) => {
        setStatus("logging"); // Ensure UI shows we are working
        try {
            if (!database) throw new Error("Firebase database not initialized");

            // Normalize phone number for search if needed (assuming DB has standard format)
            const donorsRef = ref(database, 'donor');
            const donorQuery = query(donorsRef, orderByChild('Mobile Phone'), equalTo(phoneNumber));
            const snapshot = await get(donorQuery);

            let donorInfo: any = null;
            if (snapshot.exists()) {
                const data = snapshot.val();
                const donorId = Object.keys(data)[0];
                donorInfo = { id: donorId, ...data[donorId] };
            }

            logAttendance(phoneNumber, serviceName, donorInfo);
        } catch (error) {
            console.error("Error checking donor:", error);
            // Fallback: Log attendance even if donor lookup fails (record the raw phone number)
            logAttendance(phoneNumber, serviceName, null);
        }
    };

    const logAttendance = async (phoneNumber: string, serviceName: string, donor: any = null) => {
        setStatus("logging");

        try {
            if (!database) {
                throw new Error("Firebase database not initialized");
            }

            const date = new Date();
            const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD

            // Sanitize phone number for path (Firebase keys cannot contain ., $, #, [, ], /)
            const sanitizedPhone = phoneNumber.replace(/[.#$/[\]]/g, "");

            // Structure: attendanceLogs/ServiceName/Date/Phone
            const attendanceRef = ref(
                database,
                `/attendanceLogs/${serviceName}/${dateString}/${sanitizedPhone}`
            );

            const attendanceData: any = {
                timestamp: Date.now(),
                date: dateString,
                service: serviceName,
                phone: phoneNumber,
                device: navigator.userAgent
            };

            if (donor) {
                attendanceData.donorId = donor.id;
                attendanceData.firstName = donor["First Name"];
                attendanceData.lastName = donor["Last Name"];
                attendanceData.email = donor["Email"];
                attendanceData.isDonor = true;
            }

            await set(attendanceRef, attendanceData);

            setStatus("success");

            const name = donor ? `${donor["First Name"]} ${donor["Last Name"]}` : "";
            const successMsg = name
                ? `Welcome back, ${name}! Your attendance has been recorded for ${serviceName}.`
                : `Thank you, your attendance has been recorded for ${serviceName} on ${dateString}.`;

            setMessage(successMsg);
        } catch (error) {
            console.error("Attendance logging error:", error);
            setStatus("error");
            setMessage("Failed to record attendance. Please try again or contact support.");
        }
    };

    const handlePhoneSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputPhone.trim()) return;

        localStorage.setItem("phone", inputPhone.trim());
        if (service) {
            checkDonorAndLog(inputPhone.trim(), service);
        }
    };

    const handleReset = () => {
        localStorage.removeItem("phone");
        setInputPhone("");
        setStatus("input-phone");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
            {/* Brand Header */}
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-blue-900">Faith Assembly</h1>
                <p className="text-gray-500 text-sm">Attendance Portal</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200 border border-slate-100 max-w-md w-full text-center">
                {status === "loading" && (
                    <div className="py-8">
                        <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
                        <p className="text-gray-600 font-medium">Checking your details...</p>
                    </div>
                )}

                {status === "input-phone" && (
                    <div className="animate-fade-in">
                        <h2 className="text-2xl font-bold mb-2 text-gray-800">Welcome!</h2>
                        <p className="text-gray-600 mb-6">
                            Please enter your phone number to check in for <br />
                            <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">{service}</span>
                        </p>
                        <form onSubmit={handlePhoneSubmit} className="space-y-4">
                            <div>
                                <input
                                    type="tel"
                                    value={inputPhone}
                                    onChange={(e) => setInputPhone(e.target.value)}
                                    placeholder="Mobile Number"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg text-center tracking-wide"
                                    required
                                />
                                <p className="text-xs text-gray-400 mt-2 text-left">
                                    * Use the number registered with the church office.
                                </p>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-bold text-lg shadow-md hover:shadow-lg transform active:scale-95 duration-200"
                            >
                                Check In
                            </button>
                        </form>
                    </div>
                )}

                {status === "logging" && (
                    <div className="py-8">
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="h-12 w-12 bg-blue-100 rounded-full mb-4"></div>
                            <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 w-32 bg-gray-100 rounded"></div>
                        </div>
                        <p className="text-gray-600 mt-6 font-medium">Recording your attendance...</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="py-4 animate-fade-in">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <FaCheckCircle className="text-4xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed max-w-xs mx-auto">{message}</p>

                        <div className="space-y-3">
                            <Link to="/" className="block w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition cursor-pointer">
                                Go to Home
                            </Link>
                            <button onClick={handleReset} className="text-sm text-gray-400 hover:text-gray-600 underline">
                                Not you? Reset on this device
                            </button>
                        </div>
                    </div>
                )}

                {status === "error" && (
                    <div className="py-4">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaExclamationCircle className="text-3xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops</h2>
                        <p className="text-red-600 mb-6">{message}</p>
                        <Link to={`/attendance/check-in?service=${encodeURIComponent(service || '')}`} onClick={() => window.location.reload()} className="text-blue-600 hover:underline font-medium">
                            Try Again
                        </Link>
                    </div>
                )}
            </div>

            <div className="mt-8 text-center text-xs text-gray-400">
                <p>© {new Date().getFullYear()} Faith Assembly. All rights reserved.</p>
            </div>
        </div>
    );
};

export default AttendanceLog;
