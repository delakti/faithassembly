import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiX,
    HiHome,
    HiPlay,
    HiUserGroup,
    HiHeart,
    HiCalendar,
    HiBookOpen,
    HiShoppingBag,
    HiChatAlt2
} from 'react-icons/hi';
import { FaPrayingHands, FaCross, FaWater, FaHandHoldingHeart } from 'react-icons/fa';

interface QuickMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const QuickMenu: React.FC<QuickMenuProps> = ({ isOpen, onClose }) => {
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
                                <h2 className="text-2xl font-bold text-gray-900">Get Involved</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <HiX className="w-8 h-8 text-gray-500" />
                                </button>
                            </div>

                            {/* Menu Items */}
                            <div className="space-y-6">
                                <MenuItem to="/plan-visit" icon={<HiHome />} title="Visit Faith Assembly" desc="Find a location near you" onClose={onClose} />
                                <MenuItem to="/sermons" icon={<HiPlay />} title="Live Streams" desc="Join us from anywhere" onClose={onClose} />
                                <MenuItem to="/groups" icon={<HiUserGroup />} title="Groups" desc="Relationships to grow your faith" onClose={onClose} />
                                <MenuItem to="/give" icon={<FaHandHoldingHeart />} title="Giving" desc="Generosity in action" onClose={onClose} />
                                <MenuItem to="/volunteer" icon={<HiHeart />} title="Volunteer" desc="Serve at your local campus" onClose={onClose} />
                                <MenuItem to="/events" icon={<HiCalendar />} title="Events" desc="Meaningful experiences" onClose={onClose} />
                                <MenuItem to="/salvation" icon={<FaCross />} title="Salvation" desc="Receive God's grace" onClose={onClose} />
                                <MenuItem to="/baptism" icon={<FaWater />} title="Baptism" desc="Celebrate new beginnings" onClose={onClose} />
                                <MenuItem to="/prayer" icon={<FaPrayingHands />} title="Need Prayer?" desc="Support through faith" onClose={onClose} />
                            </div>

                            <hr className="my-8 border-gray-100" />

                            {/* Discover Section */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Discover</h2>
                                <div className="space-y-6">
                                    <MenuItem to="/sermons" icon={<HiBookOpen />} title="Sermons" onClose={onClose} />
                                    <MenuItem to="/study-guides" icon={<HiChatAlt2 />} title="Study Guides" onClose={onClose} />
                                    <MenuItem to="/store" icon={<HiShoppingBag />} title="Store" isExternal onClose={onClose} />
                                </div>
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
    icon: React.ReactNode;
    title: string;
    desc?: string;
    isExternal?: boolean;
    onClose: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ to, icon, title, desc, isExternal, onClose }) => {
    return (
        <Link to={to} onClick={onClose} className="flex items-start group">
            <div className="text-2xl text-gray-900 mt-1 mr-4 group-hover:text-cyan-600 transition-colors">
                {icon}
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-cyan-600 transition-colors">
                    {title} {isExternal && <span className="text-xs align-top ml-1">↗</span>}
                </h3>
                {desc && <p className="text-gray-500 text-sm">{desc}</p>}
            </div>
        </Link>
    );
};

export default QuickMenu;
