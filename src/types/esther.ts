export interface Devotional {
    id?: string;
    title: string;
    author: string;
    date: string;
    preview: string;
    content: string; // Full content
    image: string;
    tags: string[];
    createdAt?: any;
    status: 'Draft' | 'Published';
}

export interface EstherEvent {
    id?: string;
    title: string;
    date: string;
    time: string;
    location: string;
    description?: string;
    image: string;
    spots: number;
    createdAt?: any;
}
