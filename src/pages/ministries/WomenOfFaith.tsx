import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiArrowLeft, HiArrowRight, HiHeart, HiUsers, HiBookOpen } from 'react-icons/hi';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const WomenOfFaith: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white font-sans text-slate-900">
            <Navbar />

            {/* HERO */}
            <div className="relative h-[60vh] flex items-center justify-center bg-rose-50 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1529626455592-1f78f38d4861?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1 px-4 rounded-full bg-white/50 text-rose-700 border border-rose-200 text-sm font-semibold uppercase tracking-widest mb-6 backdrop-blur-md">
                            Esther Generation
                        </span>
                        <h1 className="text-5xl md:text-7xl font-serif text-rose-900 mb-6 tracking-tight">
                            Women of Faith
                        </h1>
                        <p className="text-xl text-rose-800/80 font-light max-w-2xl mx-auto leading-relaxed">
                            A sisterhood of women encouraging one another in faith, prayer, and life.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <Link to="/ministries" className="inline-flex items-center text-slate-400 hover:text-rose-600 transition">
                    <HiArrowLeft className="mr-2" /> Back to Ministries
                </Link>
            </div>

            {/* CONTENT */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-12 items-start">

                    {/* Main Content */}
                    <div className="md:col-span-7 lg:col-span-8">
                        <h2 className="text-3xl font-serif text-slate-900 mb-6">Designed for Community</h2>
                        <p className="text-lg text-slate-600 mb-8 leading-relaxed font-light">
                            We believe that women are powerful pillars in the Kingdom of God. Whether you are single, married, a mother, or a grandmother, there is a place for you here. We gather to study the Word, share our burdens, and lift each other up.
                        </p>

                        <div className="grid sm:grid-cols-3 gap-8 mb-12">
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mb-4">
                                    <HiUsers className="w-8 h-8" />
                                </div>
                                <h4 className="font-bold text-slate-900 mb-2">Connect</h4>
                                <p className="text-sm text-slate-500">Build lasting friendships with sisters in Christ.</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mb-4">
                                    <HiBookOpen className="w-8 h-8" />
                                </div>
                                <h4 className="font-bold text-slate-900 mb-2">Grow</h4>
                                <p className="text-sm text-slate-500">Deep dive Bible studies and devotionals.</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mb-4">
                                    <HiHeart className="w-8 h-8" />
                                </div>
                                <h4 className="font-bold text-slate-900 mb-2">Serve</h4>
                                <p className="text-sm text-slate-500">Impact our community through outreach.</p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar CTA */}
                    <div className="md:col-span-5 lg:col-span-4">
                        <div className="bg-white p-8 rounded-2xl shadow-xl border-t-8 border-rose-400">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Member Portal</h3>
                            <p className="text-slate-500 mb-6 text-sm">
                                Log in to access the prayer wall, devotionals, and event registration.
                            </p>

                            <Link
                                to="/esther/login"
                                className="block w-full bg-rose-500 text-white font-medium py-3 rounded-lg text-center hover:bg-rose-600 transition shadow-lg shadow-rose-200"
                            >
                                Go to Women's Portal <HiArrowRight className="inline ml-1" />
                            </Link>
                        </div>
                    </div>

                </div>
            </section>

            <Footer />
        </div>
    );
};

export default WomenOfFaith;
