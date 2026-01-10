export interface WorshipSong {
    id: string;
    title: string;
    artist: string;
    key: string;
    tempo: 'Slow' | 'Mid' | 'Up';
    theme: string;
    lyrics: boolean;
    chords: boolean;
    demo: boolean;
    createdAt?: any;
}

export interface WorshipMember {
    id: string;
    name: string;
    role: 'Worship Leader' | 'Musical Director' | 'Section Leader' | 'Member';
    section: 'Vocals' | 'Band' | 'Tech' | 'Media';
    part: string; // e.g. "Soprano", "Drums"
    email: string;
    phone: string;
    image?: string;
    status: 'active' | 'inactive';
    createdAt?: any;
}

export interface WorshipEvent {
    id: string;
    title: string;
    type: 'Service' | 'Rehearsal' | 'Special Event';
    date: string;
    time: string;
    location: string;
    setlist: string[]; // Array of song titles or IDs
    attendees: number;
    createdAt?: any;
}
