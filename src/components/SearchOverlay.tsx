import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiX,
    HiSearch,
    HiOutlineExclamationCircle,
    HiOutlineDesktopComputer, // Portal
    HiOutlineDocumentText,    // Page
    HiOutlineCalendar,        // Event
    HiOutlineCog,             // Admin
    HiOutlineCollection,      // Service/Resource
    HiLightningBolt
} from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import { SEARCH_INDEX, type SearchItem } from '../data/searchIndex';

// Weighted Search Function
const performSearch = (query: string): SearchItem[] => {
    if (!query) return [];

    const lowerQuery = query.toLowerCase();
    const terms = lowerQuery.split(' ').filter(t => t.length > 0);

    // transform items with a score
    const scored = SEARCH_INDEX.map(item => {
        let score = 0;

        // 1. Exact or Partial Title Match (High Priority)
        if (item.title.toLowerCase().includes(lowerQuery)) score += 20;

        // 2. Term matching
        terms.forEach(term => {
            if (item.title.toLowerCase().includes(term)) score += 10;
            if (item.tags.some(tag => tag.includes(term))) score += 5;
            if (item.description.toLowerCase().includes(term)) score += 2;
        });

        return { item, score };
    });

    // Filter out zero scores and sort by descending score
    return scored
        .filter(entry => entry.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(entry => entry.item)
        .slice(0, 8); // Limit to top 8 results
};

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

    // Handle Search
    useEffect(() => {
        if (query.trim() === '') {
            setResults([]);
            return;
        }
        setResults(performSearch(query));
    }, [query]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            closeSearch();
        }
    };

    const getIcon = (category: string) => {
        switch (category) {
            case 'Portal': return <HiOutlineDesktopComputer className="w-5 h-5" />;
            case 'Admin': return <HiOutlineCog className="w-5 h-5" />;
            case 'Event': return <HiOutlineCalendar className="w-5 h-5" />;
            case 'Page': return <HiOutlineDocumentText className="w-5 h-5" />;
            default: return <HiOutlineCollection className="w-5 h-5" />;
        }
    };

    const getColor = (category: string) => {
        switch (category) {
            case 'Portal': return 'bg-purple-100 text-purple-700';
            case 'Admin': return 'bg-slate-100 text-slate-700';
            case 'Event': return 'bg-orange-100 text-orange-700';
            case 'Service': return 'bg-sky-100 text-sky-700';
            case 'Resource': return 'bg-emerald-100 text-emerald-700';
            default: return 'bg-gray-100 text-gray-600';
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
                    className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm flex items-start justify-center pt-20 px-4"
                    onClick={handleBackdropClick}
                >
                    <motion.div
                        initial={{ y: -50, scale: 0.95 }}
                        animate={{ y: 0, scale: 1 }}
                        exit={{ y: -50, scale: 0.95 }}
                        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                    >
                        {/* Search Input Header */}
                        <div className="flex items-center p-4 border-b border-gray-100 relative">
                            <HiSearch className="text-gray-400 w-6 h-6 ml-2" />
                            <input
                                ref={inputRef}
                                type="text"
                                className="w-full flex-1 px-4 py-3 text-lg text-gray-900 placeholder-gray-400 outline-none bg-transparent"
                                placeholder="Search everything (e.g. 'Youth', 'Sunday', 'Give')..."
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
                        <div className="overflow-y-auto p-4 bg-gray-50/50 flex-1">
                            {query === '' && (
                                <div className="text-center py-12 text-gray-400">
                                    <HiLightningBolt className="w-12 h-12 mx-auto mb-3 text-amber-400" />
                                    <h3 className="text-gray-900 font-semibold mb-1">Quick Links</h3>
                                    <p className="text-sm mb-6">Try searching for common terms</p>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {['Sunday Service', 'Giving', 'Youth Portal', 'Life Discussion', 'Events'].map(term => (
                                            <button
                                                key={term}
                                                onClick={() => setQuery(term)}
                                                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-sky-500 hover:text-sky-600 transition shadow-sm"
                                            >
                                                {term}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {query !== '' && results.length === 0 && (
                                <div className="text-center py-12 text-gray-500">
                                    <HiOutlineExclamationCircle className="w-10 h-10 mx-auto mb-2 text-yellow-500" />
                                    <p>No results found for "{query}".</p>
                                    <button onClick={() => setQuery('')} className="mt-4 text-sky-600 font-medium hover:underline">Clear Search</button>
                                </div>
                            )}

                            {results.length > 0 && (
                                <div className="space-y-2">
                                    {results.map((item) => (
                                        <Link
                                            key={item.id}
                                            to={item.url}
                                            onClick={closeSearch}
                                            className="block bg-white p-4 rounded-xl border border-gray-200 hover:border-sky-400 hover:shadow-md transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-lg ${getColor(item.category)}`}>
                                                    {getIcon(item.category)}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center">
                                                        <h3 className="text-lg font-bold text-slate-800 group-hover:text-sky-600 transition-colors">
                                                            {item.title}
                                                        </h3>
                                                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                            {item.category}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-slate-500 mt-0.5">{item.description}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer Hint */}
                        <div className="p-3 bg-white border-t border-gray-100 text-center text-xs text-slate-400 font-medium">
                            {results.length > 0 ? `Found ${results.length} matches` : 'Type to search...'}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SearchOverlay;
