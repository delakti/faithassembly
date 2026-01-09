export type UserRole = 'admin' | 'volunteer' | 'user';

export interface Badge {
    id: string;
    name: string;
    icon: string; // URL or icon name
    description: string;
    dateEarned: any; // Firestore Timestamp
}

export interface VolunteerProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    role: UserRole;
    phone?: string;
    skills: string[]; // e.g., ["First Aid", "Media", "Teaching"]
    teams: string[]; // e.g., ["Welcome Team", "Kids Church"]
    badges: Badge[];
    hoursLogged: number;
    joinedDate: any; // Firestore Timestamp
    status: 'active' | 'inactive' | 'pending';
}

export interface Task {
    id: string;
    title: string;
    description: string;
    date: string; // ISO string for sorting
    startTime: string;
    endTime: string;
    location: string;
    assignedTo: string | null; // uid of volunteer or null if open
    team: string; // e.g., "Welcome Team"
    status: 'pending' | 'accepted' | 'completed' | 'cancelled';
    type: 'task' | 'shift';
    points: number; // For gamification
}

export interface Announcement {
    id: string;
    title: string;
    content: string;
    date: any;
    author: string;
    targetTeams: string[]; // ["All"] or specific teams
}
