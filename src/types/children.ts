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
