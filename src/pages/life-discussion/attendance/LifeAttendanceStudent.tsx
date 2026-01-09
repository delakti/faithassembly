import React, { useState } from 'react';
import {
    HiCheckCircle,
    HiXCircle,
    HiCamera,
    HiPencil
} from 'react-icons/hi';

// Note: For actual QR scanning, we'd use 'react-qr-reader' or similar library.
// Since we don't have it installed yet, I'll mock the interface and provide manual entry.

const LifeAttendanceStudent: React.FC = () => {
    const [mode, setMode] = useState<'scan' | 'manual'>('scan');
    const [manualCode, setManualCode] = useState('');
    const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('scanning'); // Simulate verifying

        setTimeout(() => {
            if (manualCode.toLowerCase().startsWith('session')) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        }, 1500);
    };

    return (
        <div className="max-w-md mx-auto space-y-6">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-slate-800">Mark Attendance</h1>
                <p className="text-slate-500">Scan the class QR code to verify your presence.</p>
            </div>

            {status === 'success' ? (
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-emerald-100 text-center flex flex-col items-center animate-in fade-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                        <HiCheckCircle className="w-12 h-12 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Checked In!</h2>
                    <p className="text-slate-500 mb-6">You have been marked present for <strong>The Power of Prayer</strong>.</p>
                    <button
                        onClick={() => setStatus('idle')}
                        className="w-full py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                    >
                        Close
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-200">
                    {/* Toggle */}
                    <div className="flex border-b border-slate-100">
                        <button
                            onClick={() => setMode('scan')}
                            className={`flex-1 py-4 font-medium text-sm flex items-center justify-center gap-2 ${mode === 'scan' ? 'bg-slate-50 text-sky-600 border-b-2 border-sky-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <HiCamera className="w-5 h-5" />
                            Scan QR
                        </button>
                        <button
                            onClick={() => setMode('manual')}
                            className={`flex-1 py-4 font-medium text-sm flex items-center justify-center gap-2 ${mode === 'manual' ? 'bg-slate-50 text-sky-600 border-b-2 border-sky-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <HiPencil className="w-5 h-5" />
                            Enter Code
                        </button>
                    </div>

                    <div className="p-8">
                        {mode === 'scan' ? (
                            <div className="flex flex-col items-center">
                                <div className="relative w-64 h-64 bg-slate-900 rounded-3xl overflow-hidden mb-6 flex items-center justify-center">
                                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>
                                    <div className="w-48 h-48 border-2 border-white/50 rounded-xl relative">
                                        <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-sky-500 -mt-1 -ml-1"></div>
                                        <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-sky-500 -mt-1 -mr-1"></div>
                                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-sky-500 -mb-1 -ml-1"></div>
                                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-sky-500 -mb-1 -mr-1"></div>

                                        {/* Scanning animation line */}
                                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.8)] w-full animate-[scan_2s_ease-in-out_infinite]"></div>
                                    </div>
                                    <p className="absolute bottom-4 text-white/70 text-xs font-medium uppercase tracking-widest">Camera Active</p>
                                </div>
                                <p className="text-center text-slate-500 text-sm">Position the QR code within the frame to scan.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleManualSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Session Code</label>
                                    <input
                                        type="text"
                                        value={manualCode}
                                        onChange={(e) => setManualCode(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all font-mono text-center uppercase tracking-widest text-lg"
                                        placeholder="SESSION_..."
                                    />
                                </div>

                                {status === 'error' && (
                                    <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg flex items-center gap-2 text-rose-600 text-sm">
                                        <HiXCircle className="w-5 h-5 flex-shrink-0" />
                                        <span>Invalid code. Please try again.</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={!manualCode || status === 'scanning'}
                                    className="w-full py-3 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {status === 'scanning' ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verifying...
                                        </>
                                    ) : (
                                        'Check In'
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LifeAttendanceStudent;
