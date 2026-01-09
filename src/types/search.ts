export type AccessLevel = 'public' | 'member' | 'volunteer' | 'admin' | 'finance' | 'children_staff';
export type SearchCategory = 'Service' | 'Event' | 'Study' | 'News' | 'Page' | 'Admin' | 'Product';

export interface SearchItem {
    id: string;
    title: string;
    description: string;
    category: SearchCategory;
    tags: string[];
    url: string;
    accessLevel: AccessLevel;
    updatedAt: string; // ISO String
    priority?: number; // 1 (High) to 10 (Low)
}
