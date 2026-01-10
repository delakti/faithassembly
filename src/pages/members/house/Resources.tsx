import React, { useState, useEffect, useRef } from 'react';
import { useHouseFellowship } from '../../../layouts/HouseLayout';
import { db, storage } from '../../../firebase';
import { collection, addDoc, query, orderBy, getDocs, deleteDoc, doc, Timestamp } from 'firebase/firestore'; // Removed onSnapshot for resources to keep it simple, or maybe real-time is better? Real-time is nice.
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { FaFileAlt, FaCloudUploadAlt, FaDownload, FaTrash, FaFilePdf, FaFileImage, FaFileWord, FaSpinner } from 'react-icons/fa';

interface Resource {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
    uploadedBy: string;
    timestamp: any;
    path: string; // Storage path
}

const HouseResources: React.FC = () => {
    const { fellowship } = useHouseFellowship();
    const [resources, setResources] = useState<Resource[]>([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchResources();
    }, [fellowship]);

    const fetchResources = async () => {
        if (!fellowship?.name) return;
        setLoading(true);
        try {
            const q = query(collection(db, 'fellowships', fellowship.name, 'resources'), orderBy('timestamp', 'desc'));
            const snapshot = await getDocs(q);
            const list = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Resource));
            setResources(list);
        } catch (error) {
            console.error("Error fetching resources:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !fellowship?.name) return;

        // 10MB Limit
        if (file.size > 10 * 1024 * 1024) {
            alert("File size exceeds 10MB limit.");
            return;
        }

        setUploading(true);
        try {
            // Storage Path: fellowships/{fellowshipName}/{timestamp}_{filename}
            const storagePath = `fellowships/${fellowship.name}/${Date.now()}_${file.name}`;
            const storageRef = ref(storage, storagePath);

            // Upload
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            // Save Metadata to Firestore
            await addDoc(collection(db, 'fellowships', fellowship.name, 'resources'), {
                name: file.name,
                url: downloadURL,
                type: file.type,
                size: file.size,
                uploadedBy: fellowship.leaders, // or user.displayName
                timestamp: Timestamp.now(),
                path: storagePath
            });

            fetchResources();
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Failed to upload file.");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (res: Resource) => {
        if (!fellowship?.name || !window.confirm(`Delete ${res.name}?`)) return;

        try {
            // Delete from Firestore
            await deleteDoc(doc(db, 'fellowships', fellowship.name, 'resources', res.id));

            // Delete from Storage
            if (res.path) {
                const storageRef = ref(storage, res.path);
                await deleteObject(storageRef).catch(err => console.warn("Storage delete failed", err));
            }

            setResources(prev => prev.filter(r => r.id !== res.id));
        } catch (error) {
            console.error("Error deleting resource:", error);
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getIcon = (type: string) => {
        if (type.includes('pdf')) return <FaFilePdf className="text-red-500" />;
        if (type.includes('word') || type.includes('document')) return <FaFileWord className="text-blue-500" />;
        if (type.includes('image')) return <FaFileImage className="text-purple-500" />;
        return <FaFileAlt className="text-gray-500" />;
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <FaFileAlt className="mr-3 text-orange-600" />
                    Resources & Materials
                </h2>
                {fellowship?.isLeader && (
                    <div className="relative">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            className="hidden"
                            id="resource-upload"
                        />
                        <label
                            htmlFor="resource-upload"
                            className={`flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-bold hover:bg-orange-700 transition shadow-sm cursor-pointer ${uploading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {uploading ? (
                                <><FaSpinner className="animate-spin mr-2" /> Uploading...</>
                            ) : (
                                <><FaCloudUploadAlt className="mr-2" /> Upload File</>
                            )}
                        </label>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="text-center p-12 text-gray-500">Loading resources...</div>
            ) : resources.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaCloudUploadAlt className="text-3xl" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">No Resources Found</h3>
                    <p className="text-gray-500 mt-2">
                        {fellowship?.isLeader ? "Upload study guides, outlines, and other materials here." : "No materials have been uploaded yet."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {resources.map(res => (
                        <div key={res.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition flex flex-col justify-between">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-3 overflow-hidden">
                                    <div className="text-2xl flex-shrink-0">
                                        {getIcon(res.type)}
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-gray-900 truncate" title={res.name}>{res.name}</h4>
                                        <p className="text-xs text-gray-500 flex items-center">
                                            {formatSize(res.size)} • {res.timestamp?.toDate ? res.timestamp.toDate().toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                                <a
                                    href={res.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                                >
                                    <FaDownload className="mr-1" /> Download
                                </a>

                                {fellowship?.isLeader && (
                                    <button
                                        onClick={() => handleDelete(res)}
                                        className="text-gray-400 hover:text-red-500 transition"
                                        title="Delete File"
                                    >
                                        <FaTrash />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HouseResources;
