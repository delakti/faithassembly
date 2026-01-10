import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiArrowLeft, HiArrowRight, HiOutlineLightningBolt, HiChatAlt2 } from 'react-icons/hi';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const YouthMinistry: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white font-sans text-slate-900">
            <Navbar />

            {/* HERO */}
            <div className="relative h-[60vh] flex items-center justify-center bg-purple-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-40 mix-blend-luminosity" />
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30 text-sm font-bold tracking-wide mb-4 backdrop-blur-sm">
                            The Standard
                        </span>
                        <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter uppercase italic">
                            Youth
                        </h1>
                        <p className="text-xl md:text-2xl text-purple-200 font-light max-w-2xl mx-auto">
                            Empowering the next generation to live boldly for Christ in a complex world.
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
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1 bg-slate-100 rounded-3xl p-8 border border-slate-200 shadow-xl text-center">
                        <h3 className="text-2xl font-bold mb-2">Youth Portal Access</h3>
                        <p className="text-slate-500 mb-8">Connect with groups, see events, and join the conversation.</p>

                        <Link
                            to="/youth/login"
                            className="block w-full bg-purple-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-purple-700 transition transform hover:-translate-y-1"
                        >
                            Login to Portal <HiArrowRight className="inline ml-2" />
                        </Link>
                        <p className="text-xs text-slate-400 mt-4">Youth & Young Adults only.</p>
                    </div>

                    <div className="order-1 md:order-2">
                        <h2 className="text-4xl font-black mb-6 text-slate-900 tracking-tight">Not Just Another Friday Night.</h2>
                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            We are a movement of young people passionate about Jesus. We tackle real issues, build real friendships, and chase after a real God. No faking it here.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-purple-50 p-6 rounded-2xl">
                                <HiOutlineLightningBolt className="w-8 h-8 text-purple-600 mb-3" />
                                <h4 className="font-bold text-slate-900 mb-1">High Energy</h4>
                                <p className="text-sm text-slate-600">Dynamic worship and powerful messages.</p>
                            </div>
                            <div className="bg-purple-50 p-6 rounded-2xl">
                                <HiChatAlt2 className="w-8 h-8 text-purple-600 mb-3" />
                                <h4 className="font-bold text-slate-900 mb-1">Real Talk</h4>
                                <p className="text-sm text-slate-600">Small groups to discuss faith & life.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default YouthMinistry;
