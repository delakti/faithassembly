import React from 'react';
import { useHouseFellowship } from '../../../layouts/HouseLayout';
import { FaUserCircle, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const HouseDashboard: React.FC = () => {
    const { fellowship, members, loading, updateMember } = useHouseFellowship();
    const [selectedMember, setSelectedMember] = React.useState<any | null>(null);
    const [isEditing, setIsEditing] = React.useState(false);
    const [editForm, setEditForm] = React.useState<any>({});
    const [isSaving, setIsSaving] = React.useState(false);

    const handleUpdateMember = async () => {
        if (!selectedMember) return;
        setIsSaving(true);
        try {
            await updateMember(selectedMember.id, editForm);

            // Update displayed member and close edit mode
            setSelectedMember((prev: any) => ({ ...prev, ...editForm }));
            setIsEditing(false);
        } catch (error) {
            alert('Failed to update member. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return null; // Layout handles main loader

    return (
        <div className="max-w-5xl mx-auto space-y-8 relative">
            {/* Header / Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to {fellowship?.name}</h2>
                    <p className="text-gray-500 flex items-center mb-1">
                        <FaUserCircle className="mr-2" /> Led by: <span className="font-medium text-gray-800 ml-1">{fellowship?.leaders}</span>
                    </p>
                    {fellowship?.details && (
                        <div className="text-sm text-gray-500 space-y-1 mt-3">
                            {fellowship.details.venue && (
                                <p className="flex items-center"><FaMapMarkerAlt className="mr-2 text-blue-500" /> {fellowship.details.venue}</p>
                            )}
                            {fellowship.details.meetingDays && (
                                <p className="flex items-center"><FaClock className="mr-2 text-green-500" /> {fellowship.details.meetingDays}</p>
                            )}
                        </div>
                    )}
                </div>
                {fellowship?.details?.image && (
                    <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                        <img src={fellowship.details.image} alt={fellowship.name} className="w-full h-full object-cover" />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Members List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900 text-lg">Group Members</h3>
                            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                                {members.length} Active
                            </span>
                        </div>

                        {members.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No members found in this group.</div>
                        ) : (
                            <ul className="divide-y divide-gray-50">
                                {members.map(member => (
                                    <li
                                        key={member.id}
                                        onClick={() => setSelectedMember(member)}
                                        className="p-4 hover:bg-gray-50 transition flex items-center space-x-4 cursor-pointer"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 flex items-center justify-center font-bold text-sm">
                                            {(member.firstName?.[0] || '?')}{(member.lastName?.[0] || '')}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 group-hover:text-blue-600">{member.firstName} {member.lastName}</p>
                                            <div className="flex flex-col sm:flex-row sm:gap-4 text-xs text-gray-500">
                                                <span>{member.email}</span>
                                                {member.phone && <span>• {member.phone}</span>}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Sidebar: Announcements & Upcoming */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                        <h3 className="font-bold text-lg mb-2">Next Meeting</h3>
                        <p className="opacity-90 text-sm mb-4">Join us for fellowship, prayer, and study.</p>
                        <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                            <p className="font-bold text-lg">Wednesday, 7:00 PM</p>
                            <p className="text-sm opacity-80">Zoom / {fellowship?.details?.venue || 'TBA'}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="p-3 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 text-sm font-medium transition text-center">
                                Prayer Request
                            </button>
                            <button className="p-3 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 text-sm font-medium transition text-center">
                                Contact Leader
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Member Details Modal */}
            {selectedMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setSelectedMember(null); setIsEditing(false); }}></div>
                    <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="bg-blue-600 p-6 text-center flex-shrink-0 relative">
                            <button
                                onClick={() => { setSelectedMember(null); setIsEditing(false); }}
                                className="absolute top-4 right-4 text-white/70 hover:text-white p-1"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>

                            {!isEditing ? (
                                <>
                                    <div className="w-20 h-20 mx-auto bg-white text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mb-3 shadow-lg">
                                        {(selectedMember.firstName?.[0] || '?')}{(selectedMember.lastName?.[0] || '')}
                                    </div>
                                    <h3 className="text-xl font-bold text-white">{selectedMember.firstName} {selectedMember.lastName}</h3>
                                    <p className="text-blue-100 text-sm">Fellowship Member</p>

                                    {fellowship?.isLeader && (
                                        <button
                                            onClick={() => {
                                                setEditForm(selectedMember);
                                                setIsEditing(true);
                                            }}
                                            className="absolute top-4 left-4 text-white/80 hover:text-white text-sm font-bold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm"
                                        >
                                            Edit
                                        </button>
                                    )}
                                </>
                            ) : (
                                <h3 className="text-xl font-bold text-white mb-1">Edit Details</h3>
                            )}
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4 overflow-y-auto">
                            {!isEditing ? (
                                // VIEW MODE
                                <>
                                    <div className="grid grid-cols-[24px_1fr] gap-3 items-start">
                                        <span className="text-gray-400 mt-1">📧</span>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase">Email</p>
                                            <a href={`mailto:${selectedMember.email}`} className="text-sm font-medium text-blue-600 hover:underline">
                                                {selectedMember.email}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-[24px_1fr] gap-3 items-start">
                                        <span className="text-gray-400 mt-1">📱</span>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase">Phone</p>
                                            {selectedMember.phone ? (
                                                <a href={`tel:${selectedMember.phone}`} className="text-sm font-medium text-blue-600 hover:underline">
                                                    {selectedMember.phone}
                                                </a>
                                            ) : (
                                                <p className="text-sm font-medium text-gray-900">N/A</p>
                                            )}
                                        </div>
                                    </div>

                                    {(selectedMember.address || selectedMember.city) && (
                                        <div className="grid grid-cols-[24px_1fr] gap-3 items-start">
                                            <span className="text-gray-400 mt-1">📍</span>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase">Address</p>
                                                <a
                                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedMember.address}, ${selectedMember.city} ${selectedMember.postcode}`)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm font-medium text-blue-600 hover:underline block"
                                                >
                                                    {selectedMember.address}<br />
                                                    {selectedMember.city} {selectedMember.postcode}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {selectedMember.birthDate && (
                                        <div className="grid grid-cols-[24px_1fr] gap-3 items-start">
                                            <span className="text-gray-400 mt-1">🎂</span>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase">Birthday</p>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {/* Format YYYY-MM-DD to DD-MM */}
                                                    {selectedMember.birthDate.split('-').reverse().slice(0, 2).join('-')}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                // EDIT MODE
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">First Name</label>
                                            <input
                                                type="text"
                                                value={editForm.firstName || ''}
                                                onChange={e => setEditForm({ ...editForm, firstName: e.target.value })}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Last Name</label>
                                            <input
                                                type="text"
                                                value={editForm.lastName || ''}
                                                onChange={e => setEditForm({ ...editForm, lastName: e.target.value })}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
                                        <input
                                            type="tel"
                                            value={editForm.phone || ''}
                                            onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Address</label>
                                        <input
                                            type="text"
                                            value={editForm.address || ''}
                                            onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="House Number + Street Name"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">City</label>
                                            <input
                                                type="text"
                                                value={editForm.city || ''}
                                                onChange={e => setEditForm({ ...editForm, city: e.target.value })}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Postcode</label>
                                            <input
                                                type="text"
                                                value={editForm.postcode || ''}
                                                onChange={e => setEditForm({ ...editForm, postcode: e.target.value })}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Birthday</label>
                                        <input
                                            type="date"
                                            value={editForm.birthDate || ''}
                                            onChange={e => setEditForm({ ...editForm, birthDate: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleUpdateMember}
                                        disabled={isSaving}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setSelectedMember(null)}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Close
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HouseDashboard;
