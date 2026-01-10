export interface UsherMember {
    id: string;
    name: string;
    role: 'Head Usher' | 'Senior Usher' | 'Usher' | 'Trainee';
    phone: string;
    email: string;
    team: string; // e.g., "Team Alpha", "Midweek Squad"
    status: 'active' | 'probation' | 'leave';
    createdAt?: any;
}

export interface UsherDuty {
    position: string; // e.g., "Main Entrance", "Left Aisle"
    assigneeId: string;
    assigneeName: string;
    status: 'pending' | 'confirmed' | 'swap_requested';
}

export interface UsherService {
    id: string;
    date: string; // ISO date string or display string
    time: string;
    name: string; // e.g. "Main Service"
    team: string; // e.g. "Team Alpha"
    duties: UsherDuty[];
    status: 'upcoming' | 'active' | 'completed';
    createdAt?: any;
}

export interface UsherStockItem {
    id: string;
    name: string;
    category: 'Stationery' | 'Sacraments' | 'Uniform' | 'Hygiene' | 'Other';
    quantity: number;
    minLevel: number;
    status: 'good' | 'low';
    createdAt?: any;
}
