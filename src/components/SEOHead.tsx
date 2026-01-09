import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import type { SEOMetadata } from '../types/seo';

interface SEOHeadProps {
    defaultTitle?: string;
    defaultDescription?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
    defaultTitle = "Faith Assembly Church",
    defaultDescription = "Welcome to Faith Assembly Church. Join us for worship, fellowship, and community."
}) => {
    const location = useLocation();
    const [metadata, setMetadata] = useState<SEOMetadata | null>(null);

    useEffect(() => {
        const fetchSEO = async () => {
            try {
                // Try to find a matching document for this path
                // We use a query because formatting the path as a doc ID might vary (slashes etc)
                // But for simplicity/performance in this plan, let's assume we store them by path ID or query

                // Strategy: Query 'seo_metadata' where 'path' == location.pathname
                const q = query(collection(db, 'seo_metadata'), where('path', '==', location.pathname));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    setMetadata(querySnapshot.docs[0].data() as SEOMetadata);
                } else {
                    setMetadata(null); // Fallback to defaults
                }
            } catch (error) {
                console.error("Error fetching SEO metadata:", error);
            }
        };

        fetchSEO();
    }, [location.pathname]);

    const title = metadata?.title || defaultTitle;
    const description = metadata?.description || defaultDescription;
    const keywords = metadata?.keywords || "church, faith, assembly, worship, jesus, god, community";
    const image = metadata?.ogImage || "/assets/logo.jpg";
    const isVisible = metadata?.isVisible ?? true;

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={window.location.href} />
            <meta property="og:type" content="website" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Visibility / Robots */}
            <meta name="robots" content={isVisible ? "index, follow" : "noindex, nofollow"} />

            {/* Schema Markup */}
            {metadata?.schemaMarkup && (
                <script type="application/ld+json">
                    {metadata.schemaMarkup}
                </script>
            )}
        </Helmet>
    );
};

export default SEOHead;
