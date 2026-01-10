import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiArrowLeft, HiArrowRight, HiShieldCheck, HiSparkles, HiUserGroup } from 'react-icons/hi';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const ChildrensChurch: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white font-sans text-slate-900">
            <Navbar />

            {/* HER0 */}
            <div className="relative h-[60vh] flex items-center justify-center bg-yellow-400 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1502086223501-681a9134508e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-30 mix-blend-multiply" />
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-yellow-200 text-yellow-800 text-sm font-bold tracking-wide mb-4">
                            Values Generation
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg mb-6 tracking-tight">
                            Children's Church
                        </h1>
                        <p className="text-xl md:text-2xl text-white font-medium drop-shadow-md max-w-2xl mx-auto">
                            A fun, safe, and faith-filled environment for kids aged 3-12.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <Link to="/ministries" className="inline-flex items-center text-slate-500 hover:text-slate-800 transition">
                    <HiArrowLeft className="mr-2" /> Back to Ministries
                </Link>
            </div>

            {/* CONTENT */}
            <section className="py-16 px-4">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-6 text-slate-800">Raising Champions</h2>
                        <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                            At Faith Assembly, we believe children aren't just the church of tomorrow—they are the church of today. Our goal is to partner with parents to raise up a generation that knows Jesus, loves His Word, and shines His light.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600 mr-4 mt-1">
                                    <HiShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Safety First</h4>
                                    <p className="text-sm text-slate-500">Secure check-in/out and background-checked volunteers.</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600 mr-4 mt-1">
                                    <HiSparkles className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Creative Learning</h4>
                                    <p className="text-sm text-slate-500">Interactive Bible stories, worship, and crafts.</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600 mr-4 mt-1">
                                    <HiUserGroup className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Age-Appropriate</h4>
                                    <p className="text-sm text-slate-500">Classes tailored for Tykes (3-5) and Kids (6-12).</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-slate-100 rounded-3xl p-8 border border-slate-200 shadow-xl text-center">
                        <h3 className="text-2xl font-bold mb-2">Parent & Staff Portal</h3>
                        <p className="text-slate-500 mb-8">Access resources, check-in, and schedules.</p>

                        <Link
                            to="/children/login"
                            className="block w-full bg-yellow-500 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-yellow-600 transition transform hover:-translate-y-1"
                        >
                            Enter Portal <HiArrowRight className="inline ml-2" />
                        </Link>
                        <p className="text-xs text-slate-400 mt-4">Required for volunteers and registered parents.</p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default ChildrensChurch;
