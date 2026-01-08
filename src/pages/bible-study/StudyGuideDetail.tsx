import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { StudyGuide } from '../../types/bibleStudy';
import { FaArrowLeft, FaFileDownload, FaBookmark, FaShareAlt } from 'react-icons/fa';

const StudyGuideDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [guide, setGuide] = useState<StudyGuide | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGuide = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, 'studyGuides', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setGuide({ id: docSnap.id, ...docSnap.data() } as StudyGuide);
                } else {
                    console.error("No such guide!");
                }
            } catch (error) {
                console.error("Error fetching guide:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGuide();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
    );

    if (!guide) return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-gray-900">Study Guide Not Found</h2>
            <Link to="/bible-study" className="mt-4 text-purple-600 hover:underline">
                Back to Portal
            </Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-5xl mx-auto px-4 py-8">
                <Link to="/bible-study" className="inline-flex items-center text-gray-500 hover:text-purple-600 mb-6 transition">
                    <FaArrowLeft className="mr-2" /> Back to Guides
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2">
                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold mb-4">
                            {guide.category}
                        </span>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{guide.title}</h1>
                        <div className="flex items-center text-sm text-gray-500 mb-6 space-x-4">
                            <span>By {guide.author}</span>
                            <span>•</span>
                            <span>{guide.level} Level</span>
                        </div>

                        <div className="prose max-w-none text-gray-700 mb-8">
                            <p className="text-lg leading-relaxed">{guide.description}</p>
                        </div>

                        {/* Media Viewer Logic */}
                        <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100">
                            {guide.type === 'pdf' ? (
                                <div>
                                    <FaFileDownload className="text-6xl text-purple-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Download Filter</h3>
                                    <p className="text-gray-500 mb-6">This guide is available as a PDF download.</p>
                                    <a
                                        href={guide.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition transform hover:-translate-y-1 shadow-lg"
                                    >
                                        <FaFileDownload className="mr-2" /> Download / View PDF
                                    </a>
                                </div>
                            ) : (
                                <div>
                                    {/* Placeholder for Video/HTML content */}
                                    <p className="text-gray-500">Content rendering for {guide.type} is coming soon.</p>
                                    <a href={guide.url} target="_blank" rel="noreferrer" className="text-purple-600 hover:underline">Open Source</a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Actions */}
                    <div className="md:col-span-1 space-y-4">
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 sticky top-24">
                            <h3 className="font-bold text-gray-900 mb-4">Actions</h3>
                            <button className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition mb-3">
                                <FaBookmark className="mr-2" /> Save for Later
                            </button>
                            <button className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition">
                                <FaShareAlt className="mr-2" /> Share Guide
                            </button>

                            <div className="mt-8">
                                <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
                                <div className="flex flex-wrap gap-2">
                                    {guide.tags.map((tag, i) => (
                                        <span key={i} className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-sm border border-gray-200">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudyGuideDetail;
