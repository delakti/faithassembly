import React from 'react';
import { Link } from 'react-router-dom';
import { FaFilePdf, FaVideo, FaBookmark } from 'react-icons/fa';
import type { StudyGuide } from '../../types/bibleStudy';

interface StudyGuideCardProps {
    guide: StudyGuide;
}

const StudyGuideCard: React.FC<StudyGuideCardProps> = ({ guide }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
            {/* Thumbnail / Placeholder */}
            <div className="h-40 bg-purple-50 flex items-center justify-center relative">
                {guide.thumbnailUrl ? (
                    <img src={guide.thumbnailUrl} alt={guide.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="text-purple-300">
                        {guide.type === 'pdf' ? <FaFilePdf className="text-5xl" /> : <FaVideo className="text-5xl" />}
                    </div>
                )}
                <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${guide.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                        guide.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                        {guide.level}
                    </span>
                </div>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-md">
                        {guide.category}
                    </span>
                    <button className="text-gray-400 hover:text-purple-600 transition">
                        <FaBookmark />
                    </button>
                </div>

                <Link to={`/bible-study/${guide.id}`}>
                    <h3 className="text-lg font-bold text-gray-900 mb-1 hover:text-purple-600 transition">
                        {guide.title}
                    </h3>
                </Link>

                <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                    {guide.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <span>{guide.author}</span>
                    </div>
                    <Link
                        to={`/bible-study/${guide.id}`}
                        className="text-sm font-semibold text-purple-600 hover:text-purple-700 hover:underline"
                    >
                        View Guide &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default StudyGuideCard;
