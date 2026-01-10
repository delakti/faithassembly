import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiArrowLeft, HiArrowRight, HiFire } from 'react-icons/hi';
import { FaPrayingHands } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const PrayerTeam: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white font-sans text-slate-900">
            <Navbar />

            {/* HERO */}
            <div className="relative h-[60vh] flex items-center justify-center bg-red-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507692049790-de58293a469d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-40 mix-blend-multiply" />
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1 px-4 rounded-full bg-red-800/50 text-red-200 border border-red-700/50 text-sm font-semibold tracking-wider mb-6 backdrop-blur-sm">
                            The Engine Room
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                            Prayer Team
                        </h1>
                        <p className="text-xl text-red-100 font-light max-w-2xl mx-auto leading-relaxed">
                            Interceding for the church, the nation, and the lost. We believe that prayer moves the hand of God.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <Link to="/ministries" className="inline-flex items-center text-slate-500 hover:text-red-700 transition">
                    <HiArrowLeft className="mr-2" /> Back to Ministries
                </Link>
            </div>

            {/* CONTENT */}
            <section className="py-16 px-4">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Watch & Pray</h2>
                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            The Prayer Team serves as the spiritual covering for Faith Assembly. We meet regularly to lift up the needs of the congregation and to seek God's face for revival.
                        </p>

                        <div className="flex items-start mb-6">
                            <FaPrayingHands className="w-6 h-6 text-red-600 mr-4 mt-1" />
                            <div>
                                <h4 className="font-bold text-slate-900">Intercession</h4>
                                <p className="text-sm text-slate-500">Standing in the gap for others.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <HiFire className="w-6 h-6 text-red-600 mr-4 mt-1" />
                            <div>
                                <h4 className="font-bold text-slate-900">Vigils</h4>
                                <p className="text-sm text-slate-500">Dedicated times of intense prayer.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-10 border border-red-100 text-center">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-red-600 mx-auto mb-6 shadow-md">
                            <FaPrayingHands className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-slate-900">Prayer Portal</h3>
                        <p className="text-slate-600 mb-8 max-w-sm mx-auto">
                            Submit prayer requests, view the intercession rota, and join online prayer meetings.
                        </p>

                        <Link
                            to="/prayer/login"
                            className="block w-full bg-red-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-red-700 transition"
                        >
                            Enter Helper Portal <HiArrowRight className="inline ml-2" />
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default PrayerTeam;
