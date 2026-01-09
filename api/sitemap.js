export default async function handler(req, res) {
    const baseUrl = 'https://www.faithassembly.org.uk';
    const projectId = 'fauchurchconnect';
    
    // 1. Static Routes
    const staticRoutes = [
        '/',
        '/about',
        '/services',
        '/plan-visit',
        '/events',
        '/contact',
        '/give',
        '/volunteer',
        '/prayer',
        '/salvation',
        '/groups',
        '/bible-study',
        '/store',
        '/newcomers',
        '/sermons',
        '/decisions',
        '/feedback',
        '/news',
        '/testimony',
        '/baptism'
    ];

    try {
        // 2. Fetch Dynamic Data in Parallel
        const [eventsRes, productsRes, guidesRes] = await Promise.all([
            // Events (Realtime DB)
            fetch('https://fauchurchconnect-default-rtdb.europe-west1.firebasedatabase.app/Event.json'),
            
            // Products (Firestore) - Limit to 1000 for sitemap safety, though pagination represents best practice
            fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/products?pageSize=1000`),
            
            // Study Guides (Firestore)
            fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/studyGuides?pageSize=1000`)
        ]);

        const eventsData = eventsRes.ok ? await eventsRes.json() : null;
        const productsData = productsRes.ok ? await productsRes.json() : null;
        const guidesData = guidesRes.ok ? await guidesRes.json() : null;

        let dynamicUrls = [];

        // Process Events
        if (eventsData) {
            Object.keys(eventsData).forEach(id => {
                dynamicUrls.push(`/events/${id}`);
            });
        }

        // Process Products (Firestore structure is different)
        if (productsData && productsData.documents) {
            productsData.documents.forEach(doc => {
                const id = doc.name.split('/').pop();
                dynamicUrls.push(`/store/product/${id}`);
            });
        }

        // Process Study Guides
        if (guidesData && guidesData.documents) {
            guidesData.documents.forEach(doc => {
                const id = doc.name.split('/').pop();
                dynamicUrls.push(`/bible-study/${id}`);
            });
        }

        // 3. Generate XML
        const allUrls = [...staticRoutes, ...dynamicUrls];
        
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${allUrls.map(url => `
    <url>
        <loc>${baseUrl}${url}</loc>
        <changefreq>${url === '/' ? 'daily' : 'weekly'}</changefreq>
        <priority>${url === '/' ? '1.0' : '0.8'}</priority>
    </url>
    `).join('')}
</urlset>`;

        // 4. Return Response
        res.setHeader('Content-Type', 'text/xml');
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=59');
        res.status(200).send(sitemap);

    } catch (error) {
        console.error('Sitemap Error:', error);
        res.status(500).send('Error generating sitemap');
    }
}
