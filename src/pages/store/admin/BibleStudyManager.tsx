import React, { useState, useEffect } from 'react';
import { db, storage } from '../../../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaEdit, FaTrash, FaPlus, FaFilePdf, FaVideo, FaTimes } from 'react-icons/fa';
import type { StudyGuide } from '../../../types/bibleStudy';

const BibleStudyManager: React.FC = () => {
    const [guides, setGuides] = useState<StudyGuide[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentGuide, setCurrentGuide] = useState<Partial<StudyGuide>>({ tags: [] });
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        fetchGuides();
    }, []);

    const fetchGuides = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'studyGuides'));
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as StudyGuide[];
            setGuides(data);
        } catch (error) {
            console.error("Error fetching guides:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            let fileUrl = currentGuide.url || '';

            if (file) {
                const storageRef = ref(storage, `study-guides/${Date.now()}_${file.name}`);
                await uploadBytes(storageRef, file);
                fileUrl = await getDownloadURL(storageRef);
            }

            const guideData = {
                title: currentGuide.title,
                description: currentGuide.description,
                category: currentGuide.category,
                level: currentGuide.level,
                type: currentGuide.type || 'pdf',
                url: fileUrl,
                visibility: currentGuide.visibility || 'public',
                tags: currentGuide.tags || [],
                author: currentGuide.author || 'Church Team',
                downloadCount: currentGuide.downloadCount || 0,
                updatedAt: serverTimestamp(),
            };

            if (currentGuide.id) {
                // Update
                const docRef = doc(db, 'studyGuides', currentGuide.id);
                await updateDoc(docRef, guideData);
            } else {
                // Create
                await addDoc(collection(db, 'studyGuides'), {
                    ...guideData,
                    createdAt: serverTimestamp(),
                });
            }

            setIsEditing(false);
            setCurrentGuide({ tags: [] });
            setFile(null);
            fetchGuides();
        } catch (error) {
            console.error("Error saving guide:", error);
            alert("Failed to save guide.");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure? This cannot be undone.")) {
            try {
                await deleteDoc(doc(db, 'studyGuides', id));
                fetchGuides();
            } catch (error) {
                console.error("Error deleting guide:", error);
            }
        }
    };

    const handleAddTag = () => {
        if (tagInput.trim()) {
            const newTags = [...(currentGuide.tags || []), tagInput.trim()];
            setCurrentGuide({ ...currentGuide, tags: newTags });
            setTagInput('');
        }
    };

    const removeTag = (index: number) => {
        const newTags = [...(currentGuide.tags || [])];
        newTags.splice(index, 1);
        setCurrentGuide({ ...currentGuide, tags: newTags });
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Bible Study Guides</h1>
                <button
                    onClick={() => {
                        setCurrentGuide({ tags: [], type: 'pdf', visibility: 'public', level: 'Beginner' });
                        setIsEditing(true);
                    }}
                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                    <FaPlus className="mr-2" /> Add Guide
                </button>
            </div>

            {!isEditing ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {guides.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No guides found.</td>
                                </tr>
                            ) : (
                                guides.map((guide) => (
                                    <tr key={guide.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{guide.title}</div>
                                            <div className="text-sm text-gray-500">{guide.level}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{guide.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                            <span className="flex items-center">
                                                {guide.type === 'pdf' ? <FaFilePdf className="mr-1 text-red-500" /> : <FaVideo className="mr-1 text-blue-500" />}
                                                {guide.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => { setCurrentGuide(guide); setIsEditing(true); }} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                                <FaEdit />
                                            </button>
                                            <button onClick={() => handleDelete(guide.id)} className="text-red-600 hover:text-red-900">
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">{currentGuide.id ? 'Edit Guide' : 'New Study Guide'}</h2>
                        <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
                    </div>

                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                value={currentGuide.title || ''}
                                onChange={e => setCurrentGuide({ ...currentGuide, title: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 border p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                value={currentGuide.description || ''}
                                onChange={e => setCurrentGuide({ ...currentGuide, description: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 border p-2"
                                rows={3}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    value={currentGuide.category || ''}
                                    onChange={e => setCurrentGuide({ ...currentGuide, category: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 border p-2"
                                    required
                                >
                                    <option value="">Select...</option>
                                    <option value="Faith">Faith</option>
                                    <option value="Discipleship">Discipleship</option>
                                    <option value="Prayer">Prayer</option>
                                    <option value="Family">Family</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Level</label>
                                <select
                                    value={currentGuide.level || 'Beginner'}
                                    onChange={e => setCurrentGuide({ ...currentGuide, level: e.target.value as any })}
                                    className="mt-1 block w-full rounded-md border-gray-300 border p-2"
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Type</label>
                                <select
                                    value={currentGuide.type || 'pdf'}
                                    onChange={e => setCurrentGuide({ ...currentGuide, type: e.target.value as any })}
                                    className="mt-1 block w-full rounded-md border-gray-300 border p-2"
                                >
                                    <option value="pdf">PDF Document</option>
                                    <option value="video">Video URL</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Visibility</label>
                                <select
                                    value={currentGuide.visibility || 'public'}
                                    onChange={e => setCurrentGuide({ ...currentGuide, visibility: e.target.value as any })}
                                    className="mt-1 block w-full rounded-md border-gray-300 border p-2"
                                >
                                    <option value="public">Public</option>
                                    <option value="member">Members Only</option>
                                    <option value="admin">Admin Only</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                {currentGuide.type === 'video' ? 'Video URL' : 'Upload PDF'}
                            </label>
                            {currentGuide.type === 'video' ? (
                                <input
                                    type="url"
                                    value={currentGuide.url || ''}
                                    onChange={e => setCurrentGuide({ ...currentGuide, url: e.target.value })}
                                    placeholder="https://youtube.com/..."
                                    className="mt-1 block w-full rounded-md border p-2"
                                />
                            ) : (
                                <div className="mt-1">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                    />
                                    {currentGuide.url && !file && <p className="text-xs text-green-600 mt-1">Current file available</p>}
                                </div>
                            )}
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tags</label>
                            <div className="flex space-x-2 mt-1 mb-2">
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={e => setTagInput(e.target.value)}
                                    placeholder="Add tag..."
                                    className="block w-full rounded-md border p-2"
                                />
                                <button type="button" onClick={handleAddTag} className="px-4 py-2 bg-gray-100 rounded-lg">Add</button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {currentGuide.tags?.map((tag, idx) => (
                                    <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100">
                                        {tag} <button type="button" onClick={() => removeTag(idx)} className="ml-2 text-red-500">×</button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                            <button type="submit" disabled={uploading} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50">
                                {uploading ? 'Saving...' : 'Save Guide'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default BibleStudyManager;
