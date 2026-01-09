export type UserRole =
    | 'super_admin'
    | 'admin'
    | 'finance'
    | 'children_staff'
    | 'volunteer'
    | 'member'
    | 'user'
    // Youth
    | 'youth_member'
    | 'youth_leader'
    // Esther
    | 'esther_member'
    | 'esther_leader'
    // Men's
    | 'mens_member'
    | 'mens_leader'
    // Worship
    | 'worship_member'
    | 'worship_leader'
    | 'worship_team'
    // Ushering
    | 'usher_member'
    | 'usher_leader'
    // Hospitality
    | 'hospitality_member'
    | 'hospitality_leader'
    // Prayer
    | 'prayer_member'
    | 'prayer_leader'
    | 'prayer_team'
    // Media
    | 'media_member'
    | 'media_leader'
    | 'media_team'
    // Evangelism
    | 'evangelism_member'
    | 'evangelism_leader'
    // Life Discussion (Sunday School)
    | 'sunday_student'
    | 'sunday_teacher'
    | 'sunday_admin';

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    role: UserRole;
    photoURL?: string;
    createdAt?: any;
    lastLogin?: any;
}
