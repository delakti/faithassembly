import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

const PlanVisit: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('We are expecting you! See you soon.');
        // Firebase submission logic will go here
    };

    return (
        <div className="bg-white">
            <div className="relative py-32 bg-cyan-900 text-white text-center">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative z-10 px-4">
                    <motion.h1
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-4xl md:text-6xl font-bold mb-4"
                    >
                        PLAN YOUR VISIT
                    </motion.h1>
                    <p className="text-xl text-cyan-100 max-w-2xl mx-auto">
                        We know visiting a new church can be intimidating. We want to make your first experience as smooth as possible.
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-20">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Expectations */}
                    <div>
                        <h2 className="text-3xl font-bold mb-8 text-gray-900">What to Expect</h2>
                        <div className="space-y-6">
                            {[
                                { title: "A Warm Welcome", desc: "Our host team will meet you at the door with a smile and help you find your way." },
                                { title: "Passionate Worship", desc: "We start every service with vibrant, spirit-led worship music." },
                                { title: "Practical Teaching", desc: "Our messages are biblical, practical, and relevant to your everyday life." },
                                { title: "Kids Ministry", desc: "We have safe, fun, and age-appropriate environments for your children." }
                            ].map((item, idx) => (
                                <div key={idx} className="flex">
                                    <FaCheckCircle className="text-cyan-500 text-2xl mt-1 mr-4 flex-shrink-0" />
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900">{item.title}</h4>
                                        <p className="text-gray-600">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Visit Form */}
                    <div className="bg-white border-2 border-cyan-100 rounded-2xl p-8 shadow-xl">
                        <h3 className="text-2xl font-bold mb-2">Let us know you're coming!</h3>
                        <p className="text-gray-500 mb-8">Fill out this quick form and we'll have a gift ready for you.</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="First Name" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-cyan-500 outline-none" required />
                                <input type="text" placeholder="Last Name" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-cyan-500 outline-none" required />
                            </div>
                            <input type="email" placeholder="Email Address" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-cyan-500 outline-none" required />
                            <input type="tel" placeholder="Phone Number" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-cyan-500 outline-none" />
                            <select className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-cyan-500 outline-none">
                                <option>When do you plan to visit?</option>
                                <option>This Sunday</option>
                                <option>Next Sunday</option>
                                <option>Not sure yet</option>
                            </select>
                            <label className="flex items-center space-x-2 text-gray-600">
                                <input type="checkbox" className="form-checkbox text-cyan-600 h-5 w-5" />
                                <span>I'm bringing my kids</span>
                            </label>

                            <button type="submit" className="w-full bg-cyan-600 text-white font-bold py-4 rounded-lg hover:bg-cyan-700 transition shadow-lg shadow-cyan-600/30">
                                Schedule My Visit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanVisit;
