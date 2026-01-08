import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Product, CartItem } from '../types/store';

interface StoreContextType {
    cart: CartItem[];
    addToCart: (product: Product, quantity?: number, variant?: string) => void;
    removeFromCart: (productId: string, variant?: string) => void;
    updateQuantity: (productId: string, quantity: number, variant?: string) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;

}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>(() => {
        // Load from local storage if available
        const savedCart = localStorage.getItem('faith_store_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        // Save to local storage whenever cart changes
        localStorage.setItem('faith_store_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: Product, quantity = 1, variant?: string) => {
        setCart(prevCart => {
            const existingItemIndex = prevCart.findIndex(item =>
                item.product.id === product.id && item.selectedVariant === variant
            );

            if (existingItemIndex > -1) {
                const newCart = [...prevCart];
                newCart[existingItemIndex].quantity += quantity;
                return newCart;
            } else {
                return [...prevCart, { product, quantity, selectedVariant: variant }];
            }
        });
        setIsCartOpen(true); // Open cart when item is added
    };

    const removeFromCart = (productId: string, variant?: string) => {
        setCart(prevCart => prevCart.filter(item =>
            !(item.product.id === productId && item.selectedVariant === variant)
        ));
    };

    const updateQuantity = (productId: string, quantity: number, variant?: string) => {
        if (quantity < 1) return;
        setCart(prevCart => prevCart.map(item => {
            if (item.product.id === productId && item.selectedVariant === variant) {
                return { ...item, quantity };
            }
            return item;
        }));
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <StoreContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            cartCount,
            isCartOpen,
            setIsCartOpen
        }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
};
