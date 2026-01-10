import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import type { YouthMedia } from '../../types/youth';
import { toast } from 'react-hot-toast';
import { HiPlus, HiPencil, HiTrash, HiDocumentText, HiPlay } from 'react-icons/hi';

const YouthMediaManager: React.FC = () => {
    const [resources, setResources] = useState<YouthMedia[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentResource, setCurrentResource] = useState<Partial<YouthMedia>>({ type: 'video' });
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const q = query(collection(db, 'youth_media'), orderBy('date', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as YouthMedia[];
            setResources(data);
        });

        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && currentResource.id) {
                const docRef = doc(db, 'youth_media', currentResource.id);
                const { id, ...data } = currentResource;
                await updateDoc(docRef, data);
                toast.success('Resource updated!');
            } else {
                await addDoc(collection(db, 'youth_media'), {
                    ...currentResource,
                    createdAt: serverTimestamp()
                });
                toast.success('Resource created!');
            }
            setShowForm(false);
            setIsEditing(false);
            setCurrentResource({ type: 'video' });
        } catch (error) {
            console.error('Error saving resource:', error);
            toast.error('Failed to save resource');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this resource?')) return;
        try {
            await deleteDoc(doc(db, 'youth_media', id));
            toast.success('Resource deleted');
        } catch (error) {
            console.error('Error deleting resource:', error);
            toast.error('Failed to delete resource');
        }
    };

    const openEdit = (resource: YouthMedia) => {
        setCurrentResource(resource);
        setIsEditing(true);
        setShowForm(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-white italic uppercase">Manage Media</h2>
                <button
                    onClick={() => { setShowForm(!showForm); setIsEditing(false); setCurrentResource({ type: 'video' }); }}
                    className="bg-yellow-400 text-black px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-yellow-300 transition-colors"
                >
                    <HiPlus className="w-5 h-5" />
                    {showForm ? 'Cancel' : 'Add Resource'}
                </button>
            </div>

            {showForm && (
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl animate-in fade-in slide-in-from-top-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-400 text-sm font-bold mb-2">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={currentResource.title || ''}
                                    onChange={e => setCurrentResource({ ...currentResource, title: e.target.value })}
                                    className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-yellow-400 focus:outline-none"
                                    placeholder="e.g. Unstoppable Faith"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm font-bold mb-2">Type</label>
                                <select
                                    value={currentResource.type || 'video'}
                                    onChange={e => setCurrentResource({ ...currentResource, type: e.target.value as 'video' | 'document' })}
                                    className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-yellow-400 focus:outline-none"
                                >
                                    <option value="video">Video</option>
                                    <option value="document">Document</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-400 text-sm font-bold mb-2">Author/Speaker</label>
                                <input
                                    type="text"
                                    required
                                    value={currentResource.author || ''}
                                    onChange={e => setCurrentResource({ ...currentResource, author: e.target.value })}
                                    className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-yellow-400 focus:outline-none"
                                    placeholder="e.g. Pastor Tim"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm font-bold mb-2">Date</label>
                                <input
                                    type="text"
                                    required
                                    value={currentResource.date || ''}
                                    onChange={e => setCurrentResource({ ...currentResource, date: e.target.value })}
                                    className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-yellow-400 focus:outline-none"
                                    placeholder="e.g. Oct 20, 2023"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-2">Resource URL (Link to Video/PDF)</label>
                            <input
                                type="url"
                                required
                                value={currentResource.url || ''}
                                onChange={e => setCurrentResource({ ...currentResource, url: e.target.value })}
                                className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-yellow-400 focus:outline-none"
                                placeholder="https://..."
                            />
                        </div>

                        {currentResource.type === 'video' ? (
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-400 text-sm font-bold mb-2">Thumbnail URL</label>
                                    <input
                                        type="url"
                                        required={currentResource.type === 'video'}
                                        value={currentResource.thumbnail || ''}
                                        onChange={e => setCurrentResource({ ...currentResource, thumbnail: e.target.value })}
                                        className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-yellow-400 focus:outline-none"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm font-bold mb-2">Duration</label>
                                    <input
                                        type="text"
                                        value={currentResource.duration || ''}
                                        onChange={e => setCurrentResource({ ...currentResource, duration: e.target.value })}
                                        className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-yellow-400 focus:outline-none"
                                        placeholder="e.g. 35:20"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-gray-400 text-sm font-bold mb-2">Size (Optional)</label>
                                <input
                                    type="text"
                                    value={currentResource.size || ''}
                                    onChange={e => setCurrentResource({ ...currentResource, size: e.target.value })}
                                    className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-yellow-400 focus:outline-none"
                                    placeholder="e.g. 2.4 MB"
                                />
                            </div>
                        )}

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                className="bg-green-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-600 transition-colors"
                            >
                                {isEditing ? 'Update Resource' : 'Create Resource'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid gap-4">
                {resources.map((res) => (
                    <div key={res.id} className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-start md:items-center group hover:border-gray-700 transition-all">
                        <div className="w-16 h-16 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {res.type === 'video' && res.thumbnail ? (
                                <img src={res.thumbnail} alt={res.title} className="w-full h-full object-cover" />
                            ) : res.type === 'video' ? (
                                <HiPlay className="w-8 h-8 text-gray-600" />
                            ) : (
                                <HiDocumentText className="w-8 h-8 text-gray-600" />
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-white line-clamp-1">{res.title}</h3>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-400 mt-1">
                                <span className="bg-gray-800 px-2 py-0.5 rounded text-xs uppercase font-bold">{res.type}</span>
                                <span>{res.author}</span>
                                <span>{res.date}</span>
                            </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button
                                onClick={() => openEdit(res)}
                                className="flex-1 md:flex-none bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <HiPencil className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleDelete(res.id)}
                                className="flex-1 md:flex-none bg-red-900/20 text-red-500 p-2 rounded-lg hover:bg-red-900/40 transition-colors"
                            >
                                <HiTrash className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default YouthMediaManager;
