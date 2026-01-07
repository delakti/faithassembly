import React, { useEffect } from 'react';

const DecisionCards: React.FC = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);
    return (
        <div className="pt-24 px-4 max-w-2xl mx-auto min-h-screen">
            <h1 className="text-4xl font-bold mb-6 text-center">I Have Decided</h1>
            <p className="text-center text-gray-600 mb-8">
                "Whoever acknowledges me before others, I will also acknowledge before my Father in heaven." - Matthew 10:32
            </p>
            <form className="space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="space-y-4">
                    <p className="font-semibold text-lg">Today, I am deciding to:</p>
                    <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 text-cyan-600" />
                        <span>Believe in Jesus Christ for the first time</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 text-cyan-600" />
                        <span>Recommit my life to Christ</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 text-cyan-600" />
                        <span>Be baptized</span>
                    </label>
                </div>

                <hr className="my-6" />

                <div className="grid grid-cols-2 gap-4">
                    <input type="text" className="w-full border rounded-lg p-3" placeholder="First Name" required />
                    <input type="text" className="w-full border rounded-lg p-3" placeholder="Last Name" required />
                </div>
                <input type="email" className="w-full border rounded-lg p-3" placeholder="Email Address" required />
                <input type="tel" className="w-full border rounded-lg p-3" placeholder="Phone Number" />

                <button type="submit" className="w-full bg-cyan-600 text-white font-bold py-3 rounded-lg hover:bg-cyan-700 transition">
                    Submit My Decision
                </button>
            </form>
        </div>
    );
};
export default DecisionCards;
