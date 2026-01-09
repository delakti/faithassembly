export type UserRole = 'super_admin' | 'admin' | 'volunteer' | 'user' | 'member' | 'children_staff' | 'finance';

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    role: UserRole;
    photoURL?: string;
    createdAt?: any;
    lastLogin?: any;
}
