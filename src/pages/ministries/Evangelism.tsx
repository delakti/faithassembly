import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiArrowLeft, HiArrowRight, HiGlobeAlt, HiSpeakerphone, HiHeart } from 'react-icons/hi';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Evangelism: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white font-sans text-slate-900">
            <Navbar />

            {/* HERO */}
            <div className="relative h-[60vh] flex items-center justify-center bg-green-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1 px-4 rounded bg-green-500 text-white text-sm font-bold uppercase tracking-widest mb-6">
                            The Great Commission
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                            Go & Tell
                        </h1>
                        <p className="text-xl text-green-100 font-light max-w-2xl mx-auto leading-relaxed">
                            Taking the Gospel to the streets of Uxbridge, London, and the ends of the earth.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <Link to="/ministries" className="inline-flex items-center text-slate-500 hover:text-green-700 transition">
                    <HiArrowLeft className="mr-2" /> Back to Ministries
                </Link>
            </div>

            {/* CONTENT */}
            <section className="py-16 px-4">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Sharing the Light</h2>
                        <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                            Evangelism isn't just a program; it's our heartbeat. We are committed to stepping outside the four walls of the church to share the life-changing love of Jesus Christ with our neighbors.
                        </p>

                        <div className="space-y-6">
                            <div className="flex">
                                <HiSpeakerphone className="w-8 h-8 text-green-600 mr-4 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-slate-900">Street Outreach</h4>
                                    <p className="text-sm text-slate-500">Regular teams engaging with the community, offering prayer and sharing the Gospel.</p>
                                </div>
                            </div>
                            <div className="flex">
                                <HiGlobeAlt className="w-8 h-8 text-green-600 mr-4 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-slate-900">Missions</h4>
                                    <p className="text-sm text-slate-500">Supporting global mission partners and organizing short-term trips.</p>
                                </div>
                            </div>
                            <div className="flex">
                                <HiHeart className="w-8 h-8 text-green-600 mr-4 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-slate-900">Follow Up</h4>
                                    <p className="text-sm text-slate-500">Walking with new believers as they begin their journey of faith.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 rounded-3xl p-10 border border-green-100 text-center">
                        <div className="bg-white w-20 h-20 rounded-full mx-auto flex items-center justify-center text-green-600 shadow-md mb-6">
                            <HiGlobeAlt className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-green-900">Evangelism Portal</h3>
                        <p className="text-green-800/70 mb-8 max-w-sm mx-auto">
                            Access training materials, outreach schedules, and submit testimony reports.
                        </p>

                        <Link
                            to="/evangelism/login"
                            className="block w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-green-700 transition"
                        >
                            Team Portal Access <HiArrowRight className="inline ml-2" />
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Evangelism;
