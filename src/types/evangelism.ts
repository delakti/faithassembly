export interface EvangelismEvent {
    id: string;
    title: string;
    type: string;
    date: string;
    time: string;
    location: string;
    teamLead: string;
    slots: number;
    filled: number;
    urgency: 'high' | 'medium' | 'low';
    status?: 'open' | 'full'; // Computed or stored
    createdAt?: any;
}

export interface EvangelismConvert {
    id: string;
    name: string;
    date: string;
    location: string;
    status: 'New' | 'Contacted' | 'Baptized' | 'Discipled';
    contact: string;
    assignedTo: string;
    notes?: string;
    createdAt?: any;
}

export interface EvangelismTestimony {
    id: string;
    author: string;
    date: string;
    title: string;
    content: string;
    likes: number;
    comments: number;
    createdAt?: any;
}

export interface EvangelismStats {
    soulsWon: number;
    followUps: number;
    nextOutreachDate: string;
    testimoniesCount: number;
}
