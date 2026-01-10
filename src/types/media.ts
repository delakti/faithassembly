export interface MediaEquipmentItem {
    id: string;
    name: string;
    status: 'Operational' | 'Maintenance' | 'Critical';
    category: 'Camera' | 'Audio' | 'Video' | 'Lighting' | 'Other';
    lastCheck: any; // Timestamp
    notes: string;
}

export interface MediaBrief {
    id: string;
    title: string;
    content: string;
    series: string;
    date: any; // Timestamp
}

export interface MediaTeamMember {
    name: string;
    role: string;
    status: 'online' | 'offline' | 'busy';
}

export interface MediaTeamGroup {
    id: string;
    name: string;
    lead: string;
    members: MediaTeamMember[];
}

export interface MediaResource {
    id: string;
    name: string;
    type: 'file' | 'folder';
    size: string;
    date: string;
    items?: number | null;
    url?: string;
}

export interface MediaService {
    id: string;
    date: any; // Timestamp or string for simplicity in display
    time: string;
    event: string;
    series: string;
    team: {
        [key: string]: string; // role key -> person name
    };
}
