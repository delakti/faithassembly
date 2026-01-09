import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiMail, HiUserGroup, HiChevronRight } from 'react-icons/hi';
import pastorSolomon from '../assets/pastor-solomon.png';
import pastorOla from '../assets/pastor-ola.jpg';

const TRUSTEES = [
    { name: "Benjamin Tope Adediji", role: "Trustee Board Member" },
    { name: "Samuel Ojo", role: "Trustee Board Member" },
    { name: "Victor Olukanni", role: "Trustee Board Member" }
];

const MINISTRIES = [
    { title: "Children's Church", lead: "Deaconess Name", email: "children@faithassembly.org.uk" },
    { title: "Youth Ministry", lead: "Minister Name", email: "youth@faithassembly.org.uk" },
    { title: "Worship Team", lead: "Music Director", email: "worship@faithassembly.org.uk" },
    { title: "Ushering", lead: "Head Usher", email: "admin@faithassembly.org.uk" },
    { title: "Media & Tech", lead: "Media Head", email: "media@faithassembly.org.uk" },
    { title: "Evangelism", lead: "Mission Outreach", email: "outreach@faithassembly.org.uk" },
];

const Leadership: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    return (
        <div className="bg-white font-sans">
            {/* HERO */}
            <div className="bg-gray-900 py-20 px-4 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-cyan-900/20"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <div className="flex items-center justify-center space-x-2 text-sm text-cyan-400 font-semibold uppercase tracking-wider mb-4">
                        <Link to="/" className="hover:text-white transition">Home</Link>
                        <HiChevronRight />
                        <Link to="/about" className="hover:text-white transition">About</Link>
                        <HiChevronRight />
                        <span>Leadership</span>
                    </div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold mb-6"
                    >
                        Our Leadership
                    </motion.h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        "Obey your leaders and submit to them, for they are keeping watch over your souls, as those who will have to give an account."
                        <span className="block mt-2 text-cyan-500 font-bold text-base not-italic">— Hebrews 13:17</span>
                    </p>
                </div>
            </div>

            {/* SENIOR LEADERSHIP */}
            <section className="py-24 px-4 max-w-7xl mx-auto">
                <motion.div {...fadeInUp} className="text-center mb-16">
                    <h2 className="text-sm font-bold text-cyan-500 tracking-widest uppercase mb-2">Pastoral Team</h2>
                    <h2 className="text-4xl font-bold text-gray-900">Senior Leadership</h2>
                </motion.div>

                <div className="space-y-24">
                    {/* Pastor Solomon */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-gray-100 rounded-2xl overflow-hidden aspect-[3/4] md:aspect-square relative"
                        >
                            <img
                                src={pastorSolomon}
                                alt="Pastor Solomon Adelakun"
                                className="w-full h-full object-cover object-top"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-3xl font-bold text-gray-900 mb-2">Pastor Adeyemi Solomon Adelakun</h3>
                            <p className="text-cyan-600 font-bold uppercase tracking-wide mb-6">Senior Pastor</p>
                            <div className="prose text-gray-600 mb-8 space-y-4">
                                <p>
                                    As the Senior Pastor of Faith Assembly, Pastor Solomon carries a divine mandate to teach the undiluted Word of God and shepherd God's people with wisdom and integrity. His visionary leadership has guided the church from its humble beginnings to becoming a pillar of faith in the Uxbridge community.
                                </p>
                                <p>
                                    He is passionate about raising believers who are grounded in scripture and empowered by the Holy Spirit to impact their world.
                                </p>
                            </div>
                            <a href="mailto:pastor@faithassembly.org.uk" className="inline-flex items-center text-gray-900 font-semibold hover:text-cyan-600 transition-colors">
                                <HiMail className="w-5 h-5 mr-2" />
                                pastor@faithassembly.org.uk
                            </a>
                        </motion.div>
                    </div>

                    {/* Pastor Ola */}
                    <div className="grid md:grid-cols-2 gap-12 items-center md:items-start">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-2 md:order-1"
                        >
                            <h3 className="text-3xl font-bold text-gray-900 mb-2">Pastor Adeola Adeoti Adelakun</h3>
                            <p className="text-cyan-600 font-bold uppercase tracking-wide mb-6">Pastor & Women's Ministry Lead</p>
                            <div className="prose text-gray-600 mb-8 space-y-4">
                                <p>
                                    Pastor Ola stands alongside Pastor Solomon in ministry, bringing a mother's heart and a warrior's spirit to the leadership team. She oversees the Women's Ministry, nurturing women to walk in their God-given identity and purpose.
                                </p>
                                <p>
                                    Her dedication to prayer and family values strengthens the very fabric of our church community.
                                </p>
                            </div>
                            <a href="mailto:women@faithassembly.org.uk" className="inline-flex items-center text-gray-900 font-semibold hover:text-cyan-600 transition-colors">
                                <HiMail className="w-5 h-5 mr-2" />
                                women@faithassembly.org.uk
                            </a>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-gray-100 rounded-2xl overflow-hidden aspect-[3/4] md:aspect-square relative order-1 md:order-2"
                        >
                            <img
                                src={pastorOla}
                                alt="Pastor Ola Adelakun"
                                className="w-full h-full object-cover object-top"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* TRUSTEES */}
            <section className="bg-slate-50 py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeInUp} className="text-center mb-16">
                        <h2 className="text-sm font-bold text-cyan-500 tracking-widest uppercase mb-2">Governance</h2>
                        <h2 className="text-3xl font-bold text-gray-900">Board of Trustees</h2>
                        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                            Men of integrity responsible for the legal, financial, and administrative stewardship of the church.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {TRUSTEES.map((trustee, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-all"
                            >
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                    <span className="font-bold text-xl">{trustee.name.charAt(0)}</span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{trustee.name}</h3>
                                <p className="text-cyan-600 text-sm font-medium">{trustee.role}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* MINISTRY HEADS */}
            <section className="py-24 px-4 max-w-7xl mx-auto">
                <motion.div {...fadeInUp} className="text-center mb-16">
                    <h2 className="text-sm font-bold text-cyan-500 tracking-widest uppercase mb-2">Team Leaders</h2>
                    <h2 className="text-3xl font-bold text-gray-900">Transformation Team Heads</h2>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                    {MINISTRIES.map((min, idx) => (
                        <div key={idx} className="flex items-start p-4 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="bg-cyan-100/50 text-cyan-600 p-3 rounded-lg mr-4 shrink-0">
                                <HiUserGroup className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">{min.title}</h4>
                                <p className="text-gray-500 text-sm mb-1">{min.lead}</p>
                                <a href={`mailto:${min.email}`} className="text-xs text-cyan-600 hover:text-cyan-800 underline">
                                    {min.email}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="bg-cyan-600 py-20 px-4 text-center">
                <div className="max-w-3xl mx-auto text-white">
                    <h2 className="text-3xl font-bold mb-4">Called to Serve?</h2>
                    <p className="text-cyan-100 mb-8 max-w-xl mx-auto">
                        God has given everyone a gift to serve the body of Christ. If you would like to join any of our ministry teams, we would love to have you.
                    </p>
                    <Link
                        to="/volunteer"
                        className="inline-block bg-white text-cyan-700 px-8 py-3 rounded-full font-bold hover:bg-cyan-50 transition shadow-lg"
                    >
                        Join the Team
                    </Link>
                </div>
            </section>

        </div>
    );
};

export default Leadership;
