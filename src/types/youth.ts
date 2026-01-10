export interface YouthEvent {
    id: string; // Firestore doc ID
    title: string;
    date: string;
    location: string;
    desc: string;
    image: string;
    registrationLink?: string; // Optional link for external RSVP
    createdAt?: any; // Firestore Timestamp
}

export interface YouthMedia {
    id: string;
    title: string;
    type: 'video' | 'document';
    author: string;
    date: string;
    thumbnail: string | null;
    duration?: string; // for videos
    size?: string; // for documents
    url: string; // link to resource
    createdAt?: any;
}

export interface YouthMessage {
    id: string;
    text: string;
    senderId: string;
    senderName: string;
    channelId: string;
    createdAt: any;
    avatar?: string;
    likes?: number; // Optional feature
}

export interface YouthFeedPost {
    id: string;
    author: string;
    content: string;
    createdAt: any;
    role: string;
}
