export interface SearchItem {
    id: string;
    title: string;
    description: string;
    category: 'Page' | 'Portal' | 'Service' | 'Event' | 'Admin' | 'Resource';
    tags: string[];
    url: string;
    icon?: string; // Optional icon name for future dynamic icon rendering
}

export const SEARCH_INDEX: SearchItem[] = [
    // --- Main Pages ---
    { id: 'home', title: 'Home', description: 'Welcome to Faith Assembly.', category: 'Page', tags: ['home', 'index', 'welcome', 'main'], url: '/' },
    { id: 'about', title: 'About Us', description: 'Our history, beliefs, and mission.', category: 'Page', tags: ['about', 'history', 'beliefs', 'mission', 'vision'], url: '/about' },
    { id: 'leadership', title: 'Our Leadership', description: 'Meet our pastors and leaders.', category: 'Page', tags: ['pastors', 'leaders', 'team', 'staff'], url: '/leadership' },
    { id: 'contact', title: 'Contact Us', description: 'Get in touch with us.', category: 'Page', tags: ['contact', 'email', 'phone', 'address', 'location', 'map'], url: '/contact' },
    { id: 'visit', title: 'Plan Your Visit', description: 'Everything you need to know for your first visit.', category: 'Page', tags: ['visit', 'new', 'guest', 'sunday', 'parking'], url: '/plan-visit' },
    { id: 'services', title: 'Service Times', description: 'Join us for worship.', category: 'Service', tags: ['worship', 'times', 'sunday', 'service', 'online'], url: '/services' },
    { id: 'give', title: 'Give Online', description: 'Support the ministry securely.', category: 'Page', tags: ['give', 'tithe', 'offering', 'donate', 'money'], url: '/give' },
    { id: 'ministries', title: 'Ministries', description: 'Discover ways to get involved.', category: 'Page', tags: ['ministries', 'groups', 'serve'], url: '/ministries' },

    // --- Life Discussion (Sunday School) ---
    { id: 'life-login', title: 'Life Discussion Login', description: 'Access for students and teachers.', category: 'Portal', tags: ['sunday school', 'life', 'discussion', 'class', 'login'], url: '/life-discussion/login' },
    { id: 'life-dash', title: 'Life Discussion Dashboard', description: 'Your class overview.', category: 'Portal', tags: ['sunday school', 'life', 'dashboard'], url: '/life-discussion/dashboard' },
    { id: 'life-assign', title: 'Assignments', description: 'View and submit study tasks.', category: 'Resource', tags: ['homework', 'tasks', 'study', 'assignments'], url: '/life-discussion/my-assignments' },
    { id: 'life-res', title: 'Class Resources', description: 'Lesson plans and materials.', category: 'Resource', tags: ['files', 'downloads', 'lessons', 'pdfs'], url: '/life-discussion/resources' },

    // --- Members Portal ---
    { id: 'mem-login', title: 'Member Login', description: 'Access your member profile.', category: 'Portal', tags: ['member', 'login', 'account'], url: '/members/login' },
    { id: 'mem-give', title: 'Giving History', description: 'View your tithes and download statements.', category: 'Resource', tags: ['finance', 'tax', 'statement', 'giving'], url: '/members/giving' },
    { id: 'mem-pray', title: 'Prayer Requests', description: 'Submit a request for prayer.', category: 'Service', tags: ['prayer', 'help', 'pastoral'], url: '/members/prayer' },

    // --- Youth Ministry ---
    { id: 'youth-login', title: 'Youth Portal', description: 'Gen Z / Youth movement.', category: 'Portal', tags: ['youth', 'teens', 'gen z', 'login'], url: '/youth/login' },
    { id: 'youth-events', title: 'Youth Events', description: 'Upcoming hangouts and services.', category: 'Event', tags: ['youth', 'calendar', 'party', 'service'], url: '/youth/events' },

    // --- Men's Fellowship ---
    { id: 'men-login', title: 'Men\'s Fellowship', description: 'Men of Valor portal.', category: 'Portal', tags: ['men', 'valor', 'brothers', 'login'], url: '/men/login' },

    // --- Women's Fellowship ---
    { id: 'women-login', title: 'Women of Faith', description: 'Esther Generation portal.', category: 'Portal', tags: ['women', 'esther', 'sisters', 'login'], url: '/esther/login' },

    // --- Children's Ministry ---
    { id: 'kids-login', title: 'Children\'s Ministry', description: 'Staff and parent portal.', category: 'Portal', tags: ['children', 'kids', 'parents', 'login', 'nursery'], url: '/children/login' },
    { id: 'kids-checkin', title: 'Child Check-In', description: 'Secure check-in system.', category: 'Service', tags: ['checkin', 'security', 'kids'], url: '/children/attendance' },

    // --- Operational Portals ---
    { id: 'fin-login', title: 'Finance Portal', description: 'Authorized finance staff only.', category: 'Admin', tags: ['finance', 'admin', 'money', 'budget'], url: '/finance/login' },
    { id: 'super-login', title: 'Super Admin', description: 'System administration.', category: 'Admin', tags: ['super', 'admin', 'root', 'settings'], url: '/admin/super/login' },
    { id: 'media-login', title: 'Media Team', description: 'Tech and production crew.', category: 'Portal', tags: ['media', 'tech', 'sound', 'video'], url: '/media/login' },
    { id: 'worship-login', title: 'Worship Team', description: 'Choir and musicians.', category: 'Portal', tags: ['worship', 'choir', 'music', 'band'], url: '/worship/login' },
    { id: 'volunteer-login', title: 'Volunteer Hub', description: 'General volunteer shifts.', category: 'Portal', tags: ['serve', 'help', 'volunteer'], url: '/team/login' },

    // --- Store ---
    { id: 'store', title: 'Online Store', description: 'Books, merchandise, and resources.', category: 'Service', tags: ['store', 'shop', 'books', 'buy'], url: '/store' },
    { id: 'cart', title: 'Shopping Cart', description: 'View items in your cart.', category: 'Service', tags: ['cart', 'checkout', 'buy'], url: '/store/checkout' },
];
