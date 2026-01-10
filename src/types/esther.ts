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

export interface WallPost {
    id?: string;
    author: string;
    avatar?: string; // Optional avatar URL
    category: 'Prayer Request' | 'Testimony';
    title: string;
    content: string;
    likes: number;
    comments: number;
    createdAt?: any;
}

export interface EstherResource {
    id?: string;
    title: string;
    type: 'document' | 'video';
    author: string;
    size?: string; // e.g. "2.4 MB" for documents
    duration?: string; // e.g. "1h 12m" for videos
    desc: string;
    image: string; // Thumbnail
    url: string; // Download/Watch link
    createdAt?: any;
}

export interface EstherGroup {
    id?: string;
    name: string;
    leader: string;
    schedule: string;
    desc: string;
    image: string;
    createdAt?: any;
    // Computed fields
    memberCount?: number;
    members?: number; // compat
    joined?: boolean; // client-side
}

export interface GroupMember {
    id?: string;
    groupId: string;
    userId: string;
    userName: string; // Snapshot of name
    userEmail?: string;
    joinedAt: any;
}

export interface EstherDashboardContent {
    id?: string; // e.g. 'main'
    verse: {
        text: string;
        reference: string;
    };
    highlights: {
        id: number;
        title: string;
        desc: string;
        action: string;
        color: 'yellow' | 'blue' | 'green';
        icon: 'sparkles' | 'calendar' | 'users';
    }[];
}
