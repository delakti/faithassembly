import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, getDocs, orderBy, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { FaExclamationTriangle, FaPlus, FaUserInjured, FaClipboardCheck, FaSearch } from 'react-icons/fa';
import type { Incident, Child } from '../../types/children';

const IncidentReport: React.FC = () => {
    const [incidents, setIncidents] = useState<(Incident & { id: string })[]>([]);
    const [children, setChildren] = useState<(Child & { id: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [formData, setFormData] = useState<Incident>({
        childId: '',
        childName: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        description: '',
        actionTaken: '',
        witnesses: '',
        reportedBy: '',
        parentNotified: false,
        severity: 'Low'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Incidents
            const incQuery = query(collection(db, 'children_incidents'), orderBy('date', 'desc'));
            const incSnap = await getDocs(incQuery);
            const incData = incSnap.docs.map(d => ({ id: d.id, ...d.data() } as Incident & { id: string }));
            setIncidents(incData);

            // Fetch Children for dropdown
            const childQuery = query(collection(db, 'children'), orderBy('firstName', 'asc'));
            const childSnap = await getDocs(childQuery);
            const childData = childSnap.docs.map(d => ({ id: d.id, ...d.data() } as Child & { id: string }));
            setChildren(childData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'childId') {
            const selectedChild = children.find(c => c.id === value);
            setFormData({
                ...formData,
                childId: value,
                childName: selectedChild ? `${selectedChild.firstName} ${selectedChild.lastName}` : ''
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.checked });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await addDoc(collection(db, 'children_incidents'), {
                ...formData,
                createdAt: serverTimestamp()
            });
            alert("Incident report filed successfully.");
            setShowForm(false);
            setFormData({
                childId: '',
                childName: '',
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
                description: '',
                actionTaken: '',
                witnesses: '',
                reportedBy: '',
                parentNotified: false,
                severity: 'Low'
            });
            fetchData(); // Refresh list
        } catch (error) {
            console.error("Error filing report:", error);
            alert("Failed to file report.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this report? This action cannot be undone.")) return;
        try {
            await deleteDoc(doc(db, 'children_incidents', id));
            setIncidents(incidents.filter(i => i.id !== id));
        } catch (error) {
            console.error("Error deleting report:", error);
            alert("Failed to delete report.");
        }
    };

    const filteredIncidents = incidents.filter(incident =>
        incident.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Incident Reporting</h1>
                    <p className="text-gray-500">Log and track injuries, behavioral issues, or other incidents.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-red-600 transition flex items-center shadow-md"
                >
                    <FaPlus className="mr-2" /> {showForm ? 'Cancel' : 'New Report'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-2xl shadow-md border border-red-100 animate-fade-in-down">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <FaExclamationTriangle className="mr-2 text-red-500" /> File Incident Report
                    </h2>
                    <div className="bg-red-50 p-4 rounded-xl text-red-800 text-sm mb-6 border border-red-100">
                        <strong>Confidentiality Notice:</strong> This report is for internal church records only. Please be objective and factual.
                    </div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Child Involved</label>
                            <select
                                name="childId"
                                value={formData.childId}
                                onChange={handleChange}
                                required
                                className="w-full p-3 border rounded-xl bg-gray-50"
                            >
                                <option value="">Select a child...</option>
                                {children.map(child => (
                                    <option key={child.id} value={child.id}>{child.firstName} {child.lastName} ({child.assignedGroup})</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Incident</label>
                            <input required type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-3 border rounded-xl" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                            <input required type="time" name="time" value={formData.time} onChange={handleChange} className="w-full p-3 border rounded-xl" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                            <select name="severity" value={formData.severity} onChange={handleChange} className="w-full p-3 border rounded-xl bg-gray-50">
                                <option value="Low">Low (Minor cut/scrape, mild disruption)</option>
                                <option value="Medium">Medium (First aid required, parent called)</option>
                                <option value="High">High (Significant injury, aggressive behavior)</option>
                                <option value="Critical">Critical (Emergency services called)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Reported By (Staff Name)</label>
                            <input required name="reportedBy" value={formData.reportedBy} onChange={handleChange} className="w-full p-3 border rounded-xl" placeholder="e.g. Deacon John" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description of Incident</label>
                            <textarea required name="description" value={formData.description} onChange={handleChange} className="w-full p-3 border rounded-xl h-32" placeholder="Describe exactly what happened, where, and who was involved..." />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Action Taken</label>
                            <textarea required name="actionTaken" value={formData.actionTaken} onChange={handleChange} className="w-full p-3 border rounded-xl h-24" placeholder="First aid applied, separated children, etc..." />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Witnesses</label>
                            <input name="witnesses" value={formData.witnesses} onChange={handleChange} className="w-full p-3 border rounded-xl" placeholder="Names of other staff/adults present..." />
                        </div>

                        <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" name="parentNotified" checked={formData.parentNotified} onChange={handleCheckboxChange} className="w-5 h-5 text-red-600 rounded focus:ring-red-500" />
                                <span className="text-gray-900 font-bold">Parent/Guardian has been notified</span>
                            </label>
                        </div>

                        <div className="md:col-span-2 pt-2">
                            <button type="submit" disabled={submitting} className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition shadow-lg">
                                {submitting ? 'Filing Report...' : 'Submit Incident Report'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Search */}
            <div className="relative">
                <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search past reports..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-200 outline-none"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            {/* List */}
            {loading ? (
                <div className="text-center py-12 text-gray-400">Loading reports...</div>
            ) : filteredIncidents.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-300 text-2xl">
                        <FaClipboardCheck />
                    </div>
                    <h3 className="text-lg font-bold text-gray-600">No Incidents Found</h3>
                    <p className="text-gray-400">Hopefully, that stays the case!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredIncidents.map((incident) => (
                        <div key={incident.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl
                                        ${incident.severity === 'Critical' ? 'bg-red-600' :
                                            incident.severity === 'High' ? 'bg-orange-500' :
                                                incident.severity === 'Medium' ? 'bg-yellow-500' : 'bg-blue-400'}
                                    `}>
                                        <FaUserInjured />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{incident.childName}</h3>
                                        <p className="text-sm text-gray-500">{new Date(incident.date).toLocaleDateString()} at {incident.time}</p>
                                    </div>
                                </div>
                                <span className={`mt-2 md:mt-0 px-3 py-1 rounded-full text-xs font-bold uppercase
                                    ${incident.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                                        incident.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                                            incident.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}
                                `}>
                                    {incident.severity} Severity
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <strong className="block text-gray-700 mb-1">Incident Description:</strong>
                                    <p className="text-gray-600">{incident.description}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <strong className="block text-gray-700 mb-1">Action Taken:</strong>
                                    <p className="text-gray-600">{incident.actionTaken}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-xs text-gray-400 border-t border-gray-100 pt-3">
                                <div className="flex space-x-4">
                                    <span>Reported by: <strong>{incident.reportedBy}</strong></span>
                                    <span>Parent Notified: <strong>{incident.parentNotified ? 'Yes' : 'No'}</strong></span>
                                </div>
                                <button
                                    onClick={() => incident.id && handleDelete(incident.id)}
                                    className="text-red-400 hover:text-red-600 font-bold opacity-0 group-hover:opacity-100 transition"
                                >
                                    Delete Record
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default IncidentReport;
