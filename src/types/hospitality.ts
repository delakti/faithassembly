export interface HospitalityMember {
    id: string;
    name: string;
    role: 'Team Lead' | 'Volunteer' | 'Trainee';
    team: 'Coffee' | 'Greeting' | 'Cooking' | 'Setup';
    phone: string;
    email: string;
    status: 'active' | 'inactive';
    createdAt?: any;
}

export interface HospitalityEvent {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    type: 'Training' | 'Meeting' | 'Social' | 'Service';
    attendees: number;
    createdAt?: any;
}

export interface HospitalityShift {
    id: string;
    date: string;
    event: string;
    time: string;
    role: string;
    location: string;
    status: 'Confirmed' | 'Pending' | 'Swap Requested';
    team: string[];
    assigneeId?: string;
    createdAt?: any;
}

export interface HospitalityNotice {
    id: string;
    author: string;
    role: string;
    title: string;
    content: string;
    createdAt: any;
    commentsCount?: number;
    attachmentsCount?: number;
}
