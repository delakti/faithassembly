import React, { useEffect } from 'react';

const Feedback: React.FC = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);
    return (
        <div className="pt-24 px-4 max-w-2xl mx-auto min-h-screen">
            <h1 className="text-4xl font-bold mb-6 text-center">Feedback</h1>
            <p className="text-center text-gray-600 mb-10">We value your input. Help us improve your experience.</p>
            <form className="space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div>
                    <label className="block font-semibold mb-2">Topic</label>
                    <select className="w-full border rounded-lg p-3">
                        <option>General Feedback</option>
                        <option>Service Experience</option>
                        <option>Website Issue</option>
                        <option>Other</option>
                    </select>
                </div>
                <div>
                    <label className="block font-semibold mb-2">Your Feedback</label>
                    <textarea className="w-full border rounded-lg p-3 h-32" placeholder="Tell us what you think..." required></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" className="w-full border rounded-lg p-3" placeholder="Name (Optional)" />
                    <input type="email" className="w-full border rounded-lg p-3" placeholder="Email (Optional)" />
                </div>
                <button type="submit" className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition">
                    Send Feedback
                </button>
            </form>
        </div>
    );
};
export default Feedback;
