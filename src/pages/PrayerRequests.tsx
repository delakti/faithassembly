import React, { useEffect, useState } from 'react';

const PrayerRequests: React.FC = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        // Firebase logic
    };

    return (
        <div className="pt-24 px-4 max-w-2xl mx-auto min-h-screen">
            <h1 className="text-4xl font-bold mb-6 text-center">Prayer Requests</h1>
            <p className="text-center text-gray-600 mb-10">How can we pray for you today?</p>

            {submitted ? (
                <div className="bg-green-50 text-green-800 p-8 rounded-xl text-center">
                    <h3 className="text-2xl font-bold mb-2">Request Received</h3>
                    <p>Our prayer team will be lifting this up in prayer.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                    <div>
                        <label className="block font-semibold mb-2">Name (Optional)</label>
                        <input type="text" className="w-full border rounded-lg p-3" placeholder="Your Name" />
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">Prayer Request</label>
                        <textarea className="w-full border rounded-lg p-3 h-32" placeholder="Share your request..." required></textarea>
                    </div>
                    <button type="submit" className="w-full bg-cyan-600 text-white font-bold py-3 rounded-lg hover:bg-cyan-700 transition">
                        Submit Prayer Request
                    </button>
                </form>
            )}
        </div>
    );
};
export default PrayerRequests;
