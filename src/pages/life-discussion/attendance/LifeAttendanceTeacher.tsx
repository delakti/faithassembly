import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
    HiRefresh,
    HiShare,
    HiClipboardCopy,
    HiCheckCircle,
    HiQrcode
} from 'react-icons/hi';
import { format } from 'date-fns';

const LifeAttendanceTeacher: React.FC = () => {
    const [sessionId, setSessionId] = useState<string>(`session_${format(new Date(), 'yyyyMMdd')}_${Math.random().toString(36).substring(7)}`);
    const [copied, setCopied] = useState(false);

    // Mock recent scans (for real-time feedback)
    const recentScans = [
        { id: 1, name: 'Samuel Doe', time: '09:45 AM', status: 'verified' },
        { id: 2, name: 'Esther Smith', time: '09:48 AM', status: 'verified' },
        { id: 3, name: 'Joshua Brown', time: '09:50 AM', status: 'verified' },
    ];

    const generateNewSession = () => {
        const newId = `session_${format(new Date(), 'yyyyMMdd')}_${Math.random().toString(36).substring(7)}`;
        setSessionId(newId);
        setCopied(false);
    };

    const copyCode = () => {
        navigator.clipboard.writeText(sessionId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Class Check-In</h1>
                <p className="text-slate-500">Generate a QR code for students to scan.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* QR Generation Card */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 flex flex-col items-center text-center">
                    <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-100 mb-6">
                        <QRCodeSVG
                            value={JSON.stringify({ type: 'faith_assembly_attendance', sessionId, date: new Date().toISOString() })}
                            size={256}
                            level="H"
                            includeMargin={true}
                            fgColor="#0f172a"
                        />
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 mb-2">Scan to Check In</h2>
                    <p className="text-slate-500 mb-6 max-w-xs">Ask students to scan this QR code using their Life Discussion Portal.</p>

                    <div className="flex items-center gap-3 w-full bg-slate-50 p-3 rounded-lg border border-slate-200 mb-6">
                        <div className="bg-slate-200 p-2 rounded">
                            <HiQrcode className="w-5 h-5 text-slate-500" />
                        </div>
                        <code className="flex-1 text-left font-mono text-sm text-slate-600 truncate">
                            {sessionId}
                        </code>
                        <button
                            onClick={copyCode}
                            className={`p-2 rounded-lg transition-colors ${copied ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:text-sky-600 hover:bg-white'}`}
                        >
                            {copied ? <HiCheckCircle className="w-5 h-5" /> : <HiClipboardCopy className="w-5 h-5" />}
                        </button>
                    </div>

                    <div className="flex gap-3 w-full">
                        <button
                            onClick={generateNewSession}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors"
                        >
                            <HiRefresh className="w-5 h-5" />
                            Regenerate
                        </button>
                        <button
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-sky-600 rounded-lg text-white font-medium hover:bg-sky-700 transition-colors"
                        >
                            <HiShare className="w-5 h-5" />
                            Share Link
                        </button>
                    </div>
                </div>

                {/* Live Attendance Feed */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            Live Check-Ins
                        </h3>
                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">
                            Total: {recentScans.length}
                        </span>
                    </div>

                    <div className="space-y-4 flex-1">
                        {recentScans.map((scan) => (
                            <div key={scan.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-sky-600 font-bold border border-slate-200">
                                        {scan.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">{scan.name}</p>
                                        <p className="text-xs text-slate-500">Checked in at {scan.time}</p>
                                    </div>
                                </div>
                                <HiCheckCircle className="w-6 h-6 text-emerald-500" />
                            </div>
                        ))}

                        {/* Empty State / Placeholder for animation */}
                        <div className="border-2 border-dashed border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center py-8">
                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-2 animate-pulse">
                                <HiQrcode className="w-6 h-6 text-slate-200" />
                            </div>
                            <p className="text-sm text-slate-400">Waiting for scans...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LifeAttendanceTeacher;
