import React, { useState } from 'react';
import { HiSave, HiRefresh, HiPlus, HiMinus, HiCalendar, HiDocumentText, HiDownload, HiClipboardCheck } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const UsherAttendance: React.FC = () => {
    // Service Details
    const [serviceDetails, setServiceDetails] = useState({
        date: new Date().toISOString().split('T')[0],
        type: 'Sunday Service' // Default
    });

    // Counts State with Gender Split
    const [counts, setCounts] = useState({
        adults: { male: 0, female: 0 },
        youth: { male: 0, female: 0 },
        children: { male: 0, female: 0 },
        firstTimers: 0
    });

    const [isSaving, setIsSaving] = useState(false);
    const [lastSavedId, setLastSavedId] = useState<string | null>(null);

    // Update function for Split Categories (Adults, Youth, Children)
    const updateSplitCount = (category: 'adults' | 'youth' | 'children', gender: 'male' | 'female', delta: number) => {
        setCounts(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [gender]: Math.max(0, prev[category][gender] + delta)
            }
        }));
    };

    // Update function for Simple Categories (First Timers)
    const updateSimpleCount = (category: 'firstTimers', delta: number) => {
        setCounts(prev => ({
            ...prev,
            [category]: Math.max(0, prev[category] + delta)
        }));
    };

    // Calculate Total
    const total =
        counts.adults.male + counts.adults.female +
        counts.youth.male + counts.youth.female +
        counts.children.male + counts.children.female +
        counts.firstTimers;

    const generatePDF = () => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(22);
        doc.setTextColor(217, 119, 6); // Amber-600 approx
        doc.text("Faith Assembly", 14, 20);

        doc.setFontSize(16);
        doc.setTextColor(30, 41, 59); // Slate-800
        doc.text("Service Attendance Report", 14, 30);

        // Service Details
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Service Type: ${serviceDetails.type}`, 14, 40);
        doc.text(`Date: ${new Date(serviceDetails.date).toLocaleDateString()}`, 14, 45);

        // Summary Table
        autoTable(doc, {
            startY: 55,
            head: [['Category', 'Location', 'Male', 'Female', 'Total']],
            body: [
                ['Adults', 'Main Sanctuary', counts.adults.male, counts.adults.female, counts.adults.male + counts.adults.female],
                ['Youth', 'Youth Hall', counts.youth.male, counts.youth.female, counts.youth.male + counts.youth.female],
                ['Children', 'Kingdom Kids', counts.children.male, counts.children.female, counts.children.male + counts.children.female],
                ['First Timers', 'Guest Cards', '-', '-', counts.firstTimers],
                [
                    { content: 'Grand Total', colSpan: 4, styles: { fontStyle: 'bold', fillColor: [30, 41, 59], textColor: 255, halign: 'right' } },
                    { content: total, styles: { fontStyle: 'bold', fillColor: [30, 41, 59], textColor: 255 } }
                ],
            ],
            theme: 'grid',
            headStyles: { fillColor: [217, 119, 6] },
        });

        // Footer
        const finalY = (doc as any).lastAutoTable.finalY + 15;
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Generated on ${new Date().toLocaleString()}`, 14, finalY);
        doc.text(`Reference ID: ${lastSavedId || 'N/A'}`, 14, finalY + 5);

        doc.save(`Attendance_${serviceDetails.date}.pdf`);
    };

    const handleSave = async () => {
        if (total === 0 && !window.confirm("Total count is 0. Submit anyway?")) return;

        setIsSaving(true);
        try {
            const docRef = await addDoc(collection(db, 'attendance'), {
                date: serviceDetails.date,
                serviceType: serviceDetails.type,
                counts,
                total,
                createdAt: serverTimestamp()
            });

            setLastSavedId(docRef.id);
            toast.success("Headcount submitted successfully!");

        } catch (error) {
            console.error("Error saving attendance:", error);
            toast.error("Failed to submit headcount");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 font-sans text-slate-900 max-w-4xl mx-auto pb-20">
            <header className="border-b border-slate-200 pb-6 text-center md:text-left">
                <h1 className="text-3xl font-serif font-bold text-slate-900">Head Count</h1>
                <p className="text-slate-500 font-medium">Record attendance numbers for the current service.</p>
            </header>

            {/* Service Details Control */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid md:grid-cols-2 gap-4">
                <div>
                    <label className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">
                        <HiCalendar /> Service Date
                    </label>
                    <input
                        type="date"
                        value={serviceDetails.date}
                        onChange={e => setServiceDetails({ ...serviceDetails, date: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-amber-500 font-bold text-slate-700"
                    />
                </div>
                <div>
                    <label className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">
                        <HiDocumentText /> Service Type
                    </label>
                    <select
                        value={serviceDetails.type}
                        onChange={e => setServiceDetails({ ...serviceDetails, type: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-amber-500 bg-white font-bold text-slate-700"
                    >
                        <option>Sunday Service</option>
                        <option>Bible Study</option>
                        <option>Revival / Special</option>
                        <option>Other</option>
                    </select>
                </div>
            </div>

            <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl shadow-slate-900/10 flex flex-col items-center justify-center relative overflow-hidden transition-all hover:shadow-2xl hover:shadow-amber-500/10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-500/20 via-slate-900 to-slate-900"></div>
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest relative z-10">Total Attendance</h2>
                <div className="text-7xl font-bold text-white mt-2 relative z-10 tabular-nums tracking-tight animate-fade-in-up">
                    {total}
                </div>
                <p className="text-amber-500 text-xs font-bold uppercase mt-4 flex items-center gap-2 relative z-10">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Live Count
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Adults - Split */}
                <SplitCounterCard
                    label="Adults"
                    sub="Main Sanctuary"
                    maleCount={counts.adults.male}
                    femaleCount={counts.adults.female}
                    onUpdate={(gender, d) => updateSplitCount('adults', gender, d)}
                />

                {/* Youth - Split */}
                <SplitCounterCard
                    label="Youth"
                    sub="Youth Hall"
                    maleCount={counts.youth.male}
                    femaleCount={counts.youth.female}
                    onUpdate={(gender, d) => updateSplitCount('youth', gender, d)}
                />

                {/* Children - Split */}
                <SplitCounterCard
                    label="Children"
                    sub="Kingdom Kids"
                    maleCount={counts.children.male}
                    femaleCount={counts.children.female}
                    onUpdate={(gender, d) => updateSplitCount('children', gender, d)}
                />

                {/* First Timers - Simple */}
                <CounterCard
                    label="First Timers"
                    sub="Guest Cards"
                    count={counts.firstTimers}
                    onMinus={() => updateSimpleCount('firstTimers', -1)}
                    onPlus={() => updateSimpleCount('firstTimers', 1)}
                    highlight
                />
            </div>

            <div className="pt-6 flex flex-col md:flex-row gap-4">
                {!lastSavedId ? (
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wide text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? <HiRefresh className="animate-spin w-5 h-5" /> : <HiSave className="w-5 h-5" />}
                        Submit Headcount
                    </button>
                ) : (
                    <div className="flex-1 grid grid-cols-2 gap-4 animate-fade-in">
                        <button
                            onClick={generatePDF}
                            className="bg-amber-100 text-amber-900 hover:bg-amber-200 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            <HiDownload className="w-5 h-5" /> Download Report
                        </button>
                        <button
                            onClick={() => {
                                setLastSavedId(null);
                                setCounts({
                                    adults: { male: 0, female: 0 },
                                    youth: { male: 0, female: 0 },
                                    children: { male: 0, female: 0 },
                                    firstTimers: 0
                                });
                            }}
                            className="bg-slate-800 text-white hover:bg-slate-700 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            <HiPlus className="w-5 h-5" /> New Count
                        </button>
                    </div>
                )}

                {!lastSavedId && (
                    <button
                        className="flex-none px-6 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl shadow-sm transition-all"
                        onClick={() => setCounts({
                            adults: { male: 0, female: 0 },
                            youth: { male: 0, female: 0 },
                            children: { male: 0, female: 0 },
                            firstTimers: 0
                        })}
                    >
                        Reset
                    </button>
                )}
            </div>

            {lastSavedId && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 text-green-800 animate-fade-in">
                    <HiClipboardCheck className="w-6 h-6 flex-none" />
                    <div>
                        <p className="font-bold">Headcount Submitted!</p>
                        <p className="text-xs">Data has been saved to the secure ledger.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

// Component for categories split by gender
const SplitCounterCard = ({ label, sub, maleCount, femaleCount, onUpdate }: {
    label: string,
    sub: string,
    maleCount: number,
    femaleCount: number,
    onUpdate: (gender: 'male' | 'female', delta: number) => void
}) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
        <div>
            <h3 className="font-bold text-lg text-slate-900">{label}</h3>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{sub}</p>
        </div>

        <div className="flex gap-4">
            {/* Male Counter */}
            <div className="flex-1 bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col items-center">
                <span className="text-xs font-bold text-slate-500 uppercase mb-2">Male</span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onUpdate('male', -1)}
                        className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-md text-slate-500 hover:text-amber-600 transition-colors shadow-sm active:scale-95"
                    >
                        <HiMinus className="w-3 h-3" />
                    </button>
                    <span className="text-xl font-bold text-slate-900 w-8 text-center tabular-nums">{maleCount}</span>
                    <button
                        onClick={() => onUpdate('male', 1)}
                        className="w-8 h-8 flex items-center justify-center bg-sky-600 border border-sky-600 rounded-md text-white hover:bg-sky-500 transition-colors shadow-sm active:scale-95"
                    >
                        <HiPlus className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* Female Counter */}
            <div className="flex-1 bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col items-center">
                <span className="text-xs font-bold text-slate-500 uppercase mb-2">Female</span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onUpdate('female', -1)}
                        className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-md text-slate-500 hover:text-amber-600 transition-colors shadow-sm active:scale-95"
                    >
                        <HiMinus className="w-3 h-3" />
                    </button>
                    <span className="text-xl font-bold text-slate-900 w-8 text-center tabular-nums">{femaleCount}</span>
                    <button
                        onClick={() => onUpdate('female', 1)}
                        className="w-8 h-8 flex items-center justify-center bg-pink-600 border border-pink-600 rounded-md text-white hover:bg-pink-500 transition-colors shadow-sm active:scale-95"
                    >
                        <HiPlus className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </div>

        {/* Subtotal Display */}
        <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
            <span className="text-xs font-medium text-slate-400 uppercase">Subtotal</span>
            <span className="font-bold text-slate-700">{maleCount + femaleCount}</span>
        </div>
    </div>
);

// Generic Counter Card (Original) - Used for First Timers
const CounterCard = ({ label, sub, count, onMinus, onPlus, highlight }: any) => (
    <div className={`bg-white p-6 rounded-xl border shadow-sm flex items-center justify-between transition-all ${highlight ? 'border-amber-200 shadow-amber-100/50' : 'border-slate-200'}`}>
        <div>
            <h3 className={`font-bold text-lg ${highlight ? 'text-amber-600' : 'text-slate-900'}`}>{label}</h3>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{sub}</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-lg border border-slate-100">
            <button
                onClick={onMinus}
                className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-md text-slate-500 hover:text-amber-600 hover:border-amber-500 transition-colors shadow-sm active:scale-95"
            >
                <HiMinus />
            </button>
            <span className="text-2xl font-bold text-slate-900 w-12 text-center tabular-nums">{count}</span>
            <button
                onClick={onPlus}
                className="w-10 h-10 flex items-center justify-center bg-amber-600 border border-amber-600 rounded-md text-white hover:bg-amber-500 transition-colors shadow-sm active:scale-95"
            >
                <HiPlus />
            </button>
        </div>
    </div>
);

export default UsherAttendance;
