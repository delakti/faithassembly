export type UserRole = 'admin' | 'volunteer' | 'user' | 'member' | 'children_staff' | 'finance';

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
