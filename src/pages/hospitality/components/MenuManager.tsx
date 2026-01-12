import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import { toast } from 'react-hot-toast';
import { HiPlus, HiTrash, HiPencil, HiCalendar } from 'react-icons/hi';
import { format, parseISO } from 'date-fns';

const MenuManager: React.FC = () => {
    const [menus, setMenus] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [date, setDate] = useState('');
    const [serviceType, setServiceType] = useState('Sunday Service');
    const [main, setMain] = useState('');
    const [sides, setSides] = useState('');
    const [dessert, setDessert] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        const q = query(collection(db, 'hospitality_menus'), orderBy('date', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMenus(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const menuData = {
                date,
                serviceType,
                main,
                sides,
                dessert,
                notes,
                updatedAt: serverTimestamp()
            };

            if (isEditing && editingId) {
                await updateDoc(doc(db, 'hospitality_menus', editingId), menuData);
                toast.success('Menu updated successfully');
            } else {
                await addDoc(collection(db, 'hospitality_menus'), {
                    ...menuData,
                    createdAt: serverTimestamp()
                });
                toast.success('Menu scheduled successfully');
            }
            resetForm();
        } catch (error) {
            console.error('Error saving menu:', error);
            toast.error('Failed to save menu');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this menu?')) {
            try {
                await deleteDoc(doc(db, 'hospitality_menus', id));
                toast.success('Menu deleted');
            } catch (error) {
                toast.error('Failed to delete menu');
            }
        }
    };

    const handleEdit = (menu: any) => {
        setIsEditing(true);
        setEditingId(menu.id);
        setDate(menu.date);
        setServiceType(menu.serviceType);
        setMain(menu.main);
        setSides(menu.sides);
        setDessert(menu.dessert);
        setNotes(menu.notes);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setIsEditing(false);
        setEditingId(null);
        setDate('');
        setServiceType('Sunday Service');
        setMain('');
        setSides('');
        setDessert('');
        setNotes('');
    };

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm sticky top-8">
                    <h3 className="font-bold text-stone-900 mb-6 flex items-center gap-2">
                        {isEditing ? <HiPencil className="w-5 h-5 text-orange-500" /> : <HiPlus className="w-5 h-5 text-orange-500" />}
                        {isEditing ? 'Edit Menu' : 'Schedule Menu'}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Date</label>
                            <input
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Service Type</label>
                            <select
                                value={serviceType}
                                onChange={(e) => setServiceType(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                            >
                                <option>Sunday Service</option>
                                <option>Mid-Week Service</option>
                                <option>Special Event</option>
                                <option>Leader's Meeting</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Main Course</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Jollof Rice & Chicken"
                                value={main}
                                onChange={(e) => setMain(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Sides</label>
                            <input
                                type="text"
                                placeholder="e.g. Coleslaw, Plantain"
                                value={sides}
                                onChange={(e) => setSides(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Dessert (Optional)</label>
                            <input
                                type="text"
                                placeholder="e.g. Fruit Salad"
                                value={dessert}
                                onChange={(e) => setDessert(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Notes</label>
                            <textarea
                                rows={3}
                                placeholder="Allergy info, serving instructions..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all resize-none"
                            />
                        </div>

                        <div className="flex gap-2 pt-2">
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 px-4 py-2 bg-stone-100 text-stone-600 font-bold rounded-xl hover:bg-stone-200 transition-colors"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2 bg-stone-800 text-white font-bold rounded-xl hover:bg-stone-900 transition-colors shadow-lg"
                            >
                                {isEditing ? 'Update Menu' : 'Add to Schedule'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* List Section */}
            <div className="lg:col-span-2 space-y-6">
                {menus.length === 0 ? (
                    <div className="bg-stone-50 rounded-2xl p-8 text-center border border-dashed border-stone-200">
                        <HiCalendar className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                        <p className="text-stone-500 font-medium">No menus scheduled.</p>
                    </div>
                ) : (
                    menus.map((menu) => (
                        <div key={menu.id} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex justify-between items-start gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide">
                                        {menu.date ? format(parseISO(menu.date), 'MMM dd, yyyy') : 'No Date'}
                                    </span>
                                    <span className="text-stone-400 text-xs font-bold uppercase">•</span>
                                    <span className="text-stone-500 text-xs font-bold uppercase">{menu.serviceType}</span>
                                </div>

                                <h4 className="text-lg font-bold text-stone-800">{menu.main}</h4>
                                {(menu.sides || menu.dessert) && (
                                    <p className="text-stone-600 text-sm mt-1">
                                        {menu.sides && `w/ ${menu.sides}`}
                                        {menu.sides && menu.dessert && ' • '}
                                        {menu.dessert && `${menu.dessert}`}
                                    </p>
                                )}
                                {menu.notes && <p className="text-stone-400 text-xs italic mt-2">"{menu.notes}"</p>}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(menu)}
                                    className="p-2 text-stone-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                                >
                                    <HiPencil className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(menu.id)}
                                    className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <HiTrash className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MenuManager;
