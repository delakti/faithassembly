import React, { useState, useEffect, useRef } from 'react';
import { HiPaperAirplane, HiHashtag } from 'react-icons/hi';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import type { YouthMessage } from '../../types/youth';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

const CHANNELS = [
    { id: '1', name: 'General' },
    { id: '2', name: 'Prayer Requests' },
    { id: '3', name: 'Testimonies' },
    { id: '4', name: 'Memes' },
];

const YouthChat: React.FC = () => {
    const [messages, setMessages] = useState<YouthMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [activeChannel, setActiveChannel] = useState(CHANNELS[0].id);
    const [activeChannelName, setActiveChannelName] = useState(CHANNELS[0].name);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const currentUser = auth.currentUser;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const q = query(
            collection(db, 'youth_chat'),
            where('channelId', '==', activeChannel),
            orderBy('createdAt', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as YouthMessage[];
            setMessages(data);
        });

        const selectedChannel = CHANNELS.find(c => c.id === activeChannel);
        if (selectedChannel) setActiveChannelName(selectedChannel.name);

        return () => unsubscribe();
    }, [activeChannel]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        if (!currentUser) {
            toast.error('You must be logged in to chat');
            return;
        }

        try {
            await addDoc(collection(db, 'youth_chat'), {
                text: newMessage,
                senderId: currentUser.uid,
                senderName: currentUser.displayName || 'Anonymous',
                channelId: activeChannel,
                createdAt: serverTimestamp(),
                avatar: currentUser.photoURL || '',
                likes: 0
            });
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message');
        }
    };

    const formatTime = (timestamp: any) => {
        if (!timestamp) return 'Sending...';
        // Handle Firestore Timestamp
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return format(date, 'h:mm a');
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
                            onClick={() => setActiveChannel(channel.id)}
                            className={`w-full text-left px-4 py-3 rounded-xl font-bold flex items-center transition-all ${activeChannel === channel.id
                                ? 'bg-yellow-400 text-black'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <HiHashtag className={`w-4 h-4 mr-2 ${activeChannel === channel.id ? 'text-black' : 'text-gray-500'}`} />
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
                        <h2 className="text-white font-bold text-lg">{activeChannelName}</h2>
                    </div>
                    <span className="text-xs text-green-500 font-bold flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                        On Air
                    </span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.length === 0 && (
                        <div className="text-center text-gray-600 py-10">
                            <p>No messages yet in #{activeChannelName}. Be the first!</p>
                        </div>
                    )}
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-4 group ${msg.senderId === currentUser?.uid ? 'justify-end' : ''}`}>
                            {msg.senderId !== currentUser?.uid && (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden">
                                    {msg.avatar ? <img src={msg.avatar} alt={msg.senderName} className="w-full h-full object-cover" /> : msg.senderName.charAt(0)}
                                </div>
                            )}
                            <div className={`flex-1 max-w-[80%] ${msg.senderId === currentUser?.uid ? 'flex flex-col items-end' : ''}`}>
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-white font-bold">{msg.senderName}</span>
                                    <span className="text-xs text-gray-500">{formatTime(msg.createdAt)}</span>
                                </div>
                                <p className={`text-gray-300 leading-relaxed p-3 rounded-xl inline-block ${msg.senderId === currentUser?.uid ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-800/50 rounded-tl-none'}`}>
                                    {msg.text}
                                </p>
                            </div>
                            {msg.senderId === currentUser?.uid && (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden">
                                    {msg.avatar ? <img src={msg.avatar} alt={msg.senderName} className="w-full h-full object-cover" /> : msg.senderName.charAt(0)}
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-800 bg-gray-900">
                    <form onSubmit={handleSend} className="relative">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder={`Message #${activeChannelName}...`}
                            className="w-full bg-black border border-gray-800 text-white rounded-xl py-4 pl-4 pr-12 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all font-medium"
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="absolute right-2 top-2 p-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
