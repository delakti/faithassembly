import React, { useState, useEffect } from 'react';
import { HiMusicNote, HiSearch, HiFilter, HiPlay, HiDocumentText, HiPlus } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import type { WorshipSong } from '../../types/worship';

const WorshipLibrary: React.FC = () => {
    const [songs, setSongs] = useState<WorshipSong[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterKey, setFilterKey] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'worship_songs'), orderBy('title', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setSongs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorshipSong)));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const filteredSongs = songs.filter(song =>
        (song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            song.artist.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterKey === 'All' || song.key === filterKey)
    );

    const handleAction = (action: string, title: string) => {
        toast.success(`${action} for "${title}"`);
    };

    return (
        <div className="space-y-8 font-sans text-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 border-b border-white/10 pb-8">
                <div className="border-l-4 border-blue-500 pl-6">
                    <span className="text-blue-500 font-bold tracking-widest uppercase text-xs mb-2 block">Repertoire Database</span>
                    <h1 className="text-4xl md:text-5xl font-serif text-white">Library</h1>
                    <p className="text-gray-400 font-medium mt-2 max-w-xl">
                        Approved songs, chord charts, and demo tracks.
                    </p>
                </div>

                <button className="px-6 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs rounded hover:bg-gray-200 transition-colors flex items-center gap-2 shadow-lg shadow-white/10">
                    <HiPlus className="w-4 h-4" /> Suggest New Song
                </button>
            </div>

            {/* Search & Filter */}
            <div className="bg-neutral-900/50 border border-white/10 p-4 rounded-xl flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <HiSearch className="absolute left-4 top-3.5 text-gray-500 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="SEARCH TITLES, ARTISTS..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-lg bg-black/50 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 border border-white/5"
                    />
                </div>
                <div className="md:w-48 relative">
                    <HiFilter className="absolute left-4 top-3.5 text-gray-500 w-5 h-5" />
                    <select
                        value={filterKey}
                        onChange={(e) => setFilterKey(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-lg bg-black/50 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 border border-white/5 appearance-none cursor-pointer"
                    >
                        <option value="All">All Keys</option>
                        <option value="C">Key of C</option>
                        <option value="G">Key of G</option>
                        <option value="D">Key of D</option>
                        <option value="A">Key of A</option>
                        <option value="E">Key of E</option>
                        <option value="Ab">Key of Ab</option>
                        <option value="Bb">Key of Bb</option>
                    </select>
                </div>
            </div>

            {loading && <p className="text-gray-500">Loading songs...</p>}

            {/* Song Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSongs.map((song) => (
                    <div key={song.id} className="bg-neutral-900/30 border border-white/10 rounded-xl p-6 hover:bg-neutral-900/60 hover:border-blue-500/30 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-900/20 flex items-center justify-center text-blue-400 font-serif font-bold border border-blue-500/20">
                                {song.key}
                            </div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border border-white/10 px-2 py-1 rounded">
                                {song.tempo}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{song.title}</h3>
                        <p className="text-gray-500 text-sm mb-6 font-medium uppercase tracking-wide">{song.artist}</p>

                        <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-4">
                            <button
                                onClick={() => handleAction('Opening Lyrics', song.title)}
                                disabled={!song.lyrics}
                                className={`py-2 rounded flex flex-col items-center justify-center text-[10px] font-bold uppercase tracking-wider transition-colors ${song.lyrics ? 'text-gray-300 hover:bg-white/5 hover:text-white' : 'text-gray-700 cursor-not-allowed'}`}
                            >
                                <HiDocumentText className="w-5 h-5 mb-1" />
                                Lyrics
                            </button>
                            <button
                                onClick={() => handleAction('Opening Chart', song.title)}
                                disabled={!song.chords}
                                className={`py-2 rounded flex flex-col items-center justify-center text-[10px] font-bold uppercase tracking-wider transition-colors ${song.chords ? 'text-gray-300 hover:bg-white/5 hover:text-white' : 'text-gray-700 cursor-not-allowed'}`}
                            >
                                <HiMusicNote className="w-5 h-5 mb-1" />
                                Chords
                            </button>
                            <button
                                onClick={() => handleAction('Playing Demo', song.title)}
                                disabled={!song.demo}
                                className={`py-2 rounded flex flex-col items-center justify-center text-[10px] font-bold uppercase tracking-wider transition-colors ${song.demo ? 'text-gray-300 hover:bg-white/5 hover:text-white' : 'text-gray-700 cursor-not-allowed'}`}
                            >
                                <HiPlay className="w-5 h-5 mb-1" />
                                Demo
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredSongs.length === 0 && !loading && (
                <div className="text-center py-20 opacity-50">
                    <HiMusicNote className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <p className="text-xl text-gray-400 font-serif">No songs found in the archives.</p>
                </div>
            )}
        </div>
    );
};

export default WorshipLibrary;
