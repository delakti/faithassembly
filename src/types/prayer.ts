export interface PrayerRequest {
    id: string;
    author: string;
    category: string; // Healing, Growth, Deliverance, etc.
    date: string;
    content: string;
    praying: number;
    isPrivate: boolean;
    answered: boolean;
    createdAt?: any;
}

export interface PrayerSlot {
    id: string;
    day: string;
    time: string;
    focus: string;
    status: 'Open' | 'Assigned';
    assignedTo: string | null;
    createdAt?: any;
}

export interface PrayerAnnouncement {
    id: string;
    title: string;
    date: string;
    content: string;
    type: 'Emergency' | 'General' | 'Testimony';
    createdAt?: any;
}
