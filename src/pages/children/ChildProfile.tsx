import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc, serverTimestamp, addDoc, collection } from 'firebase/firestore';
import { FaUser, FaPhone, FaNotesMedical, FaSave, FaArrowLeft } from 'react-icons/fa';

const ChildProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const isNew = !id;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        parentName: '',
        parentPhone: '',
        parentEmail: '',
        address: '',
        allergies: '',
        medicalNotes: '',
        assignedGroup: 'Creche', // Creche, Primary, Teens
        consentPhoto: false,
        consentTrips: false,
    });

    useEffect(() => {
        if (!isNew && id) {
            fetchChild(id);
        }
    }, [id]);

    const fetchChild = async (childId: string) => {
        setLoading(true);
        try {
            const docRef = doc(db, 'children', childId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setFormData(docSnap.data() as any);
            }
        } catch (error) {
            console.error("Error fetching child:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const childData = {
                ...formData,
                updatedAt: serverTimestamp()
            };

            if (isNew) {
                await addDoc(collection(db, 'children'), {
                    ...childData,
                    createdAt: serverTimestamp()
                });
                alert("Child registered successfully!");
                navigate('/children/directory');
            } else if (id) {
                await updateDoc(doc(db, 'children', id), childData);
                alert("Profile updated successfully!");
            }
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Failed to save profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={() => navigate('/children/directory')} className="mb-6 flex items-center text-gray-500 hover:text-gray-900 transition">
                <FaArrowLeft className="mr-2" /> Back to Directory
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-sky-500 p-8 text-white flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">{isNew ? 'Register New Child' : `${formData.firstName} ${formData.lastName}`}</h1>
                        <p className="text-sky-100 opacity-90">{isNew ? 'Enter child details below' : `Child Profile • ${formData.assignedGroup}`}</p>
                    </div>
                    {!isNew && (
                        <div className="w-16 h-16 bg-white text-sky-500 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                            {formData.firstName?.[0]}{formData.lastName?.[0]}
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Basic Info */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><FaUser className="mr-2 text-sky-500" /> Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input required name="firstName" value={formData.firstName} onChange={handleChange} className="w-full p-3 border rounded-xl" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input required name="lastName" value={formData.lastName} onChange={handleChange} className="w-full p-3 border rounded-xl" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                <input required type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full p-3 border rounded-xl" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Group</label>
                                <select name="assignedGroup" value={formData.assignedGroup} onChange={handleChange} className="w-full p-3 border rounded-xl bg-gray-50">
                                    <option value="Creche">Creche (0-4)</option>
                                    <option value="Primary">Primary (5-11)</option>
                                    <option value="Teens">Teens (12-18)</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <hr className="border-gray-100" />

                    {/* Parent Info */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><FaPhone className="mr-2 text-green-500" /> Parent/Guardian Contact</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input required name="parentName" value={formData.parentName} onChange={handleChange} className="w-full p-3 border rounded-xl" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input required type="tel" name="parentPhone" value={formData.parentPhone} onChange={handleChange} className="w-full p-3 border rounded-xl" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input type="email" name="parentEmail" value={formData.parentEmail} onChange={handleChange} className="w-full p-3 border rounded-xl" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <input name="address" value={formData.address} onChange={handleChange} className="w-full p-3 border rounded-xl" />
                            </div>
                        </div>
                    </section>

                    <hr className="border-gray-100" />

                    {/* Medical & Consent */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><FaNotesMedical className="mr-2 text-red-500" /> Medical & Consent</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Allergies (Critical)</label>
                                <input name="allergies" value={formData.allergies} onChange={handleChange} className="w-full p-3 border-2 border-red-100 rounded-xl focus:border-red-500" placeholder="e.g. Peanuts, Dairy, Penicillin..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Medical Notes</label>
                                <textarea name="medicalNotes" value={formData.medicalNotes} onChange={handleChange} className="w-full p-3 border rounded-xl h-24" placeholder="Any other medical conditions or needs..." />
                            </div>

                            <div className="flex flex-col space-y-3 bg-gray-50 p-4 rounded-xl">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input type="checkbox" name="consentPhoto" checked={formData.consentPhoto} onChange={handleChange} className="w-5 h-5 text-sky-600 rounded focus:ring-sky-500" />
                                    <span className="text-gray-900 font-medium">Photo Consent Granted</span>
                                </label>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input type="checkbox" name="consentTrips" checked={formData.consentTrips} onChange={handleChange} className="w-5 h-5 text-sky-600 rounded focus:ring-sky-500" />
                                    <span className="text-gray-900 font-medium">Trip/Outing Consent Granted</span>
                                </label>
                            </div>
                        </div>
                    </section>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-sky-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-sky-700 transition shadow-lg flex items-center justify-center"
                        >
                            {loading ? 'Saving...' : (
                                <>
                                    <FaSave className="mr-2" /> Save Profile
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChildProfile;
