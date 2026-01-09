import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiDownload, HiCheck } from 'react-icons/hi';
import pastorSolomon from '../assets/pastor-solomon.png';
import pastorOla from '../assets/pastor-ola.jpg';

const BELIEFS = [
    {
        title: "God the Father",
        desc: "We believe in one God, eternal and self-existent, the Creator of heaven and earth. He is the Father, the Almighty, who deeply loves His creation.",
        scripture: "Genesis 1:1, Matthew 6:9"
    },
    {
        title: "The Holy Trinity",
        desc: "We believe in the unity of the Godhead, three distinct persons—Father, Son, and Holy Spirit—co-equal, co-existent, and co-eternal.",
        scripture: "Matthew 28:19, 2 Corinthians 13:14"
    },
    {
        title: "The Virgin Birth",
        desc: "We believe Jesus Christ was conceived by the Holy Spirit and born of the Virgin Mary. He is fully God and fully man.",
        scripture: "Isaiah 7:14, Matthew 1:23"
    },
    {
        title: "Death & Resurrection",
        desc: "We believe Jesus died on the cross for our sins and rose bodily from the dead on the third day, securing our victory over death.",
        scripture: "1 Corinthians 15:3-4"
    },
    {
        title: "The Holy Spirit",
        desc: "We believe the Holy Spirit is a divine person, sent to indwell, guide, teach, and empower the believer and convince the world of sin.",
        scripture: "John 14:16-17, Acts 1:8"
    },
    {
        title: "Baptism of the Holy Spirit",
        desc: "We believe in the baptism of the Holy Spirit with the evidence of speaking in tongues, empowering believers for service.",
        scripture: "Acts 2:4, Acts 19:6"
    },
    {
        title: "Salvation by Grace",
        desc: "We believe salvation is a gift from God, received not by works but by faith in the finished work of Jesus Christ.",
        scripture: "Ephesians 2:8-9"
    },
    {
        title: "The Blood of Jesus",
        desc: "We believe in the cleansing power of the Blood of Jesus to wash away sin and provide healing and protection.",
        scripture: "1 John 1:7, Revelation 12:11"
    },
    {
        title: "The Second Coming",
        desc: "We believe in the personal, imminent return of our Lord Jesus Christ to gather His church and judge the world.",
        scripture: "1 Thessalonians 4:16-17"
    },
    {
        title: "The Holy Bible",
        desc: "We believe the Bible is the inspired, infallible, and authoritative Word of God, our guide for faith and conduct.",
        scripture: "2 Timothy 3:16, Psalm 119:105"
    }
];

const TIMELINE = [
    { year: "2016", title: "The Beginning", desc: "Faith Assembly was founded under the RCCG mandate to plant churches." },
    { year: "2017", title: "Uxbridge Campus", desc: "We established our roots in Uxbridge, becoming a beacon for the local community." },
    { year: "2021", title: "Community Expansion", desc: "Launched major outreach programs including youth services." },
    { year: "2024", title: "A New Vision", desc: "Pastors Solomon & Ola lead us into a new season of 'Building Disciples Who Make Disciples'." }
];

