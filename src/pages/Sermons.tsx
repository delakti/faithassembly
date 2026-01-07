import React, { useEffect } from 'react';
import { FaPlayCircle } from 'react-icons/fa';

const Sermons: React.FC = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);
    return (
        <div className="pt-24 px-4 max-w-7xl mx-auto min-h-screen">
            <h1 className="text-4xl font-bold mb-8">Latest Sermons</h1>

            {/* Featured Sermon */}
            <div className="relative h-96 rounded-2xl overflow-hidden bg-gray-900 mb-12 group cursor-pointer">
                <img src="https://images.unsplash.com/photo-1478147427282-58a87a120781?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" className="w-full h-full object-cover opacity-60 group-hover:opacity-50 transition" alt="Featured" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <FaPlayCircle className="text-7xl text-white opacity-80 group-hover:scale-110 transition duration-300" />
                </div>
                <div className="absolute bottom-0 left-0 p-8">
                    <h2 className="text-3xl text-white font-bold mb-2">The Power of Faith</h2>
                    <p className="text-gray-300">Pastor John Doe • Sunday, Jan 5</p>
                </div>
            </div>

            {/* Grid */}
            <div className="grid md:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="cursor-pointer group">
                        <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden mb-3">
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition">
                                <FaPlayCircle className="text-4xl text-white opacity-0 group-hover:opacity-100 transition" />
                            </div>
                        </div>
                        <h3 className="font-bold text-lg group-hover:text-cyan-600 transition">Sermon Title {i}</h3>
                        <p className="text-sm text-gray-500">Jan {i}, 2026</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Sermons;
