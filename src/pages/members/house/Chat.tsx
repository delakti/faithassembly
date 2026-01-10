import React, { useState, useEffect, useRef } from 'react';
import { useHouseFellowship } from '../../../layouts/HouseLayout';
import { db } from '../../../firebase';
import { collection, addDoc, query, orderBy, limit, onSnapshot, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { FaPaperPlane } from 'react-icons/fa';

interface Message {
    id: string;
    text: string;
    sender: string;
    senderId: string;
    timestamp: any;
}

const HouseChat: React.FC = () => {
    const { fellowship } = useHouseFellowship();
    const auth = getAuth();
    const user = auth.currentUser;
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const dummyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!fellowship?.name) return;

        const q = query(
            collection(db, 'fellowships', fellowship.name, 'messages'),
            orderBy('timestamp', 'asc'),
            limit(50)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Message));
            setMessages(msgs);
            dummyRef.current?.scrollIntoView({ behavior: 'smooth' });
        });

        return () => unsubscribe();
    }, [fellowship]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fellowship?.name || !newMessage.trim() || !user) return;

        try {
            await addDoc(collection(db, 'fellowships', fellowship.name, 'messages'), {
                text: newMessage,
                sender: user.displayName || 'Member',
                senderId: user.uid,
                timestamp: Timestamp.now()
            });
            setNewMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-200px)] max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-sm">
                <h2 className="font-bold flex items-center">
                    {fellowship?.name} Chat
                </h2>
                <span className="text-xs bg-blue-500 px-2 py-1 rounded-full text-blue-100">
                    {messages.length} messages
                </span>
            </div>

            {/* Messages Area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.length === 0 && (
                    <div className="text-center text-gray-400 mt-10">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                )}
                {messages.map(msg => {
                    const isMe = msg.senderId === user?.uid;
                    return (
                        <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <div className={`px-4 py-2 rounded-2xl max-w-[80%] shadow-sm ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                                }`}>
                                <p className="text-sm">{msg.text}</p>
                            </div>
                            <span className="text-[10px] text-gray-400 mt-1 px-1">
                                {isMe ? 'You' : msg.sender} • {msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                            </span>
                        </div>
                    );
                })}
                <div ref={dummyRef}></div>
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex items-center gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-blue-300 transition shadow-sm"
                >
                    <FaPaperPlane />
                </button>
            </form>
        </div>
    );
};

export default HouseChat;
