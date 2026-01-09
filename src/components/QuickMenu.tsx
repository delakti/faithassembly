import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiX,
    HiHome,
    HiCalendar,
    HiShoppingBag,
    HiChevronDown,
    HiChevronUp
} from 'react-icons/hi';
import { FaPrayingHands, FaCross, FaHandHoldingHeart } from 'react-icons/fa';

interface QuickMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const QuickMenu: React.FC<QuickMenuProps> = ({ isOpen, onClose }) => {
    // State for Accordion sections
    const [openSection, setOpenSection] = useState<string | null>(null);

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    const menuVariants = {
        hidden: { x: '100%' },
        visible: { x: 0 },
        exit: { x: '100%' }
    };

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={overlayVariants}
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <motion.div
                        className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[60] overflow-y-auto shadow-2xl"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={menuVariants}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    >
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-gray-900">Menu</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <HiX className="w-8 h-8 text-gray-500" />
                                </button>
                            </div>

                            {/* Menu Items */}
                            <div className="space-y-4">
                                <MenuItem to="/" icon={<HiHome />} title="Home" onClose={onClose} />

                                {/* About Section */}
                                <AccordionItem title="About Us" isOpen={openSection === 'about'} onClick={() => toggleSection('about')}>
                                    <SubMenuItem to="/about" title="Our Story & Beliefs" onClose={onClose} />
                                    <SubMenuItem to="/about#mission" title="Mission & Vision" onClose={onClose} />
                                    <SubMenuItem to="/about#pastors" title="Leadership" onClose={onClose} />
                                    <SubMenuItem to="/contact" title="Contact Us" onClose={onClose} />
                                </AccordionItem>

                                {/* Services Section */}
                                <AccordionItem title="Services" isOpen={openSection === 'services'} onClick={() => toggleSection('services')}>
                                    <SubMenuItem to="/services" title="Service Times" onClose={onClose} />
                                    <SubMenuItem to="/sermons" title="Watch Sermons" onClose={onClose} />
                                    <SubMenuItem to="/plan-visit" title="Plan Your Visit" onClose={onClose} />
                                </AccordionItem>

                                {/* Ministries Section */}
                                <AccordionItem title="Ministries" isOpen={openSection === 'ministries'} onClick={() => toggleSection('ministries')}>
                                    <SubMenuItem to="/groups" title="Groups & Connect" onClose={onClose} />
                                    <SubMenuItem to="/bible-study" title="Bible Study" onClose={onClose} />
                                    <SubMenuItem to="/children/login" title="Children's Ministry" onClose={onClose} />
                                    <SubMenuItem to="/volunteer" title="Volunteer" onClose={onClose} />
                                </AccordionItem>

                                <MenuItem to="/events" icon={<HiCalendar />} title="Events" onClose={onClose} />
                                <MenuItem to="/give" icon={<FaHandHoldingHeart />} title="Give" onClose={onClose} />
                                <MenuItem to="/store" icon={<HiShoppingBag />} title="Store" onClose={onClose} />

                                <hr className="border-gray-100 my-4" />

                                <MenuItem to="/salvation" icon={<FaCross />} title="Salvation" desc="Decided to follow Jesus?" onClose={onClose} />
                                <MenuItem to="/prayer" icon={<FaPrayingHands />} title="Need Prayer?" onClose={onClose} />
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

interface MenuItemProps {
    to: string;
    icon?: React.ReactNode;
    title: string;
    desc?: string;
    onClose: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ to, icon, title, desc, onClose }) => {
    return (
        <Link to={to} onClick={onClose} className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group">
            {icon && <div className="text-xl text-gray-500 mr-4 group-hover:text-cyan-600">{icon}</div>}
            <div>
                <h3 className="font-semibold text-gray-900">{title}</h3>
                {desc && <p className="text-xs text-gray-500">{desc}</p>}
            </div>
        </Link>
    );
};

interface SubMenuItemProps {
    to: string;
    title: string;
    onClose: () => void;
}

const SubMenuItem: React.FC<SubMenuItemProps> = ({ to, title, onClose }) => (
    <Link to={to} onClick={onClose} className="block py-2 pl-4 text-gray-600 hover:text-cyan-600 hover:bg-gray-50 rounded-md transition-colors text-sm">
        {title}
    </Link>
);

interface AccordionItemProps {
    title: string;
    isOpen: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, isOpen, onClick, children }) => (
    <div className="border border-gray-100 rounded-lg overflow-hidden">
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between p-3 font-semibold transition-colors ${isOpen ? 'bg-gray-50 text-cyan-600' : 'text-gray-900 hover:bg-gray-50'}`}
        >
            <span>{title}</span>
            {isOpen ? <HiChevronUp /> : <HiChevronDown />}
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white border-t border-gray-50"
                >
                    <div className="p-2 space-y-1">
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

export default QuickMenu;
