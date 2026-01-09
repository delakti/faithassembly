import React, { useState } from 'react';
import { HiCurrencyPound, HiLockClosed, HiUserGroup, HiUpload, HiShieldCheck } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const UsherOffering: React.FC = () => {
    const [step, setStep] = useState(1);
    const [cash, setCash] = useState({ notes: '', coins: '', checks: '' });
    const [card, setCard] = useState('');
    const [witness1, setWitness1] = useState('');
    const [witness2, setWitness2] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const calculateTotal = () => {
        const n = parseFloat(cash.notes) || 0;
        const c = parseFloat(cash.coins) || 0;
        const ch = parseFloat(cash.checks) || 0;
        const ca = parseFloat(card) || 0;
        return (n + c + ch + ca).toFixed(2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast.success("Offering record submitted securely.");
        setIsSubmitting(false);
        setStep(3); // Success state
    };

    return (
        <div className="max-w-3xl mx-auto font-sans text-slate-900 space-y-8">
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
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                        <h2 className="font-bold flex items-center gap-2">
                            <HiCurrencyPound className="w-5 h-5 text-amber-500" /> Cash Breakdown
                        </h2>
                        <span className="text-xs font-bold uppercase bg-slate-800 px-3 py-1 rounded text-slate-400">Step 1 of 3</span>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Total Notes (£)</label>
                                <input
                                    type="number"
                                    value={cash.notes}
                                    onChange={e => setCash({ ...cash, notes: e.target.value })}
                                    className="w-full text-2xl font-mono font-bold border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Total Coins (£)</label>
                                <input
                                    type="number"
                                    value={cash.coins}
                                    onChange={e => setCash({ ...cash, coins: e.target.value })}
                                    className="w-full text-2xl font-mono font-bold border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Cheques (£)</label>
                                <input
                                    type="number"
                                    value={cash.checks}
                                    onChange={e => setCash({ ...cash, checks: e.target.value })}
                                    className="w-full text-2xl font-mono font-bold border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Card Terminal Total (£)</label>
                                <input
                                    type="number"
                                    value={card}
                                    onChange={e => setCard(e.target.value)}
                                    className="w-full text-2xl font-mono font-bold border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex justify-end">
                            <div className="text-right">
                                <span className="block text-slate-400 text-xs font-bold uppercase tracking-widest">Grand Total</span>
                                <span className="block text-4xl font-black text-slate-900">£{calculateTotal()}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setStep(2)}
                            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
                        >
                            Proceed to Verification <HiLockClosed />
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    <div className="bg-amber-600 p-6 text-white flex justify-between items-center">
                        <h2 className="font-bold flex items-center gap-2">
                            <HiShieldCheck className="w-5 h-5 text-white" /> Witness Verification
                        </h2>
                        <span className="text-xs font-bold uppercase bg-amber-700 px-3 py-1 rounded text-white/80">Step 2 of 3</span>
                    </div>
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
                            <p className="text-amber-800 text-sm font-medium">
                                Two authorized ushers must witness this count. By signing below, you certify the total of <span className="font-bold">£{calculateTotal()}</span> is accurate.
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
                                className="w-2/3 bg-green-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Securing Record...' : 'Submit Certified Count'} <HiLockClosed />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {step === 3 && (
                <div className="bg-white rounded-2xl shadow-xl border border-green-200 p-12 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <HiShieldCheck className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Audit Submitted Successfully</h2>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto">Reference #AUD-2025-001 has been generated and logged to the finance ledger securely.</p>
                    <button
                        onClick={() => {
                            setStep(1);
                            setCash({ notes: '', coins: '', checks: '' });
                            setCard('');
                            setWitness1('');
                            setWitness2('');
                        }}
                        className="bg-slate-900 text-white font-bold px-8 py-3 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        Return to Dashboard
                    </button>
                </div>
            )}
        </div>
    );
};

export default UsherOffering;
