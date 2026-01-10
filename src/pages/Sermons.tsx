import React, { useEffect, useState } from 'react';
import { FaPlayCircle, FaSpotify, FaYoutube } from 'react-icons/fa';

const YOUTUBE_CHANNEL_ID = "UCI8g_7iBvboeQteg-vH9lXg";
const YOUTUBE_RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;
const RSS2JSON_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(YOUTUBE_RSS_URL)}`;

interface Video {
    title: string;
    link: string;
    pubDate: string;
    thumbnail: string;
    guid: string;
}

const Sermons: React.FC = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const res = await fetch(RSS2JSON_URL);
            const data = await res.json();
            if (data.items) {
                const formattedVideos = data.items.map((item: any) => ({
                    title: item.title,
                    link: item.link,
                    pubDate: new Date(item.pubDate).toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    }),
                    // High res thumbnail trick for YouTube
                    thumbnail: `https://i.ytimg.com/vi/${item.guid.split(':')[2]}/maxresdefault.jpg`,
                    guid: item.guid
                }));
                setVideos(formattedVideos);
            }
        } catch (error) {
            console.error("Failed to fetch YouTube videos", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-24 px-4 max-w-7xl mx-auto min-h-screen pb-12">
            <h1 className="text-4xl font-bold mb-2">Sermons & Worship</h1>
            <p className="text-gray-500 mb-8">Catch up on the latest messages and listen to our worship.</p>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <>
                    {/* Featured / Latest Sermon */}
                    {videos.length > 0 && (
                        <div className="relative h-[50vh] min-h-[400px] rounded-2xl overflow-hidden bg-gray-900 mb-12 group shadow-xl">
                            <a href={videos[0].link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                                <img
                                    src={videos[0].thumbnail}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition duration-500"
                                    alt="Featured"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full group-hover:scale-110 transition duration-300">
                                        <FaPlayCircle className="text-6xl text-white drop-shadow-lg" />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-black/80 to-transparent">
                                    <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-bold rounded mb-2 uppercase tracking-wide">
                                        Latest Message
                                    </span>
                                    <h2 className="text-2xl md:text-4xl text-white font-bold mb-2 shadow-black drop-shadow-md">{videos[0].title}</h2>
                                    <p className="text-gray-200 font-medium flex items-center">
                                        <FaYoutube className="mr-2 text-red-500" />
                                        {videos[0].pubDate}
                                    </p>
                                </div>
                            </a>
                        </div>
                    )}

                    {/* Content Grid: Videos & Spotify */}
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Recent Videos Column (Span 2) */}
                        <div className="lg:col-span-2">
                            <h3 className="text-2xl font-bold mb-6 flex items-center">
                                <FaYoutube className="text-red-600 mr-2" />
                                Recent Messages
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                {videos.slice(1, 7).map((video) => (
                                    <a
                                        key={video.guid}
                                        href={video.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
                                    >
                                        <div className="relative aspect-video bg-gray-200 overflow-hidden">
                                            <img
                                                src={video.thumbnail}
                                                alt={video.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition duration-300">
                                                <FaPlayCircle className="text-4xl text-white" />
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight mb-2">
                                                {video.title}
                                            </h4>
                                            <p className="text-xs text-gray-500">{video.pubDate}</p>
                                        </div>
                                    </a>
                                ))}
                            </div>

                            <div className="mt-8 text-center">
                                <a
                                    href="https://www.youtube.com/@faithassemblyuk"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                >
                                    View All on YouTube
                                </a>
                            </div>
                        </div>

                        {/* Sidebar: Spotify */}
                        <div>
                            <h3 className="text-2xl font-bold mb-6 flex items-center">
                                <FaSpotify className="text-green-500 mr-2" />
                                Listen on Spotify
                            </h3>
                            <div className="bg-black rounded-3xl overflow-hidden shadow-lg sticky top-24">
                                <iframe
                                    style={{ borderRadius: '12px' }}
                                    src="https://open.spotify.com/embed/artist/3F1j870mdry7yJpQXX4bOU?utm_source=generator&theme=0"
                                    width="100%"
                                    height="450"
                                    frameBorder="0"
                                    allowFullScreen
                                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                    loading="lazy"
                                    title="Faith Assembly Spotify"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
export default Sermons;
