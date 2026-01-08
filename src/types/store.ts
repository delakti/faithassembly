export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    stock: number;
    variants?: string[]; // e.g., ["S", "M", "L", "XL"] or ["Red", "Blue"]
}

export interface CartItem {
    product: Product;
    quantity: number;
    selectedVariant?: string;
}
