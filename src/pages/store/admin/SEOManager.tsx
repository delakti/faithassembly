import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import type { SEOMetadata } from '../../../types/seo';

const SEOManager: React.FC = () => {
    const [pages, setPages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<SEOMetadata>>({ isVisible: true });
    const [currentId, setCurrentId] = useState<string | null>(null);

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const q = query(collection(db, 'seo_metadata'), orderBy('path'));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPages(data);
        } catch (error) {
            console.error("Error fetching SEO pages:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const data = {
                ...formData,
                updatedAt: serverTimestamp()
            };

            if (currentId) {
                await updateDoc(doc(db, 'seo_metadata', currentId), data);
            } else {
                await addDoc(collection(db, 'seo_metadata'), data);
            }

            setIsEditing(false);
            setFormData({ isVisible: true });
            setCurrentId(null);
            fetchPages();
        } catch (error) {
            console.error("Error saving SEO data:", error);
            alert("Failed to save.");
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure?")) {
            await deleteDoc(doc(db, 'seo_metadata', id));
            fetchPages();
        }
    };

    const handleEdit = (page: any) => {
        setFormData(page);
        setCurrentId(page.id);
        setIsEditing(true);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">SEO Manager</h1>
                <button
                    onClick={() => { setFormData({ isVisible: true }); setCurrentId(null); setIsEditing(true); }}
                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                    <FaPlus className="mr-2" /> Add Page SEO
                </button>
            </div>

            {!isEditing ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Path</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {pages.map((page) => (
                                <tr key={page.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{page.path}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">{page.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {page.isVisible ? (
                                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Indexed</span>
                                        ) : (
                                            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">NoIndex</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleEdit(page)} className="text-indigo-600 hover:text-indigo-900 mr-4"><FaEdit /></button>
                                        <button onClick={() => handleDelete(page.id)} className="text-red-600 hover:text-red-900"><FaTrash /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-3xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">{currentId ? 'Edit SEO Entry' : 'New SEO Entry'}</h2>
                        <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
                    </div>

                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Page Path</label>
                            <input
                                type="text"
                                value={formData.path || ''}
                                onChange={e => setFormData({ ...formData, path: e.target.value })}
                                placeholder="/about"
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Meta Title</label>
                            <input
                                type="text"
                                value={formData.title || ''}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Meta Description</label>
                            <textarea
                                value={formData.description || ''}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                rows={3}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Keywords</label>
                            <input
                                type="text"
                                value={formData.keywords || ''}
                                onChange={e => setFormData({ ...formData, keywords: e.target.value })}
                                placeholder="faith, church, worship..."
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">OG Image URL</label>
                            <input
                                type="text"
                                value={formData.ogImage || ''}
                                onChange={e => setFormData({ ...formData, ogImage: e.target.value })}
                                placeholder="https://..."
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Schema Markup (JSON-LD)</label>
                            <textarea
                                value={formData.schemaMarkup || ''}
                                onChange={e => setFormData({ ...formData, schemaMarkup: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2 font-mono text-sm"
                                rows={4}
                                placeholder='{"@context": "https://schema.org", "@type": "Organization", ...}'
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.isVisible}
                                onChange={e => setFormData({ ...formData, isVisible: e.target.checked })}
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-900">
                                Visible to Search Engines (Index/Follow)
                            </label>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                                Save SEO Settings
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default SEOManager;
