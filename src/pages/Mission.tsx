import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiLightningBolt, HiHeart, HiUserGroup, HiBookOpen, HiGlobeAlt, HiSparkles } from 'react-icons/hi';

const VALUES = [
    {
        title: "Christ-Centered Living",
        desc: "Everything we do revolves around Jesus. We strive to reflect His character in our daily lives.",
        icon: <HiSparkles className="w-8 h-8" />,
        verse: "Colossians 1:18"
    },
    {
        title: "Prayer & The Word",
        desc: "We believe in the power of prayer and the authority of Scripture as our foundation.",
        icon: <HiBookOpen className="w-8 h-8" />,
        verse: "1 Thessalonians 5:17"
    },
    {
        title: "Love & Fellowship",
        desc: "We are a family. We love deeply, forgive freely, and support one another.",
        icon: <HiHeart className="w-8 h-8" />,
        verse: "John 13:35"
    },
    {
        title: "Evangelism",
        desc: "We are passionate about sharing the Good News and reaching the lost.",
        icon: <HiGlobeAlt className="w-8 h-8" />,
        verse: "Mark 16:15"
    },
    {
        title: "Discipleship",
        desc: "We are committed to growing in maturity and helping others do the same.",
        icon: <HiUserGroup className="w-8 h-8" />,
        verse: "Matthew 28:19"
    },
    {
        title: "Integrity",
        desc: "We walk in honesty and holiness, honouring God in public and private.",
        icon: <HiLightningBolt className="w-8 h-8" />,
        verse: "Proverbs 11:3"
    }
];

const Mission: React.FC = () => {
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
            {/* HERO SECTION */}
            <div className="relative h-[60vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")' }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/80 to-purple-900/40 mix-blend-multiply" />

                <div className="relative z-10 text-center px-4 pt-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
                            Mission & <span className="text-cyan-400">Vision</span>
                        </h1>
                        <p className="text-xl md:text-2xl font-light text-gray-100 max-w-2xl mx-auto">
                            "Where there is no vision, the people perish." <span className="text-cyan-300 text-base block mt-2 font-semibold">- Proverbs 29:18</span>
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* MISSION SECTION */}
            <section className="py-24 px-4 max-w-7xl mx-auto text-center">
                <motion.div {...fadeInUp}>
                    <h2 className="text-sm font-bold text-cyan-500 tracking-widest uppercase mb-4">Our Mission</h2>
                    <h3 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight max-w-4xl mx-auto">
                        "To raise Christlike disciples and extend God’s kingdom in Uxbridge and beyond."
                    </h3>
                    <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-10 rounded-full" />
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        We fulfill this mission through passionate <strong>worship</strong>, biblical <strong>teaching</strong>, authentic <strong>community</strong>, and active <strong>evangelism</strong>. We are called not just to attend church, but to <em>be</em> the church.
                    </p>
                    <div className="mt-8 inline-block bg-gray-50 px-6 py-3 rounded-lg border border-gray-200">
                        <p className="text-gray-500 italic font-serif">
                            “Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit...”
                            <br /><span className="text-cyan-600 font-bold not-italic text-sm mt-1 block">- Matthew 28:19</span>
                        </p>
                    </div>
                </motion.div>
            </section>

            {/* VISION SECTION */}
            <section className="bg-slate-50 py-24 px-4 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-sm font-bold text-cyan-500 tracking-widest uppercase mb-4">Our Vision</h2>
                            <h3 className="text-4xl font-bold text-gray-900 mb-6">What We See for the Future</h3>
                            <div className="space-y-6">
                                <VisionItem number="01" title="Spiritual Maturity" desc="A church where every member is growing deep in the Word and strong in prayer." />
                                <VisionItem number="02" title="Community Transformation" desc="Impacting Uxbridge through social action, food banks, and serving the needy." />
                                <VisionItem number="03" title="Next Generation" desc="Empowering children and youth to become bold leaders for Christ in their generation." />
                                <VisionItem number="04" title="Global Mission" desc="Planting churches and supporting missions worldwide to reach the unreached." />
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-cyan-500 rounded-3xl transform rotate-3 opacity-10"></div>
                            <img
                                src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                                alt="Vision"
                                className="relative rounded-3xl shadow-2xl z-10"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CORE VALUES */}
            <section className="py-24 px-4 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900">Our Core Values</h2>
                    <p className="text-gray-500 mt-4">The principles that guide our culture and decisions.</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {VALUES.map((val, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-cyan-100 transition-all group"
                        >
                            <div className="text-cyan-500 mb-6 bg-cyan-50 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                {val.icon}
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-3">{val.title}</h4>
                            <p className="text-gray-600 mb-4 leading-relaxed">{val.desc}</p>
                            <div className="text-xs font-bold text-cyan-600 uppercase tracking-wide">{val.verse}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="bg-gray-900 py-24 px-4 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Be Part of the Story</h2>
                    <p className="text-xl text-gray-400 mb-10">
                        God is doing something amazing at Faith Assembly. There is a place for you here.
                    </p>
                    <Link
                        to="/volunteer"
                        className="inline-block bg-cyan-500 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30 transition-all transform hover:-translate-y-1"
                    >
                        Join the Mission
                    </Link>
                </div>
            </section>
        </div>
    );
};

const VisionItem = ({ number, title, desc }: { number: string, title: string, desc: string }) => (
    <div className="flex gap-4">
        <div className="text-2xl font-bold text-cyan-200 font-mono">{number}</div>
        <div>
            <h4 className="text-lg font-bold text-gray-900 mb-1">{title}</h4>
            <p className="text-gray-600 leading-relaxed">{desc}</p>
        </div>
    </div>
);

export default Mission;
