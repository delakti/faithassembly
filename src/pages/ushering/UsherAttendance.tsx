import React, { useState } from 'react';
import { HiSave, HiRefresh, HiPlus, HiMinus } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const UsherAttendance: React.FC = () => {
    const [counts, setCounts] = useState({
        adults: 0,
        youth: 0,
        children: 0,
        firstTimers: 0
    });
    const [isSaving, setIsSaving] = useState(false);

    const updateCount = (category: keyof typeof counts, delta: number) => {
        setCounts(prev => ({
            ...prev,
            [category]: Math.max(0, prev[category] + delta)
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success("Headcount submitted successfully!");
        setIsSaving(false);
    };

    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    return (
        <div className="space-y-6 font-sans text-slate-900 max-w-4xl mx-auto">
            <header className="border-b border-slate-200 pb-6 text-center md:text-left">
                <h1 className="text-3xl font-serif font-bold text-slate-900">Head Count</h1>
                <p className="text-slate-500 font-medium">Record attendance numbers for the current service.</p>
            </header>

            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl shadow-slate-900/10 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-500/20 via-slate-900 to-slate-900"></div>
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest relative z-10">Total Attendance</h2>
                <div className="text-7xl font-bold text-white mt-2 relative z-10 tabular-nums tracking-tight">
                    {total}
                </div>
                <p className="text-amber-500 text-xs font-bold uppercase mt-4 flex items-center gap-2 relative z-10">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Live Count
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Adults */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg">Adults</h3>
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Main Sanctuary</p>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <button
                            onClick={() => updateCount('adults', -1)}
                            className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-md text-slate-500 hover:text-amber-600 hover:border-amber-500 transition-colors shadow-sm active:scale-95"
                        >
                            <HiMinus />
                        </button>
                        <span className="text-2xl font-bold text-slate-900 w-12 text-center tabular-nums">{counts.adults}</span>
                        <button
                            onClick={() => updateCount('adults', 1)}
                            className="w-10 h-10 flex items-center justify-center bg-amber-600 border border-amber-600 rounded-md text-white hover:bg-amber-500 transition-colors shadow-sm active:scale-95"
                        >
                            <HiPlus />
                        </button>
                    </div>
                </div>

                {/* Youth */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg">Youth</h3>
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Youth Hall</p>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <button
                            onClick={() => updateCount('youth', -1)}
                            className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-md text-slate-500 hover:text-amber-600 hover:border-amber-500 transition-colors shadow-sm active:scale-95"
                        >
                            <HiMinus />
                        </button>
                        <span className="text-2xl font-bold text-slate-900 w-12 text-center tabular-nums">{counts.youth}</span>
                        <button
                            onClick={() => updateCount('youth', 1)}
                            className="w-10 h-10 flex items-center justify-center bg-amber-600 border border-amber-600 rounded-md text-white hover:bg-amber-500 transition-colors shadow-sm active:scale-95"
                        >
                            <HiPlus />
                        </button>
                    </div>
                </div>

                {/* Children */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg">Children</h3>
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Kingdom Kids</p>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <button
                            onClick={() => updateCount('children', -1)}
                            className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-md text-slate-500 hover:text-amber-600 hover:border-amber-500 transition-colors shadow-sm active:scale-95"
                        >
                            <HiMinus />
                        </button>
                        <span className="text-2xl font-bold text-slate-900 w-12 text-center tabular-nums">{counts.children}</span>
                        <button
                            onClick={() => updateCount('children', 1)}
                            className="w-10 h-10 flex items-center justify-center bg-amber-600 border border-amber-600 rounded-md text-white hover:bg-amber-500 transition-colors shadow-sm active:scale-95"
                        >
                            <HiPlus />
                        </button>
                    </div>
                </div>

                {/* First Timers */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between md:col-span-2 lg:col-span-1">
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg text-amber-600">First Timers</h3>
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Guest Cards</p>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <button
                            onClick={() => updateCount('firstTimers', -1)}
                            className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-md text-slate-500 hover:text-amber-600 hover:border-amber-500 transition-colors shadow-sm active:scale-95"
                        >
                            <HiMinus />
                        </button>
                        <span className="text-2xl font-bold text-slate-900 w-12 text-center tabular-nums">{counts.firstTimers}</span>
                        <button
                            onClick={() => updateCount('firstTimers', 1)}
                            className="w-10 h-10 flex items-center justify-center bg-amber-600 border border-amber-600 rounded-md text-white hover:bg-amber-500 transition-colors shadow-sm active:scale-95"
                        >
                            <HiPlus />
                        </button>
                    </div>
                </div>
            </div>

            <div className="pt-6 flex gap-4">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wide text-sm disabled:opacity-50"
                >
                    {isSaving ? <HiRefresh className="animate-spin w-5 h-5" /> : <HiSave className="w-5 h-5" />}
                    Submit Headcount
                </button>
                <button
                    className="flex-none px-6 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl shadow-sm transition-all"
                    onClick={() => setCounts({ adults: 0, youth: 0, children: 0, firstTimers: 0 })}
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default UsherAttendance;
