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
