import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, getDocs, orderBy, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { HiPlus, HiPencil, HiTrash, HiX, HiSave } from 'react-icons/hi';
import type { Devotional } from '../../types/esther';

const EstherDevotionalManager: React.FC = () => {
    const [devotionals, setDevotionals] = useState<Devotional[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentDevotional, setCurrentDevotional] = useState<Devotional>({
        title: '',
        author: '',
        date: new Date().toISOString().split('T')[0],
        preview: '',
        content: '',
        image: '',
        tags: [],
        status: 'Draft'
    });
    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        fetchDevotionals();
    }, []);

    const fetchDevotionals = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'esther_devotionals'), orderBy('date', 'desc'));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Devotional));
            setDevotionals(data);
        } catch (error) {
            console.error("Error fetching devotionals:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this devotional?')) {
            try {
                await deleteDoc(doc(db, 'esther_devotionals', id));
                setDevotionals(prev => prev.filter(d => d.id !== id));
            } catch (error) {
                console.error("Error deleting devotional:", error);
            }
        }
    };

    const handleEdit = (devotional: Devotional) => {
        setCurrentDevotional(devotional);
        setIsEditing(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const devotionalData = {
                ...currentDevotional,
                tags: currentDevotional.tags || [],
                updatedAt: serverTimestamp()
            };

            if (currentDevotional.id) {
                await updateDoc(doc(db, 'esther_devotionals', currentDevotional.id), devotionalData);
            } else {
                await addDoc(collection(db, 'esther_devotionals'), {
                    ...devotionalData,
                    createdAt: serverTimestamp()
                });
            }

            setIsEditing(false);
            setCurrentDevotional({
                title: '',
                author: '',
                date: new Date().toISOString().split('T')[0],
                preview: '',
                content: '',
                image: '',
                tags: [],
                status: 'Draft'
            });
            fetchDevotionals();
        } catch (error) {
            console.error("Error saving devotional:", error);
            alert("Failed to save devotional.");
        }
    };

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!currentDevotional.tags?.includes(tagInput.trim())) {
                setCurrentDevotional({
                    ...currentDevotional,
                    tags: [...(currentDevotional.tags || []), tagInput.trim()]
                });
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setCurrentDevotional({
            ...currentDevotional,
            tags: currentDevotional.tags?.filter(tag => tag !== tagToRemove) || []
        });
    };

    return (
        <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-rose-50 flex justify-between items-center bg-rose-50/30">
                <h2 className="text-xl font-bold text-rose-950 flex items-center">
                    Manage Devotionals
                </h2>
                {!isEditing && (
                    <button
                        onClick={() => {
                            setCurrentDevotional({
                                title: '',
                                author: '',
                                date: new Date().toISOString().split('T')[0],
                                preview: '',
                                content: '',
                                image: '',
                                tags: [],
                                status: 'Draft'
                            });
                            setIsEditing(true);
                        }}
                        className="flex items-center px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors text-sm font-bold shadow-sm"
                    >
                        <HiPlus className="w-4 h-4 mr-2" />
                        New Devotional
                    </button>
                )}
            </div>

            <div className="p-6">
                {isEditing ? (
                    <form onSubmit={handleSave} className="space-y-6 max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input required value={currentDevotional.title} onChange={e => setCurrentDevotional({ ...currentDevotional, title: e.target.value })} className="w-full p-3 border rounded-xl focus:ring-rose-500 focus:border-rose-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                                <input required value={currentDevotional.author} onChange={e => setCurrentDevotional({ ...currentDevotional, author: e.target.value })} className="w-full p-3 border rounded-xl focus:ring-rose-500 focus:border-rose-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
                                <input type="date" required value={currentDevotional.date} onChange={e => setCurrentDevotional({ ...currentDevotional, date: e.target.value })} className="w-full p-3 border rounded-xl focus:ring-rose-500 focus:border-rose-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select value={currentDevotional.status} onChange={e => setCurrentDevotional({ ...currentDevotional, status: e.target.value as any })} className="w-full p-3 border rounded-xl focus:ring-rose-500 focus:border-rose-500">
                                    <option value="Draft">Draft</option>
                                    <option value="Published">Published</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input value={currentDevotional.image} onChange={e => setCurrentDevotional({ ...currentDevotional, image: e.target.value })} className="w-full p-3 border rounded-xl focus:ring-rose-500 focus:border-rose-500" placeholder="https://..." />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Preview/Summary</label>
                                <textarea required value={currentDevotional.preview} onChange={e => setCurrentDevotional({ ...currentDevotional, preview: e.target.value })} className="w-full p-3 border rounded-xl h-20 focus:ring-rose-500 focus:border-rose-500" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Content</label>
                                <textarea required value={currentDevotional.content} onChange={e => setCurrentDevotional({ ...currentDevotional, content: e.target.value })} className="w-full p-3 border rounded-xl h-40 focus:ring-rose-500 focus:border-rose-500 font-mono text-sm" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (Press Enter to add)</label>
                                <div className="flex flex-wrap gap-2 p-3 border rounded-xl bg-white focus-within:ring-1 focus-within:ring-rose-500">
                                    {currentDevotional.tags?.map(tag => (
                                        <span key={tag} className="bg-rose-100 text-rose-700 px-2 py-1 rounded-lg text-sm flex items-center">
                                            {tag}
                                            <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-rose-900"><HiX /></button>
                                        </span>
                                    ))}
                                    <input
                                        value={tagInput}
                                        onChange={e => setTagInput(e.target.value)}
                                        onKeyDown={handleAddTag}
                                        className="flex-1 outline-none min-w-[100px]"
                                        placeholder="Add tag..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 rounded-lg text-gray-600 font-bold hover:bg-gray-100">Cancel</button>
                            <button type="submit" className="px-6 py-2 rounded-lg bg-rose-500 text-white font-bold hover:bg-rose-600 shadow-md flex items-center">
                                <HiSave className="mr-2" /> Save Devotional
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-gray-500 border-b border-gray-100 text-sm">
                                    <th className="py-3 font-semibold">Title</th>
                                    <th className="py-3 font-semibold">Author</th>
                                    <th className="py-3 font-semibold">Date</th>
                                    <th className="py-3 font-semibold">Status</th>
                                    <th className="py-3 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr><td colSpan={5} className="py-8 text-center text-gray-400">Loading devotionals...</td></tr>
                                ) : devotionals.length === 0 ? (
                                    <tr><td colSpan={5} className="py-12 text-center text-gray-400">No devotionals found. Create your first one!</td></tr>
                                ) : (
                                    devotionals.map(devotional => (
                                        <tr key={devotional.id} className="hover:bg-rose-50/30 transition-colors group">
                                            <td className="py-4 font-medium text-gray-800">{devotional.title}</td>
                                            <td className="py-4 text-gray-600">{devotional.author}</td>
                                            <td className="py-4 text-gray-500 text-sm">{devotional.date}</td>
                                            <td className="py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${devotional.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {devotional.status}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right">
                                                <button onClick={() => handleEdit(devotional)} className="text-gray-400 hover:text-rose-600 mr-3 transition-colors"><HiPencil className="w-5 h-5" /></button>
                                                <button onClick={() => handleDelete(devotional.id!)} className="text-gray-400 hover:text-red-600 transition-colors"><HiTrash className="w-5 h-5" /></button>
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

export default EstherDevotionalManager;
