import React, { useState } from 'react';
import { HiX, HiPaperAirplane } from 'react-icons/hi';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

interface WallPostModalProps {
    onClose: () => void;
    onPostCreated: () => void;
}

const WallPostModal: React.FC<WallPostModalProps> = ({ onClose, onPostCreated }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        author: '',
        isAnonymous: false,
        category: 'Prayer Request', // Default
        title: '',
        content: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await addDoc(collection(db, 'esther_wall'), {
                author: formData.isAnonymous ? 'Anonymous' : formData.author,
                category: formData.category,
                title: formData.title,
                content: formData.content,
                likes: 0,
                comments: 0,
                createdAt: serverTimestamp()
            });

            toast.success("Post shared successfully!");
            onPostCreated();
            onClose();
        } catch (error) {
            console.error("Error creating post:", error);
            toast.error("Failed to share post. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl transform transition-all">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-rose-50/50 rounded-t-2xl">
                    <h2 className="text-xl font-serif text-rose-950">Share Your Heart</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <HiX className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Category Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">I am sharing a...</label>
                        <div className="flex gap-4">
                            <label className={`flex-1 cursor-pointer border-2 rounded-xl p-3 text-center transition-all ${formData.category === 'Prayer Request' ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold' : 'border-gray-100 text-gray-500 hover:border-rose-200'}`}>
                                <input
                                    type="radio"
                                    name="category"
                                    value="Prayer Request"
                                    className="hidden"
                                    checked={formData.category === 'Prayer Request'}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                />
                                Prayer Request
                            </label>
                            <label className={`flex-1 cursor-pointer border-2 rounded-xl p-3 text-center transition-all ${formData.category === 'Testimony' ? 'border-green-500 bg-green-50 text-green-700 font-bold' : 'border-gray-100 text-gray-500 hover:border-green-200'}`}>
                                <input
                                    type="radio"
                                    name="category"
                                    value="Testimony"
                                    className="hidden"
                                    checked={formData.category === 'Testimony'}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                />
                                Testimony
                            </label>
                        </div>
                    </div>

                    {/* Author */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                        <input
                            type="text"
                            disabled={formData.isAnonymous}
                            value={formData.author}
                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                            className="w-full p-3 border rounded-xl focus:ring-rose-500 focus:border-rose-500 disabled:bg-gray-50 disabled:text-gray-400"
                            placeholder="e.g. Sister Tolu"
                        />
                        <label className="flex items-center mt-2 text-sm text-gray-500 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isAnonymous}
                                onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                                className="rounded text-rose-500 focus:ring-rose-500 mr-2"
                            />
                            Post Anonymously
                        </label>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            required
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-3 border rounded-xl focus:ring-rose-500 focus:border-rose-500"
                            placeholder="Give your post a title..."
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea
                            required
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full p-3 border rounded-xl focus:ring-rose-500 focus:border-rose-500 h-32"
                            placeholder="Share your prayer request or testimony here..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || (!formData.isAnonymous && !formData.author.trim())}
                        className="w-full py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Posting...' : <><HiPaperAirplane className="mr-2 rotate-90" /> Post to Wall</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WallPostModal;
