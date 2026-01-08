import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaSearch } from 'react-icons/fa';
import { useStore } from '../../context/StoreContext';
import { db } from '../../firebase';
import { collection as fsCollection, getDocs as fsGetDocs } from 'firebase/firestore';
import type { Product } from '../../types/store';

// Dummy data for initial display if DB is empty
const DUMMY_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Faith Assembly T-Shirt',
        description: 'Premium cotton t-shirt with church logo.',
        price: 15.00,
        category: 'Apparel',
        images: ['https://placehold.co/600x600/purple/white?text=Faith+Tee'],
        stock: 50,
        variants: ['S', 'M', 'L', 'XL']
    },
    {
        id: '2',
        name: 'Worship Anthology CD',
        description: 'Latest worship songs from our choir.',
        price: 10.00,
        category: 'Media',
        images: ['https://placehold.co/600x600/blue/white?text=Worship+CD'],
        stock: 100
    },
    {
        id: '3',
        name: 'Living with Purpose',
        description: 'A transformative book by Pastor Solomon.',
        price: 12.99,
        category: 'Books',
        images: ['https://placehold.co/600x600/orange/white?text=Book+Cover'],
        stock: 25
    }
];

const StoreHome: React.FC = () => {
    const { addToCart } = useStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Try fetching from Firestore
                const querySnapshot = await fsGetDocs(fsCollection(db, "products"));
                if (!querySnapshot.empty) {
                    const fetchedProducts = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    })) as Product[];
                    setProducts(fetchedProducts);
                } else {
                    // Fallback to dummy data if DB is empty for demo purposes
                    setProducts(DUMMY_PRODUCTS);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts(DUMMY_PRODUCTS); // Fallback on error
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="bg-gray-50 min-h-screen pt-20 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Hero Section */}
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                    >
                        Faith Resources Store
                    </motion.h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Equip yourself with resources to grow in your faith. All proceeds go towards our community outreach programs.
                    </p>
                </div>

                {/* Filters and Search */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">

                    {/* Categories */}
                    <div className="flex overflow-x-auto pb-2 space-x-2 w-full md:w-auto no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition ${selectedCategory === cat
                                    ? 'bg-purple-600 text-white shadow-md'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-64">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <FaSearch />
                        </span>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.map(product => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100 flex flex-col"
                            >
                                <Link to={`/store/product/${product.id}`} className="relative h-64 overflow-hidden bg-gray-100 group">
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                    />
                                    {product.stock === 0 && (
                                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                            SOLD OUT
                                        </div>
                                    )}
                                </Link>

                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="mb-2 text-xs font-bold text-purple-600 uppercase tracking-wider">
                                        {product.category}
                                    </div>
                                    <Link to={`/store/product/${product.id}`}>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-purple-600 transition">
                                            {product.name}
                                        </h3>
                                    </Link>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
                                        {product.description}
                                    </p>

                                    <div className="flex justify-between items-center mt-auto">
                                        <span className="text-xl font-bold text-gray-900">
                                            £{product.price.toFixed(2)}
                                        </span>
                                        <button
                                            onClick={() => addToCart(product)}
                                            disabled={product.stock === 0}
                                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition ${product.stock === 0
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-purple-600 text-white hover:bg-purple-700'
                                                }`}
                                        >
                                            <FaShoppingCart />
                                            <span>Add</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {!loading && filteredProducts.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        No products found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
};

export default StoreHome;