const About: React.FC = () => {
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
            {/* HER HERO SECTION */}
            <div className="relative h-[70vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-50"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-90" />

                <div className="relative z-10 text-center px-4 max-w-4xl pt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-cyan-400 font-bold tracking-widest uppercase mb-4 text-sm md:text-base">Established 1996</h2>
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
                            Our Story &<br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Beliefs</span>
                        </h1>
                        <p className="text-xl md:text-2xl font-light text-gray-200 max-w-2xl mx-auto">
                            A family of faith, driven by love, dedicated to the Great Commission.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* OUR STORY SECTION */}
            <section id="our-story" className="py-24 px-4 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <motion.div {...fadeInUp}>
                        <h3 className="text-cyan-600 font-bold text-lg mb-2">The Journey</h3>
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">From Humble Beginnings to a Global Vision</h2>
                        <div className="prose prose-lg text-gray-600 space-y-4">
                            <p>
                                <strong>Faith Assembly</strong> is a parish of The Redeemed Christian Church of God (RCCG), one of the fastest-growing church networks in the world. Our journey began with a simple mandate: to take the gospel to the ends of the earth.
                            </p>
                            <p>
                                Under the visionary leadership of <strong>Pastor Adeyemi Solomon Adelakun</strong> and <strong>Pastor Adeola Adeoti Adelakun</strong>, we have grown from a small fellowship into a vibrant, multicultural family in Uxbridge.
                            </p>
                            <p>
                                We are more than just a church content with having services; we are a movement dedicated to <em>"Building Disciples Who Make Disciples."</em> We believe that every believer is called to be a leader, and our passion is to equip you to fulfill your God-given purpose.
                            </p>
                        </div>
                    </motion.div>

                    {/* TIMELINE */}
                    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                        {TIMELINE.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                            >
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-cyan-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                    <HiCheck className="w-5 h-5" />
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-200 shadow-sm">
                                    <div className="flex items-center justify-between space-x-2 mb-1">
                                        <div className="font-bold text-slate-900">{item.title}</div>
                                        <time className="font-caveat font-medium text-cyan-600">{item.year}</time>
                                    </div>
                                    <div className="text-slate-500 text-sm">{item.desc}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* LEADERSHIP SECTION */}
            <section id="pastors" className="bg-slate-50 py-24 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div {...fadeInUp} className="mb-16">
                        <h2 className="text-4xl font-bold text-gray-900">Meet Our Pastors</h2>
                        <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">
                            Shepherds after God's own heart, dedicated to serving the flock and the community.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        {/* Pastor Solomon */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-xl"
                        >
                            <div className="h-96 relative bg-gray-200">
                                <img
                                    src={pastorSolomon}
                                    alt="Pastor Solomon"
                                    className="absolute inset-0 w-full h-full object-cover object-top"
                                />
                            </div>
                            <div className="p-8 text-left">
                                <h3 className="text-2xl font-bold text-gray-900">Pastor Solomon Adelakun</h3>
                                <p className="text-cyan-600 font-bold uppercase text-sm mb-4">Senior Pastor</p>
                                <p className="text-gray-600">
                                    With decades of ministry experience, Pastor Solomon is a father figure to many. He is passionate about teaching the uncompromising Word of God and seeing lives transformed by the power of the Holy Spirit.
                                </p>
                            </div>
                        </motion.div>

                        {/* Pastor Ola */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-xl"
                        >
                            <div className="h-96 relative bg-gray-200">
                                <img
                                    src={pastorOla}
                                    alt="Pastor Ola"
                                    className="absolute inset-0 w-full h-full object-cover object-top"
                                />
                            </div>
                            <div className="p-8 text-left">
                                <h3 className="text-2xl font-bold text-gray-900">Pastor Ola Adelakun</h3>
                                <p className="text-cyan-600 font-bold uppercase text-sm mb-4">Pastor</p>
                                <p className="text-gray-600">
                                    Pastor Ola is a dynamic leader with a heart for prayer and intercession. She leads the women's ministry and is deeply committed to nurturing strong, Godly families within the church.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* STATEMENT OF FAITH */}
            <section id="beliefs" className="py-24 px-4 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-bold text-cyan-500 tracking-widest uppercase mb-3">Our Foundation</h2>
                    <h2 className="text-4xl font-bold text-gray-900">What We Believe</h2>
                    <p className="text-lg text-gray-500 mt-4">The core doctrines that anchor our faith.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {BELIEFS.map((belief, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-cyan-200 transition-all"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{belief.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                {belief.desc}
                            </p>
                            <div className="text-xs font-semibold text-cyan-600 bg-cyan-50 inline-block px-2 py-1 rounded">
                                {belief.scripture}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <button className="inline-flex items-center text-gray-500 hover:text-cyan-600 font-semibold transition-colors">
                        <HiDownload className="mr-2" /> Download Full Statement of Faith (PDF)
                    </button>
                    <p className="text-xs text-gray-400 mt-2">*Full document coming soon</p>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="bg-cyan-600 py-20 px-4">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Come As You Are</h2>
                    <p className="text-xl md:text-2xl text-cyan-100 mb-10 font-light">
                        We'd love to meet you, hear your story, and welcome you home.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/plan-visit"
                            className="bg-white text-cyan-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-cyan-50 transition shadow-xl w-full sm:w-auto"
                        >
                            Plan Your Visit
                        </Link>
                        <Link
                            to="/contact"
                            className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition w-full sm:w-auto"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
