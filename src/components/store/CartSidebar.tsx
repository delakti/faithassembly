import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaTrash, FaShoppingBag } from 'react-icons/fa';
import { useStore } from '../../context/StoreContext';
import { Link } from 'react-router-dom';

const CartSidebar: React.FC = () => {
    const { isCartOpen, setIsCartOpen, cart, removeFromCart, updateQuantity, cartTotal } = useStore();

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black z-50"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl z-50 flex flex-col"
                    >
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                <FaShoppingBag className="mr-2 text-purple-600" /> Your Cart
                            </h2>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                                    <FaShoppingBag size={48} opacity={0.2} />
                                    <p className="text-lg">Your cart is empty.</p>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="text-purple-600 font-semibold hover:underline"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {cart.map((item) => (
                                        <div key={`${item.product.id}-${item.selectedVariant}`} className="flex space-x-4">
                                            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                <img
                                                    src={item.product.images[0]}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 line-clamp-1">{item.product.name}</h3>
                                                <div className="text-sm text-gray-500 mb-2">
                                                    {item.selectedVariant && <span className="mr-2">Size: {item.selectedVariant}</span>}
                                                    <span>£{item.product.price.toFixed(2)}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center border border-gray-200 rounded-md">
                                                        <button
                                                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedVariant)}
                                                            className="px-2 py-1 text-gray-600 hover:bg-gray-50"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="px-2 text-sm font-medium">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedVariant)}
                                                            className="px-2 py-1 text-gray-600 hover:bg-gray-50"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromCart(item.product.id, item.selectedVariant)}
                                                        className="text-red-400 hover:text-red-600 text-sm flex items-center"
                                                    >
                                                        <FaTrash className="mr-1" /> Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="p-6 border-t border-gray-100 bg-gray-50">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="text-2xl font-bold text-gray-900">£{cartTotal.toFixed(2)}</span>
                                </div>
                                <p className="text-xs text-gray-500 mb-4 text-center">Shipping and taxes calculated at checkout.</p>
                                <Link
                                    to="/store/checkout"
                                    onClick={() => setIsCartOpen(false)}
                                    className="block w-full py-4 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-700 shadow-lg hover:shadow-xl transition transform active:scale-95 text-center"
                                >
                                    Proceed to Checkout
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartSidebar;
