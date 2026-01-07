import React, { useEffect } from 'react';

const News: React.FC = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);
    return (
        <div className="pt-24 px-4 max-w-7xl mx-auto min-h-screen">
            <h1 className="text-4xl font-bold mb-8">Church News</h1>
            <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col md:flex-row gap-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="md:w-1/4 h-48 bg-gray-200 rounded-lg"></div>
                        <div className="md:w-3/4">
                            <span className="text-cyan-600 font-bold text-sm uppercase">Announcement</span>
                            <h3 className="text-2xl font-bold mt-1 mb-3">Important Update Title {i}</h3>
                            <p className="text-gray-600 mb-4">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                            <button className="text-cyan-600 font-semibold hover:underline">Read Full Story</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default News;
