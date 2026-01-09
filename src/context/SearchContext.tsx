import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface SearchContextType {
    isSearchOpen: boolean;
    openSearch: () => void;
    closeSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const openSearch = () => {
        setIsSearchOpen(true);
        // Prevent background scrolling
        document.body.style.overflow = 'hidden';
    };

    const closeSearch = () => {
        setIsSearchOpen(false);
        // Restore scrolling
        document.body.style.overflow = 'unset';
    };

    return (
        <SearchContext.Provider value={{ isSearchOpen, openSearch, closeSearch }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
};
