import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, getDocs, orderBy, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { FaBookOpen, FaPlus, FaTrash, FaLink, FaCalendarAlt, FaChalkboardTeacher } from 'react-icons/fa';
import type { Lesson } from '../../types/children';

const LessonManager: React.FC = () => {
    const [lessons, setLessons] = useState<(Lesson & { id: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Lesson>({
        title: '',
        topic: '',
        date: new Date().toISOString().split('T')[0],
        assignedGroup: 'All',
        scriptureReference: '',
        content: '',
        resourceLink: ''
    });

    useEffect(() => {
        fetchLessons();
    }, []);

    const fetchLessons = async () => {
        try {
            const q = query(collection(db, 'children_lessons'), orderBy('date', 'desc'));
            const snap = await getDocs(q);
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Lesson & { id: string }));
            setLessons(data);
        } catch (error) {
            console.error("Error fetching lessons:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await addDoc(collection(db, 'children_lessons'), {
                ...formData,
                createdAt: serverTimestamp()
            });
            alert("Lesson created successfully!");
            setShowForm(false);
            setFormData({
                title: '',
                topic: '',
                date: new Date().toISOString().split('T')[0],
                assignedGroup: 'All',
                scriptureReference: '',
                content: '',
                resourceLink: ''
            });
            fetchLessons();
        } catch (error) {
            console.error("Error creating lesson:", error);
            alert("Failed to create lesson.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this lesson?")) return;
        try {
            await deleteDoc(doc(db, 'children_lessons', id));
            setLessons(lessons.filter(l => l.id !== id));
        } catch (error) {
            console.error("Error deleting lesson:", error);
            alert("Failed to delete lesson.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Lesson Manager</h1>
                    <p className="text-gray-500">Plan and distribute lessons for Sunday School.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-sky-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-sky-600 transition flex items-center shadow-md"
                >
                    <FaPlus className="mr-2" /> {showForm ? 'Cancel' : 'New Lesson'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-2xl shadow-md border border-sky-100 animate-fade-in-down">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <FaChalkboardTeacher className="mr-2 text-sky-500" /> Create Lesson Plan
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Title</label>
                            <input required name="title" value={formData.title} onChange={handleChange} className="w-full p-3 border rounded-xl" placeholder="e.g. David and Goliath" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Topic / Theme</label>
                            <input required name="topic" value={formData.topic} onChange={handleChange} className="w-full p-3 border rounded-xl" placeholder="e.g. Courage" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Scripture Reference</label>
                            <input required name="scriptureReference" value={formData.scriptureReference} onChange={handleChange} className="w-full p-3 border rounded-xl" placeholder="e.g. 1 Samuel 17" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input required type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-3 border rounded-xl" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Target Group</label>
                            <select name="assignedGroup" value={formData.assignedGroup} onChange={handleChange} className="w-full p-3 border rounded-xl bg-gray-50">
                                <option value="All">All Groups</option>
                                <option value="Creche">Creche (0-4)</option>
                                <option value="Primary">Primary (5-11)</option>
                                <option value="Teens">Teens (12-18)</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Content / Lesson Notes</label>
                            <textarea required name="content" value={formData.content} onChange={handleChange} className="w-full p-3 border rounded-xl h-32" placeholder="Key points, activities, or discussion questions..." />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Resource Link (Optional)</label>
                            <div className="relative">
                                <FaLink className="absolute left-3 top-3.5 text-gray-400" />
                                <input type="url" name="resourceLink" value={formData.resourceLink} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border rounded-xl" placeholder="https://..." />
                            </div>
                        </div>
                        <div className="md:col-span-2 pt-2">
                            <button type="submit" disabled={submitting} className="w-full bg-sky-600 text-white py-3 rounded-xl font-bold hover:bg-sky-700 transition">
                                {submitting ? 'Publishing...' : 'Publish Lesson'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Lessons List */}
            {loading ? (
                <div className="text-center py-12 text-gray-400">Loading lessons...</div>
            ) : lessons.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 text-2xl">
                        <FaBookOpen />
                    </div>
                    <h3 className="text-lg font-bold text-gray-600">No Lessons Found</h3>
                    <p className="text-gray-400">Create a new lesson to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lessons.map((lesson) => (
                        <div key={lesson.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition flex flex-col">
                            <div className={`h-2 w-full ${lesson.assignedGroup === 'Creche' ? 'bg-pink-400' :
                                lesson.assignedGroup === 'Primary' ? 'bg-orange-400' :
                                    lesson.assignedGroup === 'Teens' ? 'bg-purple-400' : 'bg-sky-400'
                                }`} />
                            <div className="p-6 flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center">
                                        <FaCalendarAlt className="mr-1" /> {new Date(lesson.date).toLocaleDateString()}
                                    </span>
                                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-600">
                                        {lesson.assignedGroup}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{lesson.title}</h3>
                                <p className="text-sm text-sky-600 font-medium mb-3">{lesson.scriptureReference} • {lesson.topic}</p>
                                <p className="text-gray-600 text-am line-clamp-3 mb-4">{lesson.content}</p>

                                {lesson.resourceLink && (
                                    <a href={lesson.resourceLink} target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:text-sky-700 text-sm font-bold flex items-center mb-4">
                                        <FaLink className="mr-1" /> View Resource
                                    </a>
                                )}
                            </div>
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                                <button
                                    onClick={() => lesson.id && handleDelete(lesson.id)}
                                    className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition"
                                    title="Delete Lesson"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LessonManager;
