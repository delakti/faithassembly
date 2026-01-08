import { Timestamp } from 'firebase/firestore';

export type StudyGuideMediaType = 'pdf' | 'html' | 'video';
export type StudyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type Visibility = 'public' | 'member' | 'admin';

export interface StudyGuide {
    id: string;
    title: string;
    description: string;
    type: StudyGuideMediaType;
    url: string; // Firebase Storage URL or HTML content string/url
    category: string;
    level: StudyLevel;
    tags: string[];
    visibility: Visibility;
    createdAt: Timestamp;
    author: string;
    downloadCount: number;
    thumbnailUrl?: string; // Optional thumbnail
}

export interface UserProgress {
    userId: string;
    guideId: string;
    status: 'started' | 'completed';
    lastAccessed: Timestamp;
    bookmarked: boolean;
}
