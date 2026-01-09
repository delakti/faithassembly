import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, query, getDocs, orderBy, updateDoc, doc, limit } from 'firebase/firestore';
import { FaCalendarCheck, FaSignature, FaUsers, FaSpinner, FaCheck, FaTimes } from 'react-icons/fa';

const MemberManager: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'members' | 'appointments' | 'giftaid'>('members');
    const [loading, setLoading] = useState(false);

    const [members, setMembers] = useState<any[]>([]);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [declarations, setDeclarations] = useState<any[]>([]);

    useEffect(() => {
        if (activeTab === 'members') fetchMembers();
        if (activeTab === 'appointments') fetchAppointments();
        if (activeTab === 'giftaid') fetchGiftAid();
    }, [activeTab]);

    const fetchMembers = async () => {
        setLoading(true);
        try {
            // Fetch users with role 'member' or 'user' (to approve)
            const q = query(collection(db, 'users'), orderBy('created_at', 'desc'), limit(50));
            const snap = await getDocs(q);
            setMembers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (error) {
            console.error("Error fetching members", error);
        } finally { setLoading(false); }
    };

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'), limit(50));
            const snap = await getDocs(q);
            setAppointments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (error) {
            console.error("Error fetching appointments", error);
        } finally { setLoading(false); }
    };

    const fetchGiftAid = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'gift_aid_declarations'), orderBy('dateDeclared', 'desc'), limit(50));
            const snap = await getDocs(q);
            setDeclarations(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (error) {
            console.error("Error fetching gift aid", error);
        } finally { setLoading(false); }
    };

    const updateMemberRole = async (userId: string, newRole: string) => {
        if (!window.confirm(`Are you sure you want to promote this user to ${newRole}?`)) return;
        try {
            await updateDoc(doc(db, 'users', userId), { role: newRole });
            fetchMembers(); // Refresh
        } catch (error) {
            console.error("Error updating role", error);
        }
    };

    const updateAppointmentStatus = async (appId: string, status: string) => {
        try {
            await updateDoc(doc(db, 'appointments', appId), { status });
            fetchAppointments(); // Refresh
        } catch (error) {
            console.error("Error updating appointment", error);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Member Administration</h1>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 space-x-8">
                {[
                    { id: 'members', label: 'Members', icon: <FaUsers /> },
                    { id: 'appointments', label: 'Appointments', icon: <FaCalendarCheck /> },
                    { id: 'giftaid', label: 'Gift Aid', icon: <FaSignature /> },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 pb-3 px-2 border-b-2 font-medium transition ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {loading && <div className="text-center py-8"><FaSpinner className="animate-spin inline text-2xl text-blue-600" /></div>}

            {/* Members Tab */}
            {activeTab === 'members' && !loading && (
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Role</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {members.map(member => (
                                <tr key={member.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.display_name || member.displayName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${member.role === 'member' ? 'bg-blue-100 text-blue-800' :
                                            member.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {member.role || 'user'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        {member.role !== 'member' && member.role !== 'admin' && (
                                            <button onClick={() => updateMemberRole(member.id, 'member')} className="text-blue-600 hover:text-blue-900 font-bold ml-4">
                                                Approve Member
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && !loading && (
                <div className="space-y-4">
                    {appointments.map(app => (
                        <div key={app.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-gray-900">{app.userName}</h3>
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${app.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                        app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                        }`}>{app.status}</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">Request with <strong>{app.pastor}</strong></p>
                                <div className="text-sm text-gray-500">
                                    <p>Date: {app.date} at {app.timeSlot}</p>
                                    <p>Reason: {app.reason}</p>
                                    <p className="italic mt-1">"{app.notes}"</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {app.status === 'pending' && (
                                    <>
                                        <button onClick={() => updateAppointmentStatus(app.id, 'confirmed')} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100" title="Confirm">
                                            <FaCheck />
                                        </button>
                                        <button onClick={() => updateAppointmentStatus(app.id, 'cancelled')} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100" title="Cancel">
                                            <FaTimes />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Gift Aid Tab */}
            {activeTab === 'giftaid' && !loading && (
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Address</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {declarations.map(decl => (
                                <tr key={decl.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {decl.title} {decl.firstName} {decl.lastName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{decl.addressLine1}, {decl.postcode}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(decl.dateDeclared).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                                        Active
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MemberManager;
