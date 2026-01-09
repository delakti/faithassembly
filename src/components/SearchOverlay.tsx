import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiSearch, HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import type { SearchItem } from '../types/search';
// Placeholder for search service - to be implemented next
// import { searchContent } from '../services/SearchService'; 

// Mock Data for Phase 1 Testing
const MOCK_INDEX: SearchItem[] = [
    { id: '1', title: 'Sunday Service', description: 'Join us every Sunday at 10 AM.', category: 'Service', tags: ['worship', 'sunday'], url: '/services', accessLevel: 'public', updatedAt: new Date().toISOString() },
    { id: '2', title: 'About Faith Assembly', description: 'Learn about our history and beliefs.', category: 'Page', tags: ['about', 'mission'], url: '/about', accessLevel: 'public', updatedAt: new Date().toISOString() },
    { id: '3', title: 'Member Dashboard', description: 'Manage your giving and profile.', category: 'Page', tags: ['members', 'dashboard'], url: '/members', accessLevel: 'member', updatedAt: new Date().toISOString() },
    { id: '4', title: 'Admin Login', description: 'Portal for church administration.', category: 'Admin', tags: ['admin', 'login'], url: '/admin/login', accessLevel: 'public', updatedAt: new Date().toISOString() },
    { id: '5', title: 'Give Online', description: 'Support the church financially.', category: 'Page', tags: ['give', 'tithe'], url: '/give', accessLevel: 'public', updatedAt: new Date().toISOString() },
];

const SearchOverlay: React.FC = () => {
    const { isSearchOpen, closeSearch } = useSearch();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchItem[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when opened
    useEffect(() => {
        if (isSearchOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isSearchOpen]);

    // Handle Search Logic (Client-side Mock)
    useEffect(() => {
        if (query.trim() === '') {
            setResults([]);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const filtered = MOCK_INDEX.filter(item =>
            item.title.toLowerCase().includes(lowerQuery) ||
            item.description.toLowerCase().includes(lowerQuery) ||
            item.tags.some(tag => tag.includes(lowerQuery))
        );
        setResults(filtered);
    }, [query]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            closeSearch();
        }
    };

    return (
        <AnimatePresence>
            {isSearchOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-black/80 z-[100] backdrop-blur-sm flex items-start justify-center pt-20 px-4"
                    onClick={handleBackdropClick}
                >
                    <motion.div
                        initial={{ y: -50, scale: 0.95 }}
                        animate={{ y: 0, scale: 1 }}
                        exit={{ y: -50, scale: 0.95 }}
                        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Search Input Header */}
                        <div className="flex items-center p-4 border-b border-gray-100">
                            <HiSearch className="text-gray-400 w-6 h-6 ml-2" />
                            <input
                                ref={inputRef}
                                type="text"
                                className="w-full flex-1 px-4 py-3 text-lg text-gray-900 placeholder-gray-400 outline-none bg-transparent"
                                placeholder="Search events, sermons, pages..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <button
                                onClick={closeSearch}
                                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-gray-500"
                            >
                                <HiX className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Results Area */}
                        <div className="max-h-[60vh] overflow-y-auto p-4 bg-gray-50">
                            {query === '' && (
                                <div className="text-center py-12 text-gray-400">
                                    <HiSearch className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>Type to start searching...</p>
                                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                                        <button onClick={() => setQuery('Service')} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs hover:border-cyan-500 transition">Services</button>
                                        <button onClick={() => setQuery('Give')} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs hover:border-cyan-500 transition">Giving</button>
                                        <button onClick={() => setQuery('Events')} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs hover:border-cyan-500 transition">Events</button>
                                    </div>
                                </div>
                            )}

                            {query !== '' && results.length === 0 && (
                                <div className="text-center py-12 text-gray-500">
                                    <HiOutlineExclamationCircle className="w-10 h-10 mx-auto mb-2 text-yellow-500" />
                                    <p>No results found for "{query}".</p>
                                </div>
                            )}

                            {results.length > 0 && (
                                <div className="space-y-2">
                                    {results.map((item) => (
                                        <Link
                                            key={item.id}
                                            to={item.url}
                                            onClick={closeSearch}
                                            className="block bg-white p-4 rounded-xl border border-gray-100 hover:border-cyan-500 hover:shadow-md transition-all group"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-cyan-600 transition-colors">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                                                </div>
                                                <span className={`
                                                    px-2 py-1 rounded text-xs font-bold uppercase tracking-wide
                                                    ${item.category === 'Service' ? 'bg-purple-100 text-purple-700' : ''}
                                                    ${item.category === 'Event' ? 'bg-orange-100 text-orange-700' : ''}
                                                    ${item.category === 'Page' ? 'bg-gray-100 text-gray-700' : ''}
                                                    ${item.category === 'Admin' ? 'bg-red-100 text-red-700' : ''}
                                                `}>
                                                    {item.category}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer Hint */}
                        <div className="p-2 bg-white border-t border-gray-100 text-center text-xs text-gray-400">
                            Press <strong>ESC</strong> to close
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SearchOverlay;
