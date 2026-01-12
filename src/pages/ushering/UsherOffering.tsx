import React, { useState } from 'react';
import { HiCurrencyPound, HiLockClosed, HiUserGroup, HiUpload, HiShieldCheck, HiDownload, HiCalendar, HiDocumentText } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const UsherOffering: React.FC = () => {
    const [step, setStep] = useState(1);

    // Service Details
    const [serviceDetails, setServiceDetails] = useState({
        date: new Date().toISOString().split('T')[0],
        type: 'Sunday Service' // Default
    });

    // Cash Breakdown
    const [breakdown, setBreakdown] = useState({
        fifty: '',
        twenty: '',
        ten: '',
        five: ''
    });

    // Other Funds
    const [funds, setFunds] = useState({
        coins: '',
        checks: '',
        card: ''
    });

    const [witness1, setWitness1] = useState('');
    const [witness2, setWitness2] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Helpers to parse numbers safely
    const val = (s: string) => parseFloat(s) || 0;

    const calculateNotesTotal = () => {
        return (val(breakdown.fifty) * 50) +
            (val(breakdown.twenty) * 20) +
            (val(breakdown.ten) * 10) +
            (val(breakdown.five) * 5);
    };

    const calculateGrandTotal = () => {
        const notes = calculateNotesTotal();
        const coins = val(funds.coins);
        const checks = val(funds.checks);
        const card = val(funds.card);
        return (notes + coins + checks + card).toFixed(2);
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(22);
        doc.setTextColor(217, 119, 6); // Amber-600 approx
        doc.text("Faith Assembly", 14, 20);

        doc.setFontSize(16);
        doc.setTextColor(30, 41, 59); // Slate-800
        doc.text("Offering Certified Audit", 14, 30);

        // Service Details
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Service Type: ${serviceDetails.type}`, 14, 40);
        doc.text(`Date: ${new Date(serviceDetails.date).toLocaleDateString()}`, 14, 45);
        doc.text(`Reference: AUD-${Date.now().toString().slice(-6)}`, 14, 50);

        // Breakdown Table
        const notesTotal = calculateNotesTotal();

        autoTable(doc, {
            startY: 60,
            head: [['Denomination/Type', 'Count / Details', 'Subtotal (£)']],
            body: [
                ['£50 Notes', val(breakdown.fifty) || '-', `£${(val(breakdown.fifty) * 50).toFixed(2)}`],
                ['£20 Notes', val(breakdown.twenty) || '-', `£${(val(breakdown.twenty) * 20).toFixed(2)}`],
                ['£10 Notes', val(breakdown.ten) || '-', `£${(val(breakdown.ten) * 10).toFixed(2)}`],
                ['£5 Notes', val(breakdown.five) || '-', `£${(val(breakdown.five) * 5).toFixed(2)}`],
                [{ content: 'Total Notes', colSpan: 2, styles: { fontStyle: 'bold', fillColor: [241, 245, 249] } }, `£${notesTotal.toFixed(2)}`],
                ['Coins', '-', `£${val(funds.coins).toFixed(2)}`],
                ['Cheques', '-', `£${val(funds.checks).toFixed(2)}`],
                ['Card Terminal', '-', `£${val(funds.card).toFixed(2)}`],
                [{ content: 'Grand Total', colSpan: 2, styles: { fontStyle: 'bold', textColor: [217, 119, 6] } }, `£${calculateGrandTotal()}`],
            ],
            theme: 'grid',
            headStyles: { fillColor: [30, 41, 59] },
        });

        // Witnesses
        const finalY = (doc as any).lastAutoTable.finalY + 20; // Type assertion for autotable prop
        doc.setFontSize(12);
        doc.setTextColor(30, 41, 59);
        doc.text("Certified Correct By:", 14, finalY);

        doc.setFontSize(10);
        doc.text(`Witness 1: ${witness1}`, 14, finalY + 10);
        doc.text(`Witness 2: ${witness2}`, 14, finalY + 20);
        doc.text(`Timestamp: ${new Date().toLocaleString()}`, 14, finalY + 30);

        doc.save(`Offering_Audit_${serviceDetails.date}.pdf`);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await addDoc(collection(db, 'offerings'), {
                serviceDate: serviceDetails.date,
                serviceType: serviceDetails.type,
                breakdown: {
                    notes_50: val(breakdown.fifty),
                    notes_20: val(breakdown.twenty),
                    notes_10: val(breakdown.ten),
                    notes_5: val(breakdown.five),
                    coins: val(funds.coins),
                    checks: val(funds.checks),
                    card: val(funds.card)
                },
                totalAmount: parseFloat(calculateGrandTotal()),
                witnesses: [witness1, witness2],
                createdAt: serverTimestamp()
            });

            toast.success("Audit Logged Securely");
            generatePDF(); // Auto-download
            setStep(3);
        } catch (error) {
            console.error("Submission Error:", error);
            toast.error("Failed to save record. Please check connection.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto font-sans text-slate-900 space-y-8 pb-20">
            <header>
                <h1 className="text-3xl font-serif font-bold text-slate-900 border-b border-slate-200 pb-4">Offering Audit</h1>
                <p className="text-slate-500 font-medium mt-2">Secure entry for Tithes, Offerings, and Seeds.</p>
            </header>

            {/* Stepper */}
            <div className="flex items-center justify-between px-8">
                <div className={`flex flex-col items-center gap-2 ${step >= 1 ? 'text-amber-600' : 'text-slate-300'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${step >= 1 ? 'bg-amber-600 text-white border-amber-600' : 'bg-white border-slate-200'}`}>1</div>
                    <span className="text-xs font-bold uppercase tracking-widest">Count</span>
                </div>
                <div className={`flex-1 h-0.5 mx-4 ${step >= 2 ? 'bg-amber-600' : 'bg-slate-200'}`}></div>
                <div className={`flex flex-col items-center gap-2 ${step >= 2 ? 'text-amber-600' : 'text-slate-300'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${step >= 2 ? 'bg-amber-600 text-white border-amber-600' : 'bg-white border-slate-200'}`}>2</div>
                    <span className="text-xs font-bold uppercase tracking-widest">Verify</span>
                </div>
                <div className={`flex-1 h-0.5 mx-4 ${step >= 3 ? 'bg-amber-600' : 'bg-slate-200'}`}></div>
                <div className={`flex flex-col items-center gap-2 ${step >= 3 ? 'text-amber-600' : 'text-slate-300'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${step >= 3 ? 'bg-amber-600 text-white border-amber-600' : 'bg-white border-slate-200'}`}>3</div>
                    <span className="text-xs font-bold uppercase tracking-widest">Log</span>
                </div>
            </div>

            {step === 1 && (
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-fade-in">
                    <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                        <h2 className="font-bold flex items-center gap-2">
                            <HiCurrencyPound className="w-5 h-5 text-amber-500" /> Cash Breakdown
                        </h2>
                        <span className="text-xs font-bold uppercase bg-slate-800 px-3 py-1 rounded text-slate-400">Step 1 of 3</span>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Service Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div>
                                <label className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">
                                    <HiCalendar /> Service Date
                                </label>
                                <input
                                    type="date"
                                    value={serviceDetails.date}
                                    onChange={e => setServiceDetails({ ...serviceDetails, date: e.target.value })}
                                    className="w-full border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">
                                    <HiDocumentText /> Service Type
                                </label>
                                <select
                                    value={serviceDetails.type}
                                    onChange={e => setServiceDetails({ ...serviceDetails, type: e.target.value })}
                                    className="w-full border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                                >
                                    <option>Sunday Service</option>
                                    <option>Bible Study</option>
                                    <option>Revival / Special</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Note Breakdown */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2 mb-4">Note Denominations</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-slate-400 text-xs font-bold mb-1">£50 Notes (Qty)</label>
                                    <input
                                        type="number"
                                        value={breakdown.fifty}
                                        onChange={e => setBreakdown({ ...breakdown, fifty: e.target.value })}
                                        className="w-full text-lg font-mono font-bold border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-amber-500"
                                        placeholder="0"
                                    />
                                    <div className="text-xs text-right text-slate-400 mt-1">£{(val(breakdown.fifty) * 50).toFixed(2)}</div>
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-xs font-bold mb-1">£20 Notes (Qty)</label>
                                    <input
                                        type="number"
                                        value={breakdown.twenty}
                                        onChange={e => setBreakdown({ ...breakdown, twenty: e.target.value })}
                                        className="w-full text-lg font-mono font-bold border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-amber-500"
                                        placeholder="0"
                                    />
                                    <div className="text-xs text-right text-slate-400 mt-1">£{(val(breakdown.twenty) * 20).toFixed(2)}</div>
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-xs font-bold mb-1">£10 Notes (Qty)</label>
                                    <input
                                        type="number"
                                        value={breakdown.ten}
                                        onChange={e => setBreakdown({ ...breakdown, ten: e.target.value })}
                                        className="w-full text-lg font-mono font-bold border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-amber-500"
                                        placeholder="0"
                                    />
                                    <div className="text-xs text-right text-slate-400 mt-1">£{(val(breakdown.ten) * 10).toFixed(2)}</div>
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-xs font-bold mb-1">£5 Notes (Qty)</label>
                                    <input
                                        type="number"
                                        value={breakdown.five}
                                        onChange={e => setBreakdown({ ...breakdown, five: e.target.value })}
                                        className="w-full text-lg font-mono font-bold border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-amber-500"
                                        placeholder="0"
                                    />
                                    <div className="text-xs text-right text-slate-400 mt-1">£{(val(breakdown.five) * 5).toFixed(2)}</div>
                                </div>
                            </div>
                            <div className="mt-2 text-right">
                                <span className="text-xs font-bold text-slate-500 uppercase">Total Notes: </span>
                                <span className="font-mono font-bold text-slate-800">£{calculateNotesTotal().toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Other Funds */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2 mb-4">Other Methods</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Total Coins (£)</label>
                                    <input
                                        type="number"
                                        value={funds.coins}
                                        onChange={e => setFunds({ ...funds, coins: e.target.value })}
                                        className="w-full text-2xl font-mono font-bold border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-amber-500"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Cheques (£)</label>
                                    <input
                                        type="number"
                                        value={funds.checks}
                                        onChange={e => setFunds({ ...funds, checks: e.target.value })}
                                        className="w-full text-2xl font-mono font-bold border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-amber-500"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Card Terminal Total (£)</label>
                                    <input
                                        type="number"
                                        value={funds.card}
                                        onChange={e => setFunds({ ...funds, card: e.target.value })}
                                        className="w-full text-2xl font-mono font-bold border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-amber-500"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex justify-end">
                            <div className="text-right">
                                <span className="block text-slate-400 text-xs font-bold uppercase tracking-widest">Grand Total</span>
                                <span className="block text-4xl font-black text-slate-900">£{calculateGrandTotal()}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setStep(2)}
                            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg"
                        >
                            Proceed to Verification <HiLockClosed />
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-fade-in">
                    <div className="bg-amber-600 p-6 text-white flex justify-between items-center">
                        <h2 className="font-bold flex items-center gap-2">
                            <HiShieldCheck className="w-5 h-5 text-white" /> Witness Verification
                        </h2>
                        <span className="text-xs font-bold uppercase bg-amber-700 px-3 py-1 rounded text-white/80">Step 2 of 3</span>
                    </div>
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
                            <p className="text-amber-800 text-sm font-medium">
                                Two authorized ushers must witness this count. By signing below, you certify the total of <span className="font-bold">£{calculateGrandTotal()}</span> is accurate for {serviceDetails.type} on {serviceDetails.date}.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Witness 1 (Lead)</label>
                                <div className="relative">
                                    <HiUserGroup className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        required
                                        value={witness1}
                                        onChange={e => setWitness1(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                        placeholder="Full Name"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Witness 2 (Verifier)</label>
                                <div className="relative">
                                    <HiUserGroup className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        required
                                        value={witness2}
                                        onChange={e => setWitness2(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                        placeholder="Full Name"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                            <HiUpload className="w-8 h-8 text-slate-400 mx-auto mb-2 group-hover:text-amber-500" />
                            <p className="text-sm font-bold text-slate-600">Upload Count Sheet / Slip</p>
                            <p className="text-xs text-slate-400 mt-1">Optional: Attach photo of tally sheet</p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-1/3 bg-slate-100 text-slate-600 font-bold py-4 rounded-xl hover:bg-slate-200 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || !witness1 || !witness2}
                                className="w-2/3 bg-green-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                                {isSubmitting ? 'Securing Record...' : 'Submit Certified Count'} <HiLockClosed />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {step === 3 && (
                <div className="bg-white rounded-2xl shadow-xl border border-green-200 p-12 text-center animate-fade-in">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <HiShieldCheck className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Audit Submitted Successfully</h2>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto">
                        Reference #AUD-{Date.now().toString().slice(-6)} has been generated and logged.
                        Your PDF report should download automatically.
                    </p>

                    <div className="flex justify-center gap-4">
                        <button
                            onClick={generatePDF}
                            className="bg-slate-100 text-slate-700 font-bold px-6 py-3 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2"
                        >
                            <HiDownload /> Download Again
                        </button>
                        <button
                            onClick={() => {
                                setStep(1);
                                setBreakdown({ fifty: '', twenty: '', ten: '', five: '' });
                                setFunds({ coins: '', checks: '', card: '' });
                                setWitness1('');
                                setWitness2('');
                            }}
                            className="bg-slate-900 text-white font-bold px-8 py-3 rounded-lg hover:bg-slate-800 transition-colors"
                        >
                            Return to Dashboard
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsherOffering;
