import React, { useState } from 'react';
import { HiPaperAirplane, HiHashtag } from 'react-icons/hi';

const MOCK_MESSAGES = [
    { id: 1, user: 'Micah T.', avatar: '', text: 'Anyone going to the worship night on Friday?', time: '2:30 PM', likes: 4 },
    { id: 2, user: 'Sarah J.', avatar: '', text: 'Yesss! I heard the setlist is fire 🔥', time: '2:32 PM', likes: 2 },
    { id: 3, user: 'David K.', avatar: '', text: 'I need a lift from Hayes if anyone is passing through?', time: '2:45 PM', likes: 0 },
];

const CHANNELS = [
    { id: '1', name: 'General', active: true },
    { id: '2', name: 'Prayer Requests', active: false },
    { id: '3', name: 'Testimonies', active: false },
    { id: '4', name: 'Memes', active: false },
];

const YouthChat: React.FC = () => {
    const [messages, setMessages] = useState(MOCK_MESSAGES);
    const [newMessage, setNewMessage] = useState('');

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const msg = {
            id: messages.length + 1,
            user: 'You',
            avatar: '',
            text: newMessage,
            time: 'Just now',
            likes: 0
        };
        setMessages([...messages, msg]);
        setNewMessage('');
    };

    return (
        <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
            {/* Sidebar Channels */}
            <div className="hidden lg:block bg-gray-900 border border-gray-800 rounded-3xl p-6 overflow-y-auto">
                <h3 className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-4">Channels</h3>
                <div className="space-y-2">
                    {CHANNELS.map(channel => (
                        <button
                            key={channel.id}
                            className={`w-full text-left px-4 py-3 rounded-xl font-bold flex items-center transition-all ${channel.active
                                ? 'bg-yellow-400 text-black'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <HiHashtag className={`w-4 h-4 mr-2 ${channel.active ? 'text-black' : 'text-gray-500'}`} />
                            {channel.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-3 bg-gray-900 border border-gray-800 rounded-3xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                    <div className="flex items-center">
                        <HiHashtag className="w-5 h-5 text-gray-400 mr-2" />
                        <h2 className="text-white font-bold text-lg">General</h2>
                    </div>
                    <span className="text-xs text-green-500 font-bold flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                        12 Online
                    </span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg) => (
                        <div key={msg.id} className="flex gap-4 group">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                {msg.user.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-white font-bold">{msg.user}</span>
                                    <span className="text-xs text-gray-500">{msg.time}</span>
                                </div>
                                <p className="text-gray-300 leading-relaxed bg-gray-800/50 p-3 rounded-r-xl rounded-bl-xl inline-block max-w-[90%]">
                                    {msg.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-800 bg-gray-900">
                    <form onSubmit={handleSend} className="relative">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Message #General..."
                            className="w-full bg-black border border-gray-800 text-white rounded-xl py-4 pl-4 pr-12 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all font-medium"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-2 p-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors"
                        >
                            <HiPaperAirplane className="w-5 h-5 transform rotate-90" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default YouthChat;
