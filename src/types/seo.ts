export interface SEOMetadata {
    path: string; // The URL path (e.g., "/about")
    title: string;
    description: string;
    keywords: string;
    ogImage?: string;
    schemaMarkup?: string; // JSON string
    isVisible: boolean; // index vs noindex
    updatedAt?: any;
}
