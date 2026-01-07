import React, { useEffect } from 'react';

const TestimonyCards: React.FC = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);
    return (
        <div className="pt-24 px-4 max-w-2xl mx-auto min-h-screen">
            <h1 className="text-4xl font-bold mb-6 text-center">Share Your Testimony</h1>
            <p className="text-center text-gray-600 mb-10">We overcome by the blood of the Lamb and the word of our testimony.</p>
            <form className="space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div>
                    <label className="block font-semibold mb-2">My Story</label>
                    <textarea className="w-full border rounded-lg p-3 h-48" placeholder="Share what God has done..." required></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" className="w-full border rounded-lg p-3" placeholder="First Name" required />
                    <input type="text" className="w-full border rounded-lg p-3" placeholder="Last Name" required />
                </div>
                <input type="email" className="w-full border rounded-lg p-3" placeholder="Email Address" required />

                <div className="flex items-center space-x-3">
                    <input type="checkbox" className="w-5 h-5 text-cyan-600" />
                    <span className="text-sm text-gray-600">You may share my testimony publicly (first name only).</span>
                </div>

                <button type="submit" className="w-full bg-cyan-600 text-white font-bold py-3 rounded-lg hover:bg-cyan-700 transition">
                    Submit Testimony
                </button>
            </form>
        </div>
    );
};
export default TestimonyCards;
