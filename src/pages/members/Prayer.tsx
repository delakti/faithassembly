import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { FaPray, FaPaperPlane } from 'react-icons/fa';

const Prayer: React.FC = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const [loading, setLoading] = useState(false);
    const [request, setRequest] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [contactRequest, setContactRequest] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addDoc(collection(db, 'prayer_requests'), {
                userId: isAnonymous ? null : user?.uid,
                userName: isAnonymous ? 'Anonymous' : user?.displayName,
                content: request,
                isAnonymous,
                requestContact: contactRequest,
                status: 'received', // received, praying, answered
                timestamp: serverTimestamp()
            });
            setRequest('');
            alert("Prayer request sent. We are standing with you in prayer.");
        } catch (error) {
            console.error("Error sending prayer request:", error);
            alert("Failed to send request.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-orange-500 p-8 text-white">
                <div className="flex items-center mb-4">
                    <FaPray className="text-4xl mr-4" />
                    <div>
                        <h1 className="text-2xl font-bold">Prayer Wall</h1>
                        <p className="text-orange-100">"For where two or three gather in my name, there am I with them." - Matt 18:20</p>
                    </div>
                </div>
            </div>

            <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">How can we pray for you?</label>
                        <textarea
                            required
                            className="w-full p-4 border border-gray-300 rounded-xl h-40 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Share your prayer request here..."
                            value={request}
                            onChange={e => setRequest(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col space-y-3">
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                className="form-checkbox h-5 w-5 text-orange-500 rounded"
                                checked={isAnonymous}
                                onChange={e => setIsAnonymous(e.target.checked)}
                            />
                            <span className="text-gray-700">Submit anonymously</span>
                        </label>

                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                className="form-checkbox h-5 w-5 text-orange-500 rounded"
                                checked={contactRequest}
                                onChange={e => setContactRequest(e.target.checked)}
                            />
                            <span className="text-gray-700">I would like a pastor to contact me</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-700 transition shadow-lg flex items-center justify-center"
                    >
                        {loading ? 'Sending...' : (
                            <>
                                <FaPaperPlane className="mr-2" /> Send Request
                            </>
                        )}
                    </button>
                </form>

                {/* Optional: Add a list of recent public prayer requests here if desired */}
            </div>
        </div>
    );
};

export default Prayer;
