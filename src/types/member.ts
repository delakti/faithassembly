import type { UserRole } from './auth';
export type { UserRole };

export interface MemberProfile {
    uid: string;
    email: string;
    displayName: string;
    role: UserRole;
    phone?: string;
    address?: string;
    dateOfBirth?: string;
    giftAidStatus?: 'active' | 'inactive' | 'pending';
    membershipDate?: string;
    groups?: string[]; // Array of Group IDs
}
