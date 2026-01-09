import React, { useState } from 'react';
import {
    HiSpeakerphone,
    HiPlus,
    HiOutlineCalendar,
    HiX
} from 'react-icons/hi';
import { format } from 'date-fns';

const LifeAnnouncements: React.FC = () => {
    const [messages, setMessages] = useState([
        { id: 1, title: 'No Class Next Week', content: 'Due to the church picnic, there will be no Life Discussion class on Sunday, Jan 21st.', date: '2024-01-14', author: 'Pastor Ola', type: 'urgent' },
        { id: 2, title: 'New Study Series: The Book of Acts', content: 'We are starting a new journey through Acts next month. Please read chapters 1-2.', date: '2024-01-07', author: 'Sis. Sarah', type: 'info' },
    ]);

    const [isCreating, setIsCreating] = useState(false);
    const [newMsg, setNewMsg] = useState({ title: '', content: '' });

    const handlePost = (e: React.FormEvent) => {
        e.preventDefault();
        const msg = {
            id: messages.length + 1,
            title: newMsg.title,
            content: newMsg.content,
            date: format(new Date(), 'yyyy-MM-dd'),
            author: 'Current User', // Replace with actual user
            type: 'info'
        };
        setMessages([msg, ...messages]);
        setIsCreating(false);
        setNewMsg({ title: '', content: '' });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Class Announcements</h1>
                    <p className="text-slate-500">Stay updated with the latest news.</p>
                </div>
                {!isCreating && (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-sky-600 rounded-lg text-white hover:bg-sky-700 shadow-sm"
                    >
                        <HiPlus className="w-5 h-5" />
                        <span>Post Update</span>
                    </button>
                )}
            </div>

            {isCreating && (
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 animate-in fade-in zoom-in duration-300">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800">New Announcement</h3>
                        <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600">
                            <HiX className="w-5 h-5" />
                        </button>
                    </div>
                    <form onSubmit={handlePost} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Title (e.g. Schedule Change)"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none font-bold"
                            value={newMsg.title}
                            onChange={(e) => setNewMsg({ ...newMsg, title: e.target.value })}
                            required
                        />
                        <textarea
                            placeholder="Write your message here..."
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none h-32 resize-none"
                            value={newMsg.content}
                            onChange={(e) => setNewMsg({ ...newMsg, content: e.target.value })}
                            required
                        ></textarea>
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-lg">Cancel</button>
                            <button type="submit" className="px-6 py-2 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700">Post</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex gap-4 transition-all hover:shadow-md">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${msg.type === 'urgent' ? 'bg-rose-100 text-rose-600' : 'bg-sky-100 text-sky-600'
                            }`}>
                            <HiSpeakerphone className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-slate-800">{msg.title}</h3>
                                <span className="text-xs text-slate-400 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-full">
                                    <HiOutlineCalendar className="w-3 h-3" />
                                    {msg.date}
                                </span>
                            </div>
                            <p className="text-slate-600 leading-relaxed mb-3">{msg.content}</p>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Posted by</span>
                                <span className="text-xs font-bold text-sky-600">{msg.author}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LifeAnnouncements;
