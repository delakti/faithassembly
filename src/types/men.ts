export interface MenEvent {
    id: string;
    title: string;
    objective: string;
    date: string;
    time: string;
    location: string;
    image: string;
    spots: number;
    createdAt?: any;
}

export interface MenAnnouncement {
    id: string;
    title: string;
    author: string;
    date: string;
    preview: string;
    image: string;
    tags: string[];
    createdAt?: any;
}

export interface MenChallenge {
    id: string;
    title: string;
    content: string;
    verse: string; // e.g., "Romans 12"
    createdAt?: any;
}
