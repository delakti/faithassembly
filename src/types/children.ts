export type ChildGroup = 'Creche' | 'Primary' | 'Teens';

export interface Child {
    id?: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    parentName: string;
    parentPhone: string;
    parentEmail?: string;
    address?: string;
    allergies?: string;
    medicalNotes?: string;
    assignedGroup: ChildGroup | string;
    consentPhoto: boolean;
    consentTrips: boolean;
    checkInCode?: string; // Future use
    createdAt?: any;
    updatedAt?: any;
}

export interface Lesson {
    id?: string;
    title: string;
    topic: string;
    date: string;
    assignedGroup: ChildGroup | 'All';
    scriptureReference: string;
    content: string;
    resourceLink?: string;
    createdAt?: any;
}

export interface Event {
    id?: string;
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    assignedGroup: ChildGroup | 'All';
    organizer: string;
    createdAt?: any;
}

export type IncidentSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Incident {
    id?: string;
    childId: string;
    childName: string; // Denormalized for easier display
    date: string;
    time: string;
    description: string;
    actionTaken: string;
    witnesses: string; // Staff names
    reportedBy: string;
    parentNotified: boolean;
    severity: IncidentSeverity;
    createdAt?: any;
}
