import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { HiPrinter, HiRefresh } from 'react-icons/hi';

const ServiceQRGenerator: React.FC = () => {
    const [serviceDate, setServiceDate] = useState(new Date().toISOString().split('T')[0]);
    const [serviceType, setServiceType] = useState('Sunday Service');
    const [generatedCode, setGeneratedCode] = useState('');

    const generateCode = () => {
        // Create a URL payload that points to the web check-in page
        // Format: https://domain.com/attendance/check-in?service=Service Name
        const baseUrl = window.location.origin;
        const url = `${baseUrl}/attendance/check-in?service=${encodeURIComponent(serviceType)}`;
        setGeneratedCode(url);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center print:hidden">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Service QR Generator</h1>
                    <p className="text-slate-500">Generate a unique code for members to scan.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:block print:grid-cols-1">
                {/* Controls - Hide on Print */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 print:hidden">
                    <h3 className="font-bold text-gray-900 mb-4">Settings</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Service Date</label>
                            <input
                                type="date"
                                value={serviceDate}
                                onChange={(e) => setServiceDate(e.target.value)}
                                className="w-full border p-2 rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Service Type</label>
                            <select
                                value={serviceType}
                                onChange={(e) => setServiceType(e.target.value)}
                                className="w-full border p-2 rounded-lg"
                            >
                                <option>Sunday Service</option>
                                <option>Midweek Service</option>
                                <option>Special Event</option>
                                <option>Leadership Meeting</option>
                            </select>
                        </div>

                        <button
                            onClick={generateCode}
                            className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 flex items-center justify-center gap-2"
                        >
                            <HiRefresh className="text-xl" />
                            Generate Code
                        </button>
                    </div>
                </div>

                {/* Display Area */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center print:shadow-none print:border-none">
                    {generatedCode ? (
                        <>
                            <h2 className="text-2xl font-bold mb-2">{serviceType}</h2>
                            <p className="text-xl text-gray-600 mb-8">{new Date(serviceDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

                            <div className="p-4 bg-white border-4 border-black rounded-xl mb-6">
                                <QRCode value={generatedCode} size={300} />
                            </div>

                            <p className="text-gray-500 font-medium mb-8 max-w-xs">
                                Open the Faith Assembly App and scan this code to check in.
                            </p>

                            <button
                                onClick={handlePrint}
                                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium flex items-center gap-2 print:hidden"
                            >
                                <HiPrinter /> Print Poster
                            </button>
                        </>
                    ) : (
                        <div className="text-gray-400 py-12">
                            <p>Select settings and click Generate</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServiceQRGenerator;
