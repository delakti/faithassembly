import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, getDocs, orderBy, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { HiPlus, HiPencil, HiTrash, HiSave, HiDocumentText, HiPlay } from 'react-icons/hi';
import type { EstherResource } from '../../types/esther';

const EstherResourceManager: React.FC = () => {
    const [resources, setResources] = useState<EstherResource[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentResource, setCurrentResource] = useState<EstherResource>({
        title: '',
        type: 'document',
        author: '',
        size: '',
        duration: '',
        desc: '',
        image: '',
        url: ''
    });

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'esther_resources'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EstherResource));
            setResources(data);
        } catch (error) {
            console.error("Error fetching resources:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this resource?')) {
            try {
                await deleteDoc(doc(db, 'esther_resources', id));
                setResources(prev => prev.filter(r => r.id !== id));
            } catch (error) {
                console.error("Error deleting resource:", error);
            }
        }
    };

    const handleEdit = (resource: EstherResource) => {
        setCurrentResource(resource);
        setIsEditing(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const resourceData = {
                ...currentResource,
                updatedAt: serverTimestamp()
            };

            if (currentResource.id) {
                await updateDoc(doc(db, 'esther_resources', currentResource.id), resourceData);
            } else {
                await addDoc(collection(db, 'esther_resources'), {
                    ...resourceData,
                    createdAt: serverTimestamp()
                });
            }

            setIsEditing(false);
            setCurrentResource({
                title: '',
                type: 'document',
                author: '',
                size: '',
                duration: '',
                desc: '',
                image: '',
                url: ''
            });
            fetchResources();
        } catch (error) {
            console.error("Error saving resource:", error);
            alert("Failed to save resource.");
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-rose-50 flex justify-between items-center bg-rose-50/30">
                <h2 className="text-xl font-bold text-rose-950 flex items-center">
                    Manage Resources
                </h2>
                {!isEditing && (
                    <button
                        onClick={() => {
                            setCurrentResource({
                                title: '',
                                type: 'document',
                                author: '',
                                size: '',
                                duration: '',
                                desc: '',
                                image: '',
                                url: ''
                            });
                            setIsEditing(true);
                        }}
                        className="flex items-center px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors text-sm font-bold shadow-sm"
                    >
                        <HiPlus className="w-4 h-4 mr-2" />
                        New Resource
                    </button>
                )}
            </div>

            <div className="p-6">
                {isEditing ? (
                    <form onSubmit={handleSave} className="space-y-6 max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input required value={currentResource.title} onChange={e => setCurrentResource({ ...currentResource, title: e.target.value })} className="w-full p-3 border rounded-xl focus:ring-rose-500 focus:border-rose-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Author/Speaker</label>
                                <input required value={currentResource.author} onChange={e => setCurrentResource({ ...currentResource, author: e.target.value })} className="w-full p-3 border rounded-xl focus:ring-rose-500 focus:border-rose-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select value={currentResource.type} onChange={e => setCurrentResource({ ...currentResource, type: e.target.value as any })} className="w-full p-3 border rounded-xl focus:ring-rose-500 focus:border-rose-500">
                                    <option value="document">Document (PDF)</option>
                                    <option value="video">Video</option>
                                </select>
                            </div>

                            {currentResource.type === 'document' ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">File Size (e.g. 2.4 MB)</label>
                                    <input value={currentResource.size} onChange={e => setCurrentResource({ ...currentResource, size: e.target.value })} className="w-full p-3 border rounded-xl focus:ring-rose-500 focus:border-rose-500" />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (e.g. 1h 12m)</label>
                                    <input value={currentResource.duration} onChange={e => setCurrentResource({ ...currentResource, duration: e.target.value })} className="w-full p-3 border rounded-xl focus:ring-rose-500 focus:border-rose-500" />
                                </div>
                            )}

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Image URL</label>
                                <input value={currentResource.image} onChange={e => setCurrentResource({ ...currentResource, image: e.target.value })} className="w-full p-3 border rounded-xl focus:ring-rose-500 focus:border-rose-500" placeholder="https://..." />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Resource URL (Download/Video Link)</label>
                                <input required value={currentResource.url} onChange={e => setCurrentResource({ ...currentResource, url: e.target.value })} className="w-full p-3 border rounded-xl focus:ring-rose-500 focus:border-rose-500" placeholder="https://..." />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea required value={currentResource.desc} onChange={e => setCurrentResource({ ...currentResource, desc: e.target.value })} className="w-full p-3 border rounded-xl h-24 focus:ring-rose-500 focus:border-rose-500" />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 rounded-lg text-gray-600 font-bold hover:bg-gray-100">Cancel</button>
                            <button type="submit" className="px-6 py-2 rounded-lg bg-rose-500 text-white font-bold hover:bg-rose-600 shadow-md flex items-center">
                                <HiSave className="mr-2" /> Save Resource
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-gray-500 border-b border-gray-100 text-sm">
                                    <th className="py-3 font-semibold">Title</th>
                                    <th className="py-3 font-semibold">Type</th>
                                    <th className="py-3 font-semibold">Author</th>
                                    <th className="py-3 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr><td colSpan={4} className="py-8 text-center text-gray-400">Loading resources...</td></tr>
                                ) : resources.length === 0 ? (
                                    <tr><td colSpan={4} className="py-12 text-center text-gray-400">No resources found. Add your first one!</td></tr>
                                ) : (
                                    resources.map(resource => (
                                        <tr key={resource.id} className="hover:bg-rose-50/30 transition-colors group">
                                            <td className="py-4 font-medium text-gray-800">{resource.title}</td>
                                            <td className="py-4">
                                                <span className={`flex items-center text-xs font-bold uppercase tracking-wider ${resource.type === 'video' ? 'text-red-500' : 'text-blue-500'}`}>
                                                    {resource.type === 'video' ? <HiPlay className="mr-1" /> : <HiDocumentText className="mr-1" />}
                                                    {resource.type}
                                                </span>
                                            </td>
                                            <td className="py-4 text-gray-600 text-sm">{resource.author}</td>
                                            <td className="py-4 text-right">
                                                <button onClick={() => handleEdit(resource)} className="text-gray-400 hover:text-rose-600 mr-3 transition-colors"><HiPencil className="w-5 h-5" /></button>
                                                <button onClick={() => handleDelete(resource.id!)} className="text-gray-400 hover:text-red-600 transition-colors"><HiTrash className="w-5 h-5" /></button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EstherResourceManager;
