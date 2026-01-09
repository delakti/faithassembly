import React, { useState } from 'react';
import { HiDownload, HiPlay, HiBookOpen, HiSearch, HiShieldCheck } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const RESOURCES = [
    {
        id: 1,
        title: "The Man in the Mirror",
        type: "book",
        author: "Recommended Reading",
        desc: "Solving the 24 problems men face. A field manual for personal reflection.",
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: 2,
        title: "Kingdom Man - Session 1",
        type: "video",
        author: "Tony Evans",
        duration: "45m",
        desc: "Understanding your mandate as a leader in your home and community.",
        image: "https://images.unsplash.com/photo-1478737270239-2f52b7126fea?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: 3,
        title: "30-Day Spiritual Bootcamp",
        type: "pdf",
        author: "Ministry HQ",
        size: "1.2 MB",
        desc: "A daily training regimen for prayer and scripture memorization.",
        image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: 4,
        title: "Wild at Heart",
        type: "book",
        author: "John Eldredge",
        desc: "Discovering the secret of a man's soul and the adventure God intended.",
        image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800&auto=format&fit=crop&q=60"
    }
];

const MenResources: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredResources = RESOURCES.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAction = (_type: string, title: string) => {
        toast.success(`Accessing ${title}...`);
    };

    return (
        <div className="space-y-8 font-sans">
            <div className="mb-12 border-l-4 border-slate-900 pl-6">
                <span className="text-indigo-600 font-bold tracking-widest uppercase text-xs mb-2 block">Equipment & Logistics</span>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic">The Armory</h1>
                <p className="text-slate-500 font-medium mt-2 max-w-2xl">
                    "Put on the full armor of God." Strategic resources to equip you for the fight of faith.
                </p>
            </div>

            {/* Search Bar */}
            <div className="bg-slate-900 p-1 rounded-lg max-w-lg mx-auto mb-12 shadow-2xl">
                <div className="relative">
                    <HiSearch className="absolute left-4 top-3.5 text-slate-500 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="SEARCH DATABASE..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold uppercase tracking-wider"
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredResources.map((resource) => (
                    <div key={resource.id} className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-2xl transition-all group flex flex-col">
                        <div className="h-40 overflow-hidden relative bg-slate-100">
                            <img src={resource.image} alt={resource.title} className="w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute top-3 right-3">
                                <span className={`inline-block px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider shadow ${resource.type === 'video' ? 'bg-red-600 text-white' :
                                    resource.type === 'pdf' ? 'bg-indigo-600 text-white' :
                                        'bg-orange-500 text-white'
                                    }`}>
                                    {resource.type}
                                </span>
                            </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-lg font-black text-slate-900 mb-2 leading-tight uppercase italic group-hover:text-indigo-600 transition-colors">
                                {resource.title}
                            </h3>
                            <p className="text-xs font-bold text-slate-400 uppercase mb-3">{resource.author}</p>
                            <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                                {resource.desc}
                            </p>

                            <button
                                onClick={() => handleAction(resource.type, resource.title)}
                                className="w-full py-3 mt-auto border-2 border-slate-200 rounded font-bold uppercase tracking-widest text-xs hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                {resource.type === 'video' ? <><HiPlay className="w-4 h-4" /> Watch Intel</> :
                                    resource.type === 'pdf' ? <><HiDownload className="w-4 h-4" /> Download</> :
                                        <><HiBookOpen className="w-4 h-4" /> View Guide</>}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 p-8 bg-slate-100 rounded-xl border border-dashed border-slate-300 text-center">
                <HiShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-slate-900 font-bold uppercase tracking-wide mb-2">Request Additional Supplies</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                    Need a specific study guide or training material? Submit a requisition form to the leadership team.
                </p>
                <button className="text-indigo-600 font-black text-sm uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
                    Submit Request
                </button>
            </div>
        </div>
    );
};

export default MenResources;
