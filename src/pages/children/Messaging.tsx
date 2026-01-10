import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, getDocs, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { FaPaperPlane, FaHistory, FaUsers, FaCheckCircle } from 'react-icons/fa';
import type { Message, Child, ChildGroup } from '../../types/children';

const ParentMessaging: React.FC = () => {
    const [messages, setMessages] = useState<(Message & { id: string })[]>([]);
    const [children, setChildren] = useState<Child[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'compose' | 'history'>('compose');
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [recipientType, setRecipientType] = useState<'All' | 'Group' | 'Individual'>('All');
    const [selectedGroup, setSelectedGroup] = useState<ChildGroup>('Creche');
    const [selectedChildId, setSelectedChildId] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Messages
            const msgQuery = query(collection(db, 'children_messages'), orderBy('createdAt', 'desc'));
            const msgSnap = await getDocs(msgQuery);
            const msgData = msgSnap.docs.map(d => ({ id: d.id, ...d.data() } as Message & { id: string }));
            setMessages(msgData);

            // Fetch Children for recipient calculation
            const childrenQuery = query(collection(db, 'children'));
            const childrenSnap = await getDocs(childrenQuery);
            const childrenData = childrenSnap.docs.map(d => d.data() as Child);
            setChildren(childrenData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateRecipientCount = (): number => {
        if (recipientType === 'All') return children.length;
        if (recipientType === 'Group') return children.filter(c => c.assignedGroup === selectedGroup).length;
        if (recipientType === 'Individual') return selectedChildId ? 1 : 0;
        return 0;
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const count = calculateRecipientCount();
        if (count === 0) {
            alert("No recipients selected!");
            setSubmitting(false);
            return;
        }

        try {
            const newMessage: Message = {
                recipients: recipientType === 'All' ? 'All' : recipientType === 'Group' ? selectedGroup : [selectedChildId],
                recipientCount: count,
                subject,
                body,
                sender: 'Admin', // In real app, get from auth context
                status: 'Sent',
                sentAt: new Date().toISOString()
            };

            await addDoc(collection(db, 'children_messages'), {
                ...newMessage,
                createdAt: serverTimestamp()
            });

            alert(`Message sent to ${count} parent(s)!`);

            // Reset Form and Switch to History
            setSubject('');
            setBody('');
            setActiveTab('history');
            fetchData();
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to send message.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Parent Messaging</h1>
                    <p className="text-gray-500">Send announcements and updates to parents.</p>
                </div>
                <div className="bg-gray-100 p-1 rounded-xl flex">
                    <button
                        onClick={() => setActiveTab('compose')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'compose' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Compose
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'history' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        History
                    </button>
                </div>
            </div>

            {activeTab === 'compose' && (
                <div className="bg-white p-6 rounded-2xl shadow-md border border-indigo-100 animate-fade-in-down">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                        <FaPaperPlane className="mr-3 text-indigo-500" /> New Message
                    </h2>
                    <form onSubmit={handleSend} className="space-y-6">
                        {/* Recipients Section */}
                        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                            <label className="block text-sm font-bold text-indigo-800 mb-2">Recipients</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition ${recipientType === 'All' ? 'bg-white border-indigo-300 shadow-sm' : 'bg-transparent border-transparent hover:bg-indigo-100'}`}>
                                    <input type="radio" name="recipientType" checked={recipientType === 'All'} onChange={() => setRecipientType('All')} className="mr-3 text-indigo-600" />
                                    <span className="font-medium text-gray-700">All Parents</span>
                                </label>
                                <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition ${recipientType === 'Group' ? 'bg-white border-indigo-300 shadow-sm' : 'bg-transparent border-transparent hover:bg-indigo-100'}`}>
                                    <input type="radio" name="recipientType" checked={recipientType === 'Group'} onChange={() => setRecipientType('Group')} className="mr-3 text-indigo-600" />
                                    <span className="font-medium text-gray-700">Specific Group</span>
                                </label>
                                <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition ${recipientType === 'Individual' ? 'bg-white border-indigo-300 shadow-sm' : 'bg-transparent border-transparent hover:bg-indigo-100'}`}>
                                    <input type="radio" name="recipientType" checked={recipientType === 'Individual'} onChange={() => setRecipientType('Individual')} className="mr-3 text-indigo-600" />
                                    <span className="font-medium text-gray-700">Individual</span>
                                </label>
                            </div>

                            {recipientType === 'Group' && (
                                <select
                                    value={selectedGroup}
                                    onChange={(e) => setSelectedGroup(e.target.value as ChildGroup)}
                                    className="w-full p-3 border rounded-xl bg-white"
                                >
                                    <option value="Creche">Creche (0-4)</option>
                                    <option value="Primary">Primary (5-11)</option>
                                    <option value="Teens">Teens (12-18)</option>
                                </select>
                            )}
                            {recipientType === 'Individual' && (
                                <select
                                    value={selectedChildId}
                                    onChange={(e) => setSelectedChildId(e.target.value)}
                                    className="w-full p-3 border rounded-xl bg-white"
                                >
                                    <option value="">Select a child's parent...</option>
                                    {children.map((child: any) => (
                                        <option key={child.id} value={child.id}>{child.firstName} {child.lastName} ({child.parentName})</option>
                                    ))}
                                </select>
                            )}

                            <div className="mt-3 flex items-center text-sm text-indigo-600 font-bold">
                                <FaUsers className="mr-2" />
                                <span>Estimated Recipients: {calculateRecipientCount()} parent(s)</span>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                            <input required value={subject} onChange={e => setSubject(e.target.value)} className="w-full p-3 border rounded-xl" placeholder="e.g. Important: Service Time Change" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Message Body</label>
                            <textarea required value={body} onChange={e => setBody(e.target.value)} className="w-full p-3 border rounded-xl h-40" placeholder="Type your message here..." />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg flex items-center justify-center text-lg"
                        >
                            {submitting ? 'Sending...' : <><FaPaperPlane className="mr-2" /> Send Message</>}
                        </button>
                    </form>
                </div>
            )}

            {activeTab === 'history' && (
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-12 text-gray-400">Loading history...</div>
                    ) : messages.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 text-2xl">
                                <FaHistory />
                            </div>
                            <h3 className="text-lg font-bold text-gray-600">No Messages Sent</h3>
                            <p className="text-gray-400">Your sent history will appear here.</p>
                        </div>
                    ) : (
                        messages.map(msg => (
                            <div key={msg.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-gray-900">{msg.subject}</h3>
                                    <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center">
                                        <FaCheckCircle className="mr-1" /> Sent
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500 mb-4">
                                    To: <strong>{Array.isArray(msg.recipients) ? 'Individual Parent' : msg.recipients}</strong> •
                                    {new Date(msg.sentAt || msg.createdAt).toLocaleString()} •
                                    <span className="ml-1 text-indigo-600">{msg.recipientCount} recipient(s)</span>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl text-gray-700 text-sm whitespace-pre-wrap">
                                    {msg.body}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default ParentMessaging;
