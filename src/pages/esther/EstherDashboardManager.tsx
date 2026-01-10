import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { HiSave, HiSparkles, HiCalendar, HiUserGroup } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import type { EstherDashboardContent } from '../../types/esther';

const DEFAULT_CONTENT: EstherDashboardContent = {
    verse: {
        text: "She is clothed with strength and dignity; she can laugh at the days to come.",
        reference: "Proverbs 31:25"
    },
    highlights: [
        {
            id: 1,
            title: "New Devotional",
            desc: "Finding Peace in the Chaos - Sister Beatrice explores how we can stay grounded.",
            action: "Read More",
            color: "yellow",
            icon: "sparkles"
        },
        {
            id: 2,
            title: "Morning Prayer",
            desc: "Join us this Saturday at 7:00 AM for our monthly intercession circle.",
            action: "RSVP Now",
            color: "blue",
            icon: "calendar"
        },
        {
            id: 3,
            title: "Mentoring Groups",
            desc: "Applications for the Spring mentorship cohort are now open.",
            action: "Learn More",
            color: "green",
            icon: "users"
        }
    ]
};

const EstherDashboardManager: React.FC = () => {
    const [content, setContent] = useState<EstherDashboardContent>(DEFAULT_CONTENT);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const docRef = doc(db, 'esther_content', 'dashboard');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setContent(docSnap.data() as EstherDashboardContent);
                }
            } catch (error) {
                console.error("Error fetching dashboard content:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await setDoc(doc(db, 'esther_content', 'dashboard'), content);
            toast.success("Dashboard updated successfully!");
        } catch (error) {
            console.error("Error saving content:", error);
            toast.error("Failed to update dashboard.");
        }
    };

    const updateHighlight = (index: number, field: string, value: string) => {
        const newHighlights = [...content.highlights];
        newHighlights[index] = { ...newHighlights[index], [field]: value };
        setContent({ ...content, highlights: newHighlights });
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading editor...</div>;

    return (
        <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-rose-50 flex justify-between items-center bg-rose-50/30">
                <h2 className="text-xl font-bold text-rose-950">Manage Dashboard</h2>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-8">
                {/* Verse Section */}
                <section className="space-y-4">
                    <h3 className="font-bold text-gray-800 border-b pb-2">Verse of the Day</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Scripture Text</label>
                        <textarea
                            value={content.verse.text}
                            onChange={(e) => setContent({ ...content, verse: { ...content.verse, text: e.target.value } })}
                            className="w-full p-3 border rounded-xl h-24 focus:ring-rose-500 focus:border-rose-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
                        <input
                            value={content.verse.reference}
                            onChange={(e) => setContent({ ...content, verse: { ...content.verse, reference: e.target.value } })}
                            className="w-full p-3 border rounded-xl focus:ring-rose-500 focus:border-rose-500"
                        />
                    </div>
                </section>

                {/* Highlights Section */}
                <section className="space-y-6">
                    <h3 className="font-bold text-gray-800 border-b pb-2">Promotional Highlights</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        {content.highlights.map((highlight, index) => (
                            <div key={index} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold
                                    ${highlight.color === 'yellow' ? 'bg-yellow-500' :
                                        highlight.color === 'blue' ? 'bg-blue-500' : 'bg-green-500'}`}>
                                    {highlight.icon === 'sparkles' && <HiSparkles />}
                                    {highlight.icon === 'calendar' && <HiCalendar />}
                                    {highlight.icon === 'users' && <HiUserGroup />}
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Title</label>
                                    <input
                                        value={highlight.title}
                                        onChange={(e) => updateHighlight(index, 'title', e.target.value)}
                                        className="w-full p-2 border rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                                    <textarea
                                        value={highlight.desc}
                                        onChange={(e) => updateHighlight(index, 'desc', e.target.value)}
                                        className="w-full p-2 border rounded-lg text-sm h-20"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Button Label</label>
                                    <input
                                        value={highlight.action}
                                        onChange={(e) => updateHighlight(index, 'action', e.target.value)}
                                        className="w-full p-2 border rounded-lg text-sm"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                    <button type="submit" className="px-8 py-3 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 shadow-md flex items-center">
                        <HiSave className="mr-2" /> Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EstherDashboardManager;
