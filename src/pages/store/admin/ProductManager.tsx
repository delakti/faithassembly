import React, { useState, useEffect } from 'react';
import { db, storage } from '../../../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaEdit, FaTrash, FaPlus, FaImage, FaTimes } from 'react-icons/fa';
import type { Product } from '../../../types/store';

const ProductManager: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({ variants: [] });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [variantInput, setVariantInput] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'products'));
            const productsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Product[];
            setProducts(productsData);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            let imageUrl = currentProduct.images?.[0] || '';

            if (imageFile) {
                const storageRef = ref(storage, `product-images/${Date.now()}_${imageFile.name}`);
                await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(storageRef);
            }

            const productData = {
                name: currentProduct.name,
                description: currentProduct.description,
                price: Number(currentProduct.price),
                category: currentProduct.category,
                images: [imageUrl], // Simple single image support for now
                variants: currentProduct.variants || [],
                updatedAt: serverTimestamp(),
            };

            if (currentProduct.id) {
                // Update
                const productRef = doc(db, 'products', currentProduct.id);
                await updateDoc(productRef, productData);
            } else {
                // Create
                await addDoc(collection(db, 'products'), {
                    ...productData,
                    createdAt: serverTimestamp(),
                });
            }

            setIsEditing(false);
            setCurrentProduct({ variants: [] });
            setImageFile(null);
            fetchProducts();
        } catch (error) {
            console.error("Error saving product:", error);
            alert("Failed to save product. See console for details.");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteDoc(doc(db, 'products', id));
                fetchProducts();
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    };

    const handleAddVariant = () => {
        if (variantInput.trim()) {
            const newVariants = [...(currentProduct.variants || []), variantInput.trim()];
            setCurrentProduct({ ...currentProduct, variants: newVariants });
            setVariantInput('');
        }
    };

    const removeVariant = (index: number) => {
        const newVariants = [...(currentProduct.variants || [])];
        newVariants.splice(index, 1);
        setCurrentProduct({ ...currentProduct, variants: newVariants });
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                <button
                    onClick={() => {
                        setCurrentProduct({ variants: [] });
                        setIsEditing(true);
                    }}
                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                    <FaPlus className="mr-2" /> Add Product
                </button>
            </div>

            {/* List View */}
            {!isEditing ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No products found.</td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    {product.images?.[0] ? (
                                                        <img className="h-10 w-10 rounded-full object-cover" src={product.images[0]} alt="" />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                                                            <FaImage />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">£{product.price.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => {
                                                    setCurrentProduct(product);
                                                    setIsEditing(true);
                                                }}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
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
                /* Edit Form */
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">{currentProduct.id ? 'Edit Product' : 'New Product'}</h2>
                        <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">
                            <FaTimes />
                        </button>
                    </div>

                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                value={currentProduct.name || ''}
                                onChange={e => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 border p-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                value={currentProduct.description || ''}
                                onChange={e => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 border p-2"
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Price (£)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={currentProduct.price || ''}
                                    onChange={e => setCurrentProduct({ ...currentProduct, price: parseFloat(e.target.value) })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 border p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    value={currentProduct.category || ''}
                                    onChange={e => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 border p-2"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option value="Books">Books</option>
                                    <option value="Apparel">Apparel</option>
                                    <option value="Media">Media</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Product Image</label>
                            <div className="mt-1 flex items-center space-x-4">
                                {currentProduct.images?.[0] && (
                                    <img src={currentProduct.images[0]} alt="Preview" className="h-20 w-20 object-cover rounded-lg" />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                />
                            </div>
                        </div>

                        {/* Variants */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Variants (Size, etc.)</label>
                            <div className="flex space-x-2 mt-1 mb-2">
                                <input
                                    type="text"
                                    value={variantInput}
                                    onChange={e => setVariantInput(e.target.value)}
                                    placeholder="e.g. Small"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 border p-2"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddVariant}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {currentProduct.variants?.map((v, idx) => (
                                    <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                        {v}
                                        <button type="button" onClick={() => removeVariant(idx)} className="ml-2 text-purple-600 hover:text-purple-900">×</button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 mt-6">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={uploading}
                                className={`px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {uploading ? 'Saving...' : 'Save Product'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ProductManager;
