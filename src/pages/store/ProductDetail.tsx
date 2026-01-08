import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaShoppingCart, FaMinus, FaPlus } from 'react-icons/fa';
import { useStore } from '../../context/StoreContext';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { Product } from '../../types/store';

// Same dummy data for fallback
const DUMMY_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Faith Assembly T-Shirt',
        description: 'Premium cotton t-shirt with church logo. Comfortable fit, perfect for casual wear or serving on Sundays.',
        price: 15.00,
        category: 'Apparel',
        images: ['https://placehold.co/600x600/purple/white?text=Faith+Tee'],
        stock: 50,
        variants: ['S', 'M', 'L', 'XL']
    },
    {
        id: '2',
        name: 'Worship Anthology CD',
        description: 'Latest worship songs from our choir. Features 12 original tracks recorded live at Faith Assembly.',
        price: 10.00,
        category: 'Media',
        images: ['https://placehold.co/600x600/blue/white?text=Worship+CD'],
        stock: 100
    },
    {
        id: '3',
        name: 'Living with Purpose',
        description: 'A transformative book by Pastor Solomon. Discover your God-given potential and walk in your calling.',
        price: 12.99,
        category: 'Books',
        images: ['https://placehold.co/600x600/orange/white?text=Book+Cover'],
        stock: 25
    }
];

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { addToCart } = useStore();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedVariant, setSelectedVariant] = useState<string>('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;

            // Check dummy first
            const dummy = DUMMY_PRODUCTS.find(p => p.id === id);
            if (dummy) {
                setProduct(dummy);
                if (dummy.variants && dummy.variants.length > 0) {
                    setSelectedVariant(dummy.variants[0]);
                }
                setLoading(false);
                return;
            }

            try {
                const docRef = doc(db, "products", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const fetchedProduct = { id: docSnap.id, ...docSnap.data() } as Product;
                    setProduct(fetchedProduct);
                    if (fetchedProduct.variants && fetchedProduct.variants.length > 0) {
                        setSelectedVariant(fetchedProduct.variants[0]);
                    }
                } else {
                    console.log("No such product!");
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        addToCart(product, quantity, selectedVariant || undefined);
        // Could show a toast here? context handles opening cart sidebar
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
                <p className="text-xl mb-4">Product not found.</p>
                <Link to="/store" className="text-purple-600 hover:underline">Return to Store</Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <Link to="/store" className="inline-flex items-center text-gray-500 hover:text-purple-600 mb-8 transition">
                    <FaArrowLeft className="mr-2" /> Back to Store
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Image Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gray-50 rounded-2xl overflow-hidden"
                    >
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover max-h-[600px]"
                        />
                    </motion.div>

                    {/* Details Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="text-sm font-bold text-purple-600 uppercase tracking-wider mb-2">
                            {product.category}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {product.name}
                        </h1>
                        <p className="text-2xl font-bold text-gray-900 mb-6">
                            £{product.price.toFixed(2)}
                        </p>

                        <div className="prose text-gray-600 mb-8">
                            <p>{product.description}</p>
                        </div>

                        {/* Variants */}
                        {product.variants && product.variants.length > 0 && (
                            <div className="mb-6">
                                <label className="block text-gray-700 font-semibold mb-2">Select Option:</label>
                                <div className="flex flex-wrap gap-2">
                                    {product.variants.map(variant => (
                                        <button
                                            key={variant}
                                            onClick={() => setSelectedVariant(variant)}
                                            className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${selectedVariant === variant
                                                ? 'border-purple-600 bg-purple-50 text-purple-600'
                                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                }`}
                                        >
                                            {variant}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="mb-8">
                            <label className="block text-gray-700 font-semibold mb-2">Quantity:</label>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
                                >
                                    <FaMinus size={12} />
                                </button>
                                <span className="font-bold text-lg w-8 text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
                                >
                                    <FaPlus size={12} />
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <div className="flex space-x-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className={`flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 transition ${product.stock === 0
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl transform active:scale-95'
                                    }`}
                            >
                                <FaShoppingCart />
                                <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                            </button>
                        </div>

                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
