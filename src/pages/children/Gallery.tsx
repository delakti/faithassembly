import React, { useState, useEffect } from 'react';
import { db, storage } from '../../firebase';
import { collection, query, getDocs, orderBy, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { FaImages, FaPlus, FaTrash, FaCloudUploadAlt } from 'react-icons/fa';
import type { GalleryItem } from '../../types/children';

const PhotoGallery: React.FC = () => {
    const [photos, setPhotos] = useState<(GalleryItem & { id: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [uploadedBy, setUploadedBy] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        fetchPhotos();
    }, []);

    const fetchPhotos = async () => {
        try {
            const q = query(collection(db, 'children_gallery'), orderBy('createdAt', 'desc'));
            const snap = await getDocs(q);
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as GalleryItem & { id: string }));
            setPhotos(data);
        } catch (error) {
            console.error("Error fetching photos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) {
            alert("Please select an image to upload.");
            return;
        }

        setSubmitting(true);

        try {
            // 1. Upload to Firebase Storage
            const storageRef = ref(storage, `children_gallery/${Date.now()}_${selectedFile.name}`);
            await uploadBytes(storageRef, selectedFile);
            const downloadURL = await getDownloadURL(storageRef);

            // 2. Save metadata to Firestore
            const newPhoto: GalleryItem = {
                title,
                description,
                uploadedBy,
                url: downloadURL,
                date: new Date().toISOString().split('T')[0]
            };

            await addDoc(collection(db, 'children_gallery'), {
                ...newPhoto,
                createdAt: serverTimestamp()
            });

            alert("Photo uploaded successfully!");
            setShowForm(false);

            // Reset Form
            setTitle('');
            setDescription('');
            setUploadedBy('');
            setSelectedFile(null);

            fetchPhotos();

        } catch (error) {
            console.error("Error uploading photo:", error);
            alert("Failed to upload photo.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string, imageUrl: string) => {
        if (!window.confirm("Are you sure you want to delete this photo?")) return;
        try {
            // 1. Delete from Firestore
            await deleteDoc(doc(db, 'children_gallery', id));

            // 2. Try to delete from Storage (optional, depending on if you want to keep orphan files)
            // Extracting ref from URL is complex, often safer to just delete the doc record
            // But if we can map it back:
            try {
                // Simple attempt to get ref from URL if it matches standard patterns
                const fileRef = ref(storage, imageUrl);
                await deleteObject(fileRef);
            } catch (storageError) {
                console.warn("Could not delete file from storage, but record deleted.", storageError);
            }

            setPhotos(photos.filter(p => p.id !== id));
        } catch (error) {
            console.error("Error deleting photo:", error);
            alert("Failed to delete photo.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Photo Gallery</h1>
                    <p className="text-gray-500">Capture and share moments from Children's Ministry.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-purple-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-purple-600 transition flex items-center shadow-md"
                >
                    <FaPlus className="mr-2" /> {showForm ? 'Cancel' : 'Upload Photo'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-2xl shadow-md border border-purple-100 animate-fade-in-down">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <FaCloudUploadAlt className="mr-2 text-purple-500" /> Upload New Photo
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Image</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-white transition cursor-pointer relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                {selectedFile ? (
                                    <div className="text-purple-600 font-bold flex flex-col items-center">
                                        <FaImages className="text-3xl mb-2" />
                                        {selectedFile.name}
                                    </div>
                                ) : (
                                    <div className="text-gray-400 flex flex-col items-center">
                                        <FaCloudUploadAlt className="text-3xl mb-2" />
                                        <span>Click or Drag to Upload Image</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Photo Title / Caption</label>
                            <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 border rounded-xl" placeholder="e.g. Christmas Play 2024" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 border rounded-xl h-20" placeholder="Details about the event..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Uploaded By</label>
                            <input required value={uploadedBy} onChange={e => setUploadedBy(e.target.value)} className="w-full p-3 border rounded-xl" placeholder="Your Name" />
                        </div>

                        <div className="md:col-span-2 pt-2">
                            <button type="submit" disabled={submitting} className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition shadow-lg">
                                {submitting ? 'Uploading...' : 'Save to Gallery'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Gallery Grid */}
            {loading ? (
                <div className="text-center py-12 text-gray-400">Loading photos...</div>
            ) : photos.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                    <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-300 text-2xl">
                        <FaImages />
                    </div>
                    <h3 className="text-lg font-bold text-gray-600">No Photos Yet</h3>
                    <p className="text-gray-400">Upload the first memory!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {photos.map((photo) => (
                        <div key={photo.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group relative">
                            <div className="h-48 overflow-hidden bg-gray-100 relative">
                                <img src={photo.url} alt={photo.title} className="w-full h-full object-cover transition duration-300 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition" />
                                <button
                                    onClick={() => photo.id && handleDelete(photo.id, photo.url)}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow-md hover:bg-red-600"
                                    title="Delete Photo"
                                >
                                    <FaTrash size={12} />
                                </button>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-gray-900 truncate">{photo.title}</h3>
                                {photo.description && <p className="text-xs text-gray-500 line-clamp-2 mt-1">{photo.description}</p>}
                                <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
                                    <span>{new Date(photo.date || photo.createdAt?.toDate()).toLocaleDateString()}</span>
                                    <span>{photo.uploadedBy}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PhotoGallery;
